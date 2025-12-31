import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Simple link checker
async function checkLink(url: string): Promise<{ url: string; isValid: boolean }> {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000)

    const response = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
      redirect: 'follow',
    })

    clearTimeout(timeout)
    return { url, isValid: response.ok || response.status < 400 }
  } catch {
    // Try GET if HEAD fails
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 10000)

      const response = await fetch(url, {
        method: 'GET',
        signal: controller.signal,
        redirect: 'follow',
      })

      clearTimeout(timeout)
      return { url, isValid: response.ok || response.status < 400 }
    } catch {
      return { url, isValid: false }
    }
  }
}

async function checkLinks(urls: string[]): Promise<{ url: string; isValid: boolean }[]> {
  const results: { url: string; isValid: boolean }[] = []
  const batchSize = 5

  for (let i = 0; i < urls.length; i += batchSize) {
    const batch = urls.slice(i, i + batchSize)
    const batchResults = await Promise.all(batch.map(checkLink))
    results.push(...batchResults)

    // Small delay between batches
    if (i + batchSize < urls.length) {
      await new Promise(resolve => setTimeout(resolve, 500))
    }
  }

  return results
}

async function verifyAllLinks() {
  const now = new Date()
  console.log('Starting link verification for all resources, scholarships, and grants...\n')

  // 1. Verify Resource Links
  console.log('=== RESOURCES ===')
  const resources = await prisma.resource.findMany({
    where: {
      url: { not: null },
      deletedAt: null,
    },
    select: {
      id: true,
      url: true,
      title: true,
    },
  })

  const resourceUrls = resources
    .map((r) => r.url)
    .filter((url): url is string => url !== null)

  console.log(`Checking ${resourceUrls.length} resource links...`)
  const resourceResults = await checkLinks(resourceUrls)

  let resourcesVerified = 0
  let resourcesBroken = 0

  for (const result of resourceResults) {
    const resource = resources.find((r) => r.url === result.url)
    if (resource) {
      await prisma.resource.update({
        where: { id: resource.id },
        data: {
          lastVerified: now,
          verifiedBy: result.isValid ? 'auto-check' : 'auto-check-broken',
        },
      })
      if (result.isValid) {
        resourcesVerified++
      } else {
        resourcesBroken++
        console.log(`  ❌ Broken: ${resource.title}`)
      }
    }
  }
  console.log(`✅ Resources: ${resourcesVerified} verified, ${resourcesBroken} broken\n`)

  // 2. Verify Scholarship Links
  console.log('=== SCHOLARSHIPS ===')
  const scholarships = await prisma.scholarship.findMany({
    where: {
      url: { not: null },
      deletedAt: null,
    },
    select: {
      id: true,
      url: true,
      name: true,
    },
  })

  const scholarshipUrls = scholarships
    .map((s) => s.url)
    .filter((url): url is string => url !== null)

  console.log(`Checking ${scholarshipUrls.length} scholarship links...`)
  const scholarshipResults = await checkLinks(scholarshipUrls)

  let scholarshipsVerified = 0
  let scholarshipsBroken = 0

  for (const result of scholarshipResults) {
    const scholarship = scholarships.find((s) => s.url === result.url)
    if (scholarship) {
      await prisma.scholarship.update({
        where: { id: scholarship.id },
        data: {
          lastVerified: now,
          verifiedBy: result.isValid ? 'auto-check' : 'auto-check-broken',
        },
      })
      if (result.isValid) {
        scholarshipsVerified++
      } else {
        scholarshipsBroken++
        console.log(`  ❌ Broken: ${scholarship.name}`)
      }
    }
  }
  console.log(`✅ Scholarships: ${scholarshipsVerified} verified, ${scholarshipsBroken} broken\n`)

  // 3. Verify Grant Links
  console.log('=== GRANTS ===')
  const grants = await prisma.grant.findMany({
    where: {
      url: { not: null },
      deletedAt: null,
    },
    select: {
      id: true,
      url: true,
      name: true,
    },
  })

  const grantUrls = grants
    .map((g) => g.url)
    .filter((url): url is string => url !== null)

  console.log(`Checking ${grantUrls.length} grant links...`)
  const grantResults = await checkLinks(grantUrls)

  let grantsVerified = 0
  let grantsBroken = 0

  for (const result of grantResults) {
    const grant = grants.find((g) => g.url === result.url)
    if (grant) {
      await prisma.grant.update({
        where: { id: grant.id },
        data: {
          lastVerified: now,
          verifiedBy: result.isValid ? 'auto-check' : 'auto-check-broken',
        },
      })
      if (result.isValid) {
        grantsVerified++
      } else {
        grantsBroken++
        console.log(`  ❌ Broken: ${grant.name}`)
      }
    }
  }
  console.log(`✅ Grants: ${grantsVerified} verified, ${grantsBroken} broken\n`)

  // Summary
  console.log('=== SUMMARY ===')
  console.log(`Resources:    ${resourcesVerified} verified, ${resourcesBroken} broken`)
  console.log(`Scholarships: ${scholarshipsVerified} verified, ${scholarshipsBroken} broken`)
  console.log(`Grants:       ${grantsVerified} verified, ${grantsBroken} broken`)
  console.log(`\nTotal: ${resourcesVerified + scholarshipsVerified + grantsVerified} verified, ${resourcesBroken + scholarshipsBroken + grantsBroken} broken`)
  console.log('\nDone! All verification badges will now show accurate status.')
}

verifyAllLinks()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
