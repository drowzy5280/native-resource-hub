import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed...')

  // Create sample tribes
  const navajo = await prisma.tribe.upsert({
    where: { id: 'navajo-nation-1' },
    update: {},
    create: {
      id: 'navajo-nation-1',
      name: 'Navajo Nation',
      federalRecognitionStatus: 'Federally Recognized',
      website: 'https://www.navajo-nsn.gov',
      languageLinks: ['https://www.navajowotd.com'],
      enrollmentOffice: 'PO Box 3210, Window Rock, AZ 86515',
      region: 'Southwest',
    },
  })

  const cherokee = await prisma.tribe.upsert({
    where: { id: 'cherokee-nation-1' },
    update: {},
    create: {
      id: 'cherokee-nation-1',
      name: 'Cherokee Nation',
      federalRecognitionStatus: 'Federally Recognized',
      website: 'https://www.cherokee.org',
      languageLinks: ['https://language.cherokee.org'],
      enrollmentOffice: 'PO Box 948, Tahlequah, OK 74465',
      region: 'Southern Plains',
    },
  })

  const lakota = await prisma.tribe.upsert({
    where: { id: 'lakota-sioux-1' },
    update: {},
    create: {
      id: 'lakota-sioux-1',
      name: 'Oglala Sioux Tribe',
      federalRecognitionStatus: 'Federally Recognized',
      website: 'https://www.oglalalakotanation.org',
      languageLinks: [],
      enrollmentOffice: 'Pine Ridge, SD 57770',
      region: 'Great Plains',
    },
  })

  console.log('Created tribes:', { navajo, cherokee, lakota })

  // Create sample resources
  const resource1 = await prisma.resource.create({
    data: {
      type: 'federal',
      title: 'Indian Health Service (IHS)',
      description:
        'The Indian Health Service provides comprehensive health services for American Indians and Alaska Natives. Services include medical, dental, mental health, and substance abuse treatment.',
      url: 'https://www.ihs.gov',
      eligibility: [
        'Must be a member of a federally recognized tribe',
        'Must reside within IHS service area',
      ],
      tags: ['health', 'medical', 'dental', 'mental-health'],
      source: 'IHS.gov',
    },
  })

  const resource2 = await prisma.resource.create({
    data: {
      type: 'federal',
      title: 'Bureau of Indian Education Higher Education Grant',
      description:
        'Financial assistance for undergraduate and graduate students who are enrolled members of federally recognized tribes. Covers tuition, fees, books, and living expenses.',
      url: 'https://www.bie.edu/topic-page/post-secondary-education',
      eligibility: [
        'Must be enrolled member of federally recognized tribe',
        'Must be accepted to accredited institution',
        'Minimum 2.0 GPA required',
      ],
      tags: ['education', 'college', 'financial-aid', 'grant'],
      source: 'BIE.edu',
    },
  })

  const resource3 = await prisma.resource.create({
    data: {
      type: 'tribal',
      title: 'Navajo Housing Authority',
      description:
        'Provides affordable housing assistance to Navajo Nation members including home ownership programs, rental assistance, and emergency housing.',
      url: 'https://www.navajohousingauthority.org',
      eligibility: ['Must be enrolled member of Navajo Nation', 'Income requirements apply'],
      tags: ['housing', 'homeownership', 'rental-assistance'],
      tribeId: navajo.id,
      source: 'Navajo Nation',
    },
  })

  const resource4 = await prisma.resource.create({
    data: {
      type: 'emergency',
      title: 'Native American Emergency Assistance',
      description:
        'Emergency financial assistance for urgent needs including utilities, rent, food, and medical emergencies. Available to enrolled tribal members nationwide.',
      url: 'https://www.nicoa.org',
      eligibility: ['Must be enrolled tribal member', 'Must demonstrate emergency need'],
      tags: ['emergency', 'financial-assistance', 'utilities', 'food'],
      source: 'NICOA',
    },
  })

  const resource5 = await prisma.resource.create({
    data: {
      type: 'state',
      title: 'Arizona Native American Scholarship',
      description:
        'State-funded scholarship for Native American students attending Arizona colleges and universities. Awards range from $500 to $2,500 per year.',
      url: 'https://www.azed.gov',
      eligibility: [
        'Must be enrolled member of federally recognized tribe',
        'Must be Arizona resident',
        'Must attend Arizona institution',
      ],
      tags: ['education', 'scholarship', 'college'],
      state: 'Arizona',
      source: 'Arizona Department of Education',
    },
  })

  console.log('Created resources:', { resource1, resource2, resource3, resource4, resource5 })

  // Create sample scholarships
  const scholarship1 = await prisma.scholarship.create({
    data: {
      name: 'American Indian College Fund Scholarship',
      amount: '$5,000 - $10,000',
      deadline: '2025-05-31',
      description:
        'Comprehensive scholarship program for Native American students attending tribal colleges and universities. Covers tuition, books, housing, and meals.',
      tags: ['college', 'tribal-college', 'undergraduate'],
      eligibility: [
        'Must be enrolled member of federally recognized tribe',
        'Must attend tribal college or university',
        'Minimum 2.5 GPA required',
      ],
      url: 'https://collegefund.org/students/scholarships/',
      source: 'American Indian College Fund',
    },
  })

  const scholarship2 = await prisma.scholarship.create({
    data: {
      name: 'Catching the Dream Scholarship',
      amount: '$1,000 - $5,000',
      deadline: '2025-04-15',
      description:
        'Supports Native American students pursuing degrees in business, education, engineering, natural resources, and STEM fields.',
      tags: ['STEM', 'business', 'education', 'undergraduate', 'graduate'],
      eligibility: [
        'Must be at least 1/4 Native American',
        'Must provide proof of tribal enrollment',
        'Minimum 3.0 GPA required',
      ],
      url: 'https://www.catchingthedream.org',
      source: 'Catching the Dream',
    },
  })

  const scholarship3 = await prisma.scholarship.create({
    data: {
      name: 'Gates Millennium Scholars Program',
      amount: 'Full tuition',
      deadline: '2025-01-15',
      description:
        'Highly competitive scholarship providing full tuition coverage for outstanding Native American students demonstrating leadership and academic excellence.',
      tags: ['full-ride', 'undergraduate', 'graduate', 'leadership'],
      eligibility: [
        'Must be Native American, Alaska Native, or Pacific Islander',
        'Must be Pell Grant eligible',
        'Minimum 3.3 GPA required',
      ],
      url: 'https://www.gmsp.org',
      source: 'Bill & Melinda Gates Foundation',
    },
  })

  const scholarship4 = await prisma.scholarship.create({
    data: {
      name: 'Cherokee Nation Higher Education Scholarship',
      amount: 'Varies',
      deadline: null,
      description:
        'Rolling scholarship program for Cherokee Nation citizens pursuing undergraduate or graduate degrees. Award amounts vary based on financial need.',
      tags: ['college', 'undergraduate', 'graduate', 'tribal'],
      eligibility: [
        'Must be citizen of Cherokee Nation',
        'Must maintain 2.0 GPA',
        'Financial need required',
      ],
      url: 'https://www.cherokee.org/all-services/education-services/higher-education/',
      source: 'Cherokee Nation',
    },
  })

  console.log('Created scholarships:', { scholarship1, scholarship2, scholarship3, scholarship4 })

  console.log('Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('Error during seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
