import {
  LINK_CHECK_TIMEOUT_MS,
  LINK_CHECK_BATCH_SIZE,
  LINK_CHECK_BATCH_DELAY_MS,
  LINK_CHECK_REQUEST_DELAY_MS,
} from '@/lib/constants'

export interface LinkCheckResult {
  url: string
  isValid: boolean
  statusCode?: number
  error?: string
  redirectUrl?: string
}

export interface LinkCheckOptions {
  timeout?: number // Timeout in milliseconds (default: from constants)
  method?: 'HEAD' | 'GET' // HTTP method (default: HEAD)
}

export async function checkLink(
  url: string,
  options: LinkCheckOptions = {}
): Promise<LinkCheckResult> {
  const { timeout = LINK_CHECK_TIMEOUT_MS, method = 'HEAD' } = options

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

/**
 * Checks multiple links with intelligent batching and rate limiting
 * @param urls - Array of URLs to check
 * @param options - Check options with parallel processing and batch configuration
 * @returns Array of link check results
 */
export async function checkLinks(
  urls: string[],
  options: LinkCheckOptions & { parallel?: boolean; batchSize?: number } = {}
): Promise<LinkCheckResult[]> {
  const { parallel = true, batchSize = LINK_CHECK_BATCH_SIZE, ...checkOptions } = options

  // Sequential processing (old behavior)
  if (!parallel) {
    const results: LinkCheckResult[] = []
    for (const url of urls) {
      const result = await checkLink(url, checkOptions)
      results.push(result)
      await new Promise(resolve => setTimeout(resolve, LINK_CHECK_BATCH_DELAY_MS))
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
          index * LINK_CHECK_REQUEST_DELAY_MS
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
      await new Promise(resolve => setTimeout(resolve, LINK_CHECK_BATCH_DELAY_MS))
    }
  }

  return results
}

export function filterBrokenLinks(results: LinkCheckResult[]): LinkCheckResult[] {
  return results.filter(r => !r.isValid)
}
