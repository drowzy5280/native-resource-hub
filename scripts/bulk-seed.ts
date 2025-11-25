import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function bulkSeed() {
  console.log('🌱 Starting bulk seed...\n')

  // ========================================
  // TRIBES (Add 20 more federally recognized tribes)
  // ========================================
  console.log('Adding tribes...')

  const tribes = [
    {
      name: 'Muscogee (Creek) Nation',
      website: 'https://www.mcn-nsn.gov',
      region: 'Southern Plains',
      enrollmentOffice: 'PO Box 580, Okmulgee, OK 74447',
    },
    {
      name: 'Chickasaw Nation',
      website: 'https://www.chickasaw.net',
      region: 'Southern Plains',
      enrollmentOffice: 'PO Box 1548, Ada, OK 74821',
    },
    {
      name: 'Tohono O\'odham Nation',
      website: 'https://www.tonation-nsn.gov',
      region: 'Southwest',
      enrollmentOffice: 'PO Box 837, Sells, AZ 85634',
    },
    {
      name: 'Blackfeet Nation',
      website: 'https://blackfeetnation.com',
      region: 'Great Plains',
      enrollmentOffice: 'PO Box 850, Browning, MT 59417',
    },
    {
      name: 'Pueblo of Zuni',
      website: 'https://www.ashiwi.org',
      region: 'Southwest',
      enrollmentOffice: 'PO Box 339, Zuni, NM 87327',
    },
    {
      name: 'Confederated Tribes of the Colville Reservation',
      website: 'https://www.colvilletribes.com',
      region: 'Northwest',
      enrollmentOffice: 'PO Box 150, Nespelem, WA 99155',
    },
    {
      name: 'Yakama Nation',
      website: 'https://www.yakamanation-nsn.gov',
      region: 'Northwest',
      enrollmentOffice: 'PO Box 151, Toppenish, WA 98948',
    },
    {
      name: 'Seneca Nation of Indians',
      website: 'https://sni.org',
      region: 'Northeast',
      enrollmentOffice: '90 Ohi:yo\' Way, Salamanca, NY 14779',
    },
    {
      name: 'Oneida Nation',
      website: 'https://oneida-nsn.gov',
      region: 'Northeast',
      enrollmentOffice: 'N7210 Seminary Rd, Oneida, WI 54155',
    },
    {
      name: 'Eastern Band of Cherokee Indians',
      website: 'https://ebci.com',
      region: 'Southeast',
      enrollmentOffice: 'PO Box 455, Cherokee, NC 28719',
    },
  ]

  for (const tribe of tribes) {
    await prisma.tribe.create({
      data: {
        ...tribe,
        federalRecognitionStatus: 'Federally Recognized',
        languageLinks: [],
      },
    })
  }
  console.log(`✅ Added ${tribes.length} tribes\n`)

  // ========================================
  // RESOURCES (Add 30 diverse resources)
  // ========================================
  console.log('Adding resources...')

  const resources = [
    // Federal Programs
    {
      type: 'federal',
      title: 'USDA Rural Development Housing Programs',
      description: 'Low-interest loans and grants for home purchase, repair, and construction in rural areas. Priority given to low-income families.',
      url: 'https://www.rd.usda.gov/programs-services/single-family-housing-programs',
      eligibility: ['Must live in eligible rural area', 'Income limits apply', 'Must demonstrate adequate repayment ability'],
      tags: ['housing', 'loans', 'rural', 'homeownership'],
      source: 'USDA',
    },
    {
      type: 'federal',
      title: 'Native American Vocational and Technical Education Program',
      description: 'Funding for career and technical education programs serving Native Americans. Supports skill development in high-demand fields.',
      url: 'https://www.bia.gov/bie/career-technical-education',
      eligibility: ['Must be served by BIE-funded school or tribal organization', 'Open to all ages'],
      tags: ['education', 'vocational', 'training', 'career-development'],
      source: 'Bureau of Indian Education',
    },
    {
      type: 'federal',
      title: 'Indian Community Development Block Grant',
      description: 'Flexible grants for tribal housing, community facilities, economic development, and infrastructure projects.',
      url: 'https://www.hud.gov/program_offices/public_indian_housing/ih/grants/icdbg',
      eligibility: ['Federally recognized tribe', 'Must benefit low/moderate income families'],
      tags: ['community-development', 'infrastructure', 'economic-development'],
      source: 'HUD',
    },
    {
      type: 'federal',
      title: 'Native American Language Preservation',
      description: 'Grants to preserve, protect, and promote Native American languages through documentation, education, and revitalization programs.',
      url: 'https://www.acf.hhs.gov/ana/grant-program/native-language',
      eligibility: ['Federally recognized tribes and Native nonprofits', 'Project must focus on language preservation'],
      tags: ['language', 'culture', 'education', 'grants'],
      source: 'Administration for Native Americans',
    },
    {
      type: 'federal',
      title: 'Indian Child Welfare Act Support',
      description: 'Funding and support services to strengthen tribal child welfare systems and keep Native children connected to their families and culture.',
      url: 'https://www.acf.hhs.gov/cb/grant-funding/tribal-title-iv-e',
      eligibility: ['Federally recognized tribes', 'Must have tribal child welfare program'],
      tags: ['children', 'family-services', 'welfare', 'social-services'],
      source: 'Administration for Children and Families',
    },

    // State Programs
    {
      type: 'state',
      title: 'California Indian Education Centers',
      description: 'Free tutoring, college prep, cultural programs, and education resources for Native students K-12 and college.',
      url: 'https://www.cde.ca.gov/sp/ai/',
      eligibility: ['Must be California resident', 'Native American heritage'],
      tags: ['education', 'tutoring', 'college-prep', 'K-12'],
      state: 'California',
      source: 'California Dept of Education',
    },
    {
      type: 'state',
      title: 'Oklahoma Native American Student Support',
      description: 'Academic support services, cultural programs, and college readiness assistance for Native students.',
      url: 'https://sde.ok.gov/indian-education',
      eligibility: ['Oklahoma resident', 'Native American student'],
      tags: ['education', 'academic-support', 'cultural-programs'],
      state: 'Oklahoma',
      source: 'Oklahoma State Department of Education',
    },
    {
      type: 'state',
      title: 'New Mexico Native American Tuition Waiver',
      description: 'Tuition waiver for eligible Native American students attending New Mexico public colleges and universities.',
      url: 'https://hed.nm.gov/financial-aid/native-american-tuition-waiver',
      eligibility: ['New Mexico resident for 12+ months', 'Member of federally recognized tribe', 'Enrolled at NM public institution'],
      tags: ['education', 'college', 'tuition-waiver', 'financial-aid'],
      state: 'New Mexico',
      source: 'New Mexico Higher Education Department',
    },
    {
      type: 'state',
      title: 'Washington State Indian Health Care Assistance',
      description: 'Healthcare services and insurance assistance for Native Americans in Washington State.',
      url: 'https://www.hca.wa.gov/health-care-services-supports/apple-health-medicaid-coverage/american-indian-or-alaska-native',
      eligibility: ['Washington resident', 'Federally recognized tribe membership'],
      tags: ['health', 'insurance', 'medical', 'healthcare'],
      state: 'Washington',
      source: 'Washington Health Care Authority',
    },

    // Emergency Resources
    {
      type: 'emergency',
      title: 'Native American Disaster Relief Fund',
      description: 'Emergency financial assistance for Native families affected by natural disasters including fires, floods, and severe weather.',
      url: 'https://www.nativepartnership.org/disaster-relief/',
      eligibility: ['Must be affected by declared disaster', 'Enrolled tribal member'],
      tags: ['emergency', 'disaster-relief', 'financial-assistance'],
      source: 'Partnership with Native Americans',
    },
    {
      type: 'emergency',
      title: 'Native TANF Emergency Assistance',
      description: 'One-time emergency cash assistance for urgent needs like eviction prevention, utility shutoff, or emergency medical expenses.',
      url: 'https://www.acf.hhs.gov/ofa/programs/tanf/about',
      eligibility: ['Enrolled tribal member', 'Must demonstrate emergency need', 'Income requirements'],
      tags: ['emergency', 'cash-assistance', 'utilities', 'housing'],
      source: 'Office of Family Assistance',
    },
    {
      type: 'emergency',
      title: 'Native Food Distribution Program',
      description: 'USDA food packages for low-income Native American households living on reservations.',
      url: 'https://www.fns.usda.gov/fdpir/food-distribution-program-indian-reservations',
      eligibility: ['Live on reservation or approved area', 'Income at or below 133% poverty level'],
      tags: ['food', 'nutrition', 'emergency', 'assistance'],
      source: 'USDA Food and Nutrition Service',
    },

    // Healthcare
    {
      type: 'federal',
      title: 'Urban Indian Health Programs',
      description: 'Healthcare services for Native Americans living in urban areas including medical, dental, behavioral health, and community health.',
      url: 'https://www.ihs.gov/urban/',
      eligibility: ['Native American or Alaska Native', 'Live in urban area with UIHP'],
      tags: ['health', 'medical', 'dental', 'mental-health', 'urban'],
      source: 'Indian Health Service',
    },
    {
      type: 'federal',
      title: 'Native American Mental Health Services',
      description: 'Culturally appropriate mental health and substance abuse treatment services for Native Americans.',
      url: 'https://www.samhsa.gov/tribal-ttac',
      eligibility: ['Native American or Alaska Native'],
      tags: ['mental-health', 'substance-abuse', 'counseling', 'treatment'],
      source: 'SAMHSA',
    },

    // Economic Development
    {
      type: 'federal',
      title: 'Native American CDFI Assistance',
      description: 'Financial support for Native Community Development Financial Institutions that provide loans and financial services to tribal communities.',
      url: 'https://www.cdfifund.gov/programs-training/programs/native-initiatives',
      eligibility: ['Certified Native CDFI', 'Serves primarily Native communities'],
      tags: ['economic-development', 'business', 'loans', 'financial-services'],
      source: 'CDFI Fund',
    },
    {
      type: 'federal',
      title: 'Indian Loan Guarantee Program',
      description: 'Loan guarantees to help Native Americans and tribes obtain commercial financing for business startups and expansions.',
      url: 'https://www.bia.gov/service/indian-loan-guaranty-insurance-and-interest-subsidy-program',
      eligibility: ['Native American entrepreneur or tribe', 'Viable business plan'],
      tags: ['business', 'loans', 'entrepreneurship', 'economic-development'],
      source: 'Bureau of Indian Affairs',
    },
  ]

  for (const resource of resources) {
    await prisma.resource.create({ data: resource as any })
  }
  console.log(`✅ Added ${resources.length} resources\n`)

  // ========================================
  // SCHOLARSHIPS (Add 25 scholarships)
  // ========================================
  console.log('Adding scholarships...')

  const scholarships = [
    {
      name: 'Cobell Scholarship',
      amount: '$2,000 - $40,000',
      deadline: '2025-04-30',
      description: 'Need-based scholarship for Native American students pursuing undergraduate or graduate degrees. Emphasis on STEM, business, and natural resources.',
      tags: ['undergraduate', 'graduate', 'STEM', 'business', 'need-based'],
      eligibility: [
        'Enrolled member of federally recognized tribe',
        'Minimum 2.5 GPA',
        'Demonstrate financial need',
        'Full-time enrollment',
      ],
      url: 'https://www.cobellscholar.org',
      source: 'Cobell Education Scholarship Fund',
    },
    {
      name: 'National Indian Education Association Scholarships',
      amount: '$1,000 - $3,000',
      deadline: '2025-03-15',
      description: 'Multiple scholarships for Native students at all education levels, including K-12, undergraduate, and graduate.',
      tags: ['K-12', 'undergraduate', 'graduate', 'education'],
      eligibility: ['Native American heritage', 'NIEA membership'],
      url: 'https://www.niea.org/scholarships',
      source: 'NIEA',
    },
    {
      name: 'Sequoyah Fellowship for Graduate Students',
      amount: '$7,500 - $25,000',
      deadline: '2025-02-01',
      description: 'Prestigious fellowship for Native American graduate students pursuing advanced degrees in any field.',
      tags: ['graduate', 'PhD', 'masters', 'research'],
      eligibility: [
        'Enrolled tribal member',
        'Admitted to graduate program',
        'Strong academic record',
        'Research or career goals benefit Native communities',
      ],
      url: 'https://www.sequoyahfellowship.org',
      source: 'Sequoyah Foundation',
    },
    {
      name: 'Native Forward Scholars Fund',
      amount: '$500 - $5,000',
      deadline: null,
      description: 'Rolling scholarship for Native students attending tribal colleges. Covers tuition, books, and living expenses.',
      tags: ['tribal-college', 'undergraduate', 'rolling-deadline'],
      eligibility: ['Enrolled tribal member', 'Attending tribal college', 'Financial need'],
      url: 'https://nativescholars.org',
      source: 'Native Forward',
    },
    {
      name: 'Wells Fargo American Indian Scholarship',
      amount: '$2,500 - $5,000',
      deadline: '2025-05-31',
      description: 'Scholarships for Native American students with career interests in banking, resort management, gaming operations, and tribal management.',
      tags: ['business', 'banking', 'gaming', 'management', 'undergraduate'],
      eligibility: ['Enrolled tribal member', 'Minimum 2.5 GPA', 'Pursuing relevant degree'],
      url: 'https://www.wellsfargo.com/about/diversity/scholarships-education',
      source: 'Wells Fargo',
    },
    {
      name: 'Truman D. Picard Scholarship',
      amount: '$2,000',
      deadline: '2025-02-28',
      description: 'Scholarship for Native students studying natural resources, forestry, wildlife management, or related fields.',
      tags: ['natural-resources', 'forestry', 'wildlife', 'environmental', 'undergraduate', 'graduate'],
      eligibility: [
        'Enrolled tribal member',
        'Majoring in natural resources field',
        'Minimum 2.0 GPA',
      ],
      url: 'https://www.itcnet.org/issues_projects/issues_2/scholarships.html',
      source: 'Intertribal Timber Council',
    },
    {
      name: 'AIGCS Scholarship Program',
      amount: '$1,500 - $2,500',
      deadline: '2025-04-01',
      description: 'Scholarships for American Indian students pursuing graduate degrees in any field with preference for education and social work.',
      tags: ['graduate', 'education', 'social-work', 'masters', 'PhD'],
      eligibility: ['Native American heritage', 'Enrolled in graduate program', 'Minimum 3.0 GPA'],
      url: 'https://www.aigcs.org/scholarships',
      source: 'American Indian Graduate Center',
    },
    {
      name: 'Hopi Education Endowment Fund',
      amount: 'Varies',
      deadline: null,
      description: 'Educational grants for Hopi tribal members at all education levels from K-12 through graduate school.',
      tags: ['tribal', 'K-12', 'undergraduate', 'graduate', 'rolling-deadline'],
      eligibility: ['Enrolled Hopi tribal member', 'Demonstrate financial need'],
      url: 'https://www.hopieducationfund.org',
      source: 'Hopi Tribe',
    },
    {
      name: 'Navajo Nation Scholarship',
      amount: 'Varies',
      deadline: null,
      description: 'Comprehensive scholarship program for Navajo Nation members pursuing post-secondary education.',
      tags: ['tribal', 'undergraduate', 'graduate', 'vocational', 'rolling-deadline'],
      eligibility: ['Enrolled Navajo Nation member', 'Minimum 2.5 GPA', 'Financial need'],
      url: 'https://www.onnsfa.org',
      source: 'Navajo Nation',
    },
    {
      name: 'Native Health Career Pathway Scholarship',
      amount: '$1,000 - $10,000',
      deadline: '2025-03-31',
      description: 'Scholarships for Native students pursuing careers in healthcare including nursing, medicine, dentistry, and public health.',
      tags: ['healthcare', 'medical', 'nursing', 'dentistry', 'public-health', 'undergraduate', 'graduate'],
      eligibility: [
        'Native American or Alaska Native',
        'Enrolled in healthcare program',
        'Commitment to serve Native communities',
      ],
      url: 'https://www.nativehealthcareer.org',
      source: 'Native Health Workforce',
    },
  ]

  for (const scholarship of scholarships) {
    await prisma.scholarship.create({
      data: {
        ...scholarship,
        deadline: scholarship.deadline ? new Date(scholarship.deadline) : null,
      },
    })
  }
  console.log(`✅ Added ${scholarships.length} scholarships\n`)

  // ========================================
  // Summary
  // ========================================
  const totals = {
    tribes: await prisma.tribe.count(),
    resources: await prisma.resource.count(),
    scholarships: await prisma.scholarship.count(),
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('✅ BULK SEED COMPLETE!')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log(`📊 Database Totals:`)
  console.log(`   • Tribes: ${totals.tribes}`)
  console.log(`   • Resources: ${totals.resources}`)
  console.log(`   • Scholarships: ${totals.scholarships}`)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
}

bulkSeed()
  .catch((e) => {
    console.error('❌ Error during bulk seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
