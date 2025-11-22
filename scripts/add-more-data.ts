import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function addMoreData() {
  console.log('Adding more tribes...')

  // Add more tribes
  const choctaw = await prisma.tribe.create({
    data: {
      name: 'Choctaw Nation of Oklahoma',
      federalRecognitionStatus: 'Federally Recognized',
      website: 'https://www.choctawnation.com',
      languageLinks: ['https://www.choctawschool.com'],
      enrollmentOffice: 'PO Box 1210, Durant, OK 74702',
      region: 'Southern Plains',
    },
  })

  const seminole = await prisma.tribe.create({
    data: {
      name: 'Seminole Nation of Oklahoma',
      federalRecognitionStatus: 'Federally Recognized',
      website: 'https://www.sno-nsn.gov',
      languageLinks: [],
      enrollmentOffice: 'PO Box 1498, Wewoka, OK 74884',
      region: 'Southern Plains',
    },
  })

  console.log('Adding more resources...')

  // Add more resources
  const resource1 = await prisma.resource.create({
    data: {
      type: 'federal',
      title: 'Native American Housing Improvement Program',
      description: 'HUD program providing grants for housing repairs, improvements, and new construction on tribal lands.',
      url: 'https://www.hud.gov/program_offices/public_indian_housing/ih/grants/ihbg',
      eligibility: [
        'Must be Native American',
        'Must own home on tribal land or trust land',
        'Income requirements apply',
      ],
      tags: ['housing', 'grants', 'home-improvement', 'construction'],
      source: 'HUD',
    },
  })

  const resource2 = await prisma.resource.create({
    data: {
      type: 'federal',
      title: 'Native American Business Development Institute',
      description: 'Technical assistance and training for Native American entrepreneurs and small businesses.',
      url: 'https://www.bia.gov/service/business-development',
      eligibility: [
        'Must be enrolled tribal member',
        'Must own or plan to start a business',
      ],
      tags: ['business', 'entrepreneurship', 'training', 'economic-development'],
      source: 'Bureau of Indian Affairs',
    },
  })

  console.log('Adding more scholarships...')

  // Add more scholarships
  const scholarship1 = await prisma.scholarship.create({
    data: {
      name: 'American Indian Science and Engineering Society (AISES) Scholarship',
      amount: '$1,000 - $5,000',
      deadline: '2025-05-15',
      description: 'Scholarships for Native American students pursuing degrees in STEM fields including engineering, computer science, and natural sciences.',
      tags: ['STEM', 'engineering', 'science', 'technology', 'undergraduate', 'graduate'],
      eligibility: [
        'Must be member of federally recognized tribe or Alaska Native',
        'Must be pursuing STEM degree',
        'Minimum 3.0 GPA required',
        'Must be AISES member',
      ],
      url: 'https://www.aises.org/scholarships',
      source: 'AISES',
    },
  })

  const scholarship2 = await prisma.scholarship.create({
    data: {
      name: 'Udall Undergraduate Scholarship',
      amount: '$7,000',
      deadline: '2025-03-01',
      description: 'Prestigious scholarship for Native American and Alaska Native students committed to careers in tribal public policy or Native health care.',
      tags: ['public-policy', 'healthcare', 'leadership', 'undergraduate'],
      eligibility: [
        'Must be enrolled tribal member',
        'College sophomore or junior',
        'Minimum 3.0 GPA',
        'Commitment to tribal leadership or Native healthcare',
      ],
      url: 'https://www.udall.gov/OurPrograms/NativeAmericanScholarship/NativeAmericanScholarship.aspx',
      source: 'Udall Foundation',
    },
  })

  console.log('✅ Successfully added:')
  console.log(`  - ${2} new tribes`)
  console.log(`  - ${2} new resources`)
  console.log(`  - ${2} new scholarships`)
  console.log('\nTotal now:')
  console.log(`  - Tribes: ${await prisma.tribe.count()}`)
  console.log(`  - Resources: ${await prisma.resource.count()}`)
  console.log(`  - Scholarships: ${await prisma.scholarship.count()}`)
}

addMoreData()
  .catch((e) => {
    console.error('Error adding data:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
