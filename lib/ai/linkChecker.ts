export interface LinkCheckResult {
  url: string
  isValid: boolean
  statusCode?: number
  error?: string
  redirectUrl?: string
}

export interface LinkCheckOptions {
  timeout?: number // Timeout in milliseconds (default: 5000)
  method?: 'HEAD' | 'GET' // HTTP method (default: HEAD)
}

export async function checkLink(
  url: string,
  options: LinkCheckOptions = {}
): Promise<LinkCheckResult> {
  const { timeout = 5000, method = 'HEAD' } = options

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    const response = await fetch(url, {
      method,
      signal: controller.signal,
      redirect: 'follow',
      // Add reasonable headers to avoid being blocked
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; TribalResourceHub/1.0; +https://tribalresourcehub.com)',
      },
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

export async function checkLinks(
  urls: string[],
  options: LinkCheckOptions & { parallel?: boolean; batchSize?: number } = {}
): Promise<LinkCheckResult[]> {
  const { parallel = true, batchSize = 10, ...checkOptions } = options

  // Sequential processing (old behavior)
  if (!parallel) {
    const results: LinkCheckResult[] = []
    for (const url of urls) {
      const result = await checkLink(url, checkOptions)
      results.push(result)
      await new Promise(resolve => setTimeout(resolve, 500))
    }
    return results
  }

  // Parallel processing with batching
  const results: LinkCheckResult[] = []

  for (let i = 0; i < urls.length; i += batchSize) {
    const batch = urls.slice(i, i + batchSize)

    const batchPromises = batch.map((url, index) =>
      // Stagger requests slightly within batch
      new Promise<LinkCheckResult>((resolve) =>
        setTimeout(
          () => resolve(checkLink(url, checkOptions)),
          index * 100 // 100ms stagger
        )
      )
    )

    const batchResults = await Promise.allSettled(batchPromises)

    batchResults.forEach((result) => {
      if (result.status === 'fulfilled') {
        results.push(result.value)
      }
    })

    // Wait between batches
    if (i + batchSize < urls.length) {
      await new Promise(resolve => setTimeout(resolve, 500))
    }
  }

  return results
}

export function filterBrokenLinks(results: LinkCheckResult[]): LinkCheckResult[] {
  return results.filter(r => !r.isValid)
}
