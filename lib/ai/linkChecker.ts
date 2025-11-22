export interface LinkCheckResult {
  url: string
  isValid: boolean
  statusCode?: number
  error?: string
  redirectUrl?: string
}

export async function checkLink(url: string): Promise<LinkCheckResult> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10s timeout

    const response = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
      redirect: 'follow',
    })

    clearTimeout(timeoutId)

    return {
      url,
      isValid: response.ok,
      statusCode: response.status,
      redirectUrl: response.url !== url ? response.url : undefined,
    }
  } catch (error) {
    return {
      url,
      isValid: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

export async function checkLinks(urls: string[]): Promise<LinkCheckResult[]> {
  const results: LinkCheckResult[] = []

  for (const url of urls) {
    const result = await checkLink(url)
    results.push(result)

    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 500))
  }

  return results
}

export function filterBrokenLinks(results: LinkCheckResult[]): LinkCheckResult[] {
  return results.filter(r => !r.isValid)
}
