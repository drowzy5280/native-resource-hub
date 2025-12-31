import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables from .env.local
dotenv.config({ path: path.join(__dirname, '..', '.env.local') })

const prisma = new PrismaClient()

const grants = [
  // Federal Grants - BIA
  {
    name: 'BIA Indian Education Grants to Local Educational Agencies',
    description: 'Provides supplemental educational funding to local educational agencies (LEAs) that serve federally recognized tribes. Funds can be used for cultural education, language preservation, dropout prevention, and enrichment activities. The grant aims to meet the unique educational and culturally-related academic needs of American Indian students.',
    url: 'https://www.bia.gov/bie/grants',
    fundingAgency: 'Bureau of Indian Affairs',
    grantType: 'federal',
    amount: '$50,000 - $500,000',
    amountMin: 50000,
    amountMax: 500000,
    eligibility: [
      'Must be a local educational agency (LEA)',
      'Must serve students who are members of federally recognized tribes',
      'Must have an approved Indian Education Committee',
    ],
    tags: ['education', 'youth programs', 'cultural preservation', 'language revitalization'],
    eligibleApplicants: ['Local Educational Agencies', 'Tribal Schools', 'Public Schools'],
    matchingRequired: false,
    source: 'Bureau of Indian Affairs',
  },
  {
    name: 'BIA Tribal Climate Resilience Program',
    description: 'Supports federally recognized tribes and authorized tribal organizations in building resilience to climate change impacts. Funding supports tribal climate adaptation planning, ocean and coastal management planning, relocation and managed retreat planning, and community-driven relocation efforts.',
    url: 'https://www.bia.gov/service/tcr-annual-awards-program',
    fundingAgency: 'Bureau of Indian Affairs',
    grantType: 'federal',
    amount: '$75,000 - $250,000',
    amountMin: 75000,
    amountMax: 250000,
    eligibility: [
      'Must be a federally recognized tribe or authorized tribal organization',
      'Must demonstrate climate-related impacts to tribal lands or resources',
    ],
    tags: ['environment', 'infrastructure', 'tribal governance'],
    eligibleApplicants: ['Federally Recognized Tribes', 'Tribal Organizations'],
    matchingRequired: false,
    source: 'Bureau of Indian Affairs',
  },
  {
    name: 'BIA Housing Improvement Program (HIP)',
    description: 'Provides grants to eligible American Indians and Alaska Natives for housing repairs, renovations, or replacement housing. The program helps address substandard housing conditions and provides safe, sanitary, and decent housing for tribal members in need.',
    url: 'https://www.bia.gov/bia/ois/dhs/housing-improvement-program',
    fundingAgency: 'Bureau of Indian Affairs',
    grantType: 'federal',
    amount: '$2,500 - $60,000',
    amountMin: 2500,
    amountMax: 60000,
    eligibility: [
      'Must be a member of a federally recognized tribe',
      'Must live on or near a reservation',
      'Must have income below 150% of federal poverty guidelines',
      'Must demonstrate housing need',
    ],
    tags: ['housing', 'emergency assistance'],
    eligibleApplicants: ['Individual Tribal Members'],
    matchingRequired: false,
    source: 'Bureau of Indian Affairs',
  },

  // HUD Grants
  {
    name: 'Indian Housing Block Grant (IHBG)',
    description: 'The largest source of federal housing assistance for tribes, providing formula-based funding to Indian tribes or their tribally designated housing entities for affordable housing activities. Activities include modernization, new construction, acquisition, infrastructure, and tenant-based rental assistance.',
    url: 'https://www.hud.gov/program_offices/public_indian_housing/ih/grants/ihbg',
    fundingAgency: 'Department of Housing and Urban Development',
    grantType: 'federal',
    amount: '$100,000 - $50,000,000',
    amountMin: 100000,
    amountMax: 50000000,
    eligibility: [
      'Must be a federally recognized tribe or Tribally Designated Housing Entity (TDHE)',
      'Must submit an Indian Housing Plan (IHP)',
    ],
    tags: ['housing', 'infrastructure', 'economic development'],
    eligibleApplicants: ['Federally Recognized Tribes', 'Tribally Designated Housing Entities'],
    matchingRequired: false,
    cfda: '14.867',
    source: 'HUD Office of Native American Programs',
  },
  {
    name: 'Indian Community Development Block Grant (ICDBG)',
    description: 'Provides grants for community development activities including housing rehabilitation, land acquisition, new housing construction, infrastructure, and economic development for eligible Indian tribes. Projects must benefit low and moderate-income tribal members.',
    url: 'https://www.hud.gov/program_offices/public_indian_housing/ih/grants/icdbg',
    fundingAgency: 'Department of Housing and Urban Development',
    grantType: 'federal',
    amount: '$50,000 - $1,500,000',
    amountMin: 50000,
    amountMax: 1500000,
    eligibility: [
      'Must be a federally recognized tribe or tribal organization',
      'Project must principally benefit low and moderate-income persons',
      'Must demonstrate capacity to administer the grant',
    ],
    tags: ['housing', 'economic development', 'infrastructure'],
    eligibleApplicants: ['Federally Recognized Tribes', 'Tribal Organizations'],
    matchingRequired: false,
    cfda: '14.862',
    source: 'HUD Office of Native American Programs',
  },

  // IHS Grants
  {
    name: 'Indian Health Service Community Health Representative Program',
    description: 'Provides funding for tribal and urban Indian health programs to train and employ Community Health Representatives (CHRs). CHRs provide basic health education, case management, and referral services to American Indian and Alaska Native communities.',
    url: 'https://www.ihs.gov/chr/',
    fundingAgency: 'Indian Health Service',
    grantType: 'federal',
    amount: '$50,000 - $500,000',
    amountMin: 50000,
    amountMax: 500000,
    eligibility: [
      'Must be a federally recognized tribe, tribal organization, or urban Indian organization',
      'Must have a healthcare delivery system',
    ],
    tags: ['healthcare', 'workforce development', 'social services'],
    eligibleApplicants: ['Federally Recognized Tribes', 'Tribal Organizations', 'Urban Indian Organizations'],
    matchingRequired: false,
    source: 'Indian Health Service',
  },
  {
    name: 'IHS Tribal Self-Governance Planning and Negotiation Cooperative Agreement',
    description: 'Supports tribes interested in assuming greater control over federal Indian health programs. Funding helps tribes plan for self-governance participation and negotiate self-governance compacts with IHS.',
    url: 'https://www.ihs.gov/selfgovernance/',
    fundingAgency: 'Indian Health Service',
    grantType: 'federal',
    amount: '$75,000 - $150,000',
    amountMin: 75000,
    amountMax: 150000,
    eligibility: [
      'Must be a federally recognized tribe',
      'Must demonstrate readiness and interest in tribal self-governance',
    ],
    tags: ['healthcare', 'tribal governance'],
    eligibleApplicants: ['Federally Recognized Tribes'],
    matchingRequired: false,
    source: 'Indian Health Service',
  },

  // USDA Grants
  {
    name: 'USDA Community Facilities Direct Loan & Grant Program',
    description: 'Provides affordable funding to develop essential community facilities in rural and tribal areas. Eligible projects include healthcare facilities, public buildings, community centers, and cultural facilities. Special set-aside funding is available for Native American communities.',
    url: 'https://www.rd.usda.gov/programs-services/community-facilities/community-facilities-direct-loan-grant-program',
    fundingAgency: 'USDA Rural Development',
    grantType: 'federal',
    amount: '$10,000 - $2,000,000',
    amountMin: 10000,
    amountMax: 2000000,
    eligibility: [
      'Must be a rural area or tribal land',
      'Applicant can be a public body, nonprofit, or federally recognized tribe',
      'Population generally must be 20,000 or less',
    ],
    tags: ['infrastructure', 'healthcare', 'economic development'],
    eligibleApplicants: ['Federally Recognized Tribes', 'Tribal Organizations', 'Nonprofits', 'Public Bodies'],
    matchingRequired: true,
    matchingPercentage: 25,
    cfda: '10.766',
    source: 'USDA Rural Development',
  },
  {
    name: 'USDA Native American Business Development Program',
    description: 'Provides technical assistance to federally recognized tribes and tribally-owned businesses. Funding supports feasibility studies, business plans, and training to promote economic development on tribal lands.',
    url: 'https://www.rd.usda.gov/programs-services/business-programs/rural-business-development-grants',
    fundingAgency: 'USDA Rural Development',
    grantType: 'federal',
    amount: '$10,000 - $500,000',
    amountMin: 10000,
    amountMax: 500000,
    eligibility: [
      'Must be a federally recognized tribe or tribal enterprise',
      'Must be located in a rural area',
    ],
    tags: ['economic development', 'small business', 'workforce development'],
    eligibleApplicants: ['Federally Recognized Tribes', 'Tribal Enterprises', 'Native-owned Businesses'],
    matchingRequired: false,
    source: 'USDA Rural Development',
  },

  // EPA Grants
  {
    name: 'EPA Indian Environmental General Assistance Program (GAP)',
    description: 'Provides general assistance grants to tribes and intertribal consortia to build capacity to administer environmental programs. Funding supports environmental planning, staff training, and development of tribal environmental programs.',
    url: 'https://www.epa.gov/tribal/indian-environmental-general-assistance-program-gap',
    fundingAgency: 'Environmental Protection Agency',
    grantType: 'federal',
    amount: '$75,000 - $175,000',
    amountMin: 75000,
    amountMax: 175000,
    eligibility: [
      'Must be a federally recognized tribe or intertribal consortium',
      'Must have or be developing an environmental program',
    ],
    tags: ['environment', 'tribal governance', 'workforce development'],
    eligibleApplicants: ['Federally Recognized Tribes', 'Intertribal Consortia'],
    matchingRequired: false,
    cfda: '66.926',
    source: 'Environmental Protection Agency',
  },

  // DOE Grants
  {
    name: 'DOE Office of Indian Energy Policy and Programs',
    description: 'Supports tribes in developing clean energy resources on tribal lands. Funding available for energy planning, feasibility studies, and renewable energy project development including solar, wind, and energy efficiency projects.',
    url: 'https://www.energy.gov/indianenergy/about-office-indian-energy',
    fundingAgency: 'Department of Energy',
    grantType: 'federal',
    amount: '$50,000 - $2,000,000',
    amountMin: 50000,
    amountMax: 2000000,
    eligibility: [
      'Must be a federally recognized tribe or tribal organization',
      'Project must benefit tribal lands or tribal members',
    ],
    tags: ['energy', 'environment', 'infrastructure', 'economic development'],
    eligibleApplicants: ['Federally Recognized Tribes', 'Tribal Organizations', 'Tribal Enterprises'],
    matchingRequired: true,
    matchingPercentage: 20,
    source: 'Department of Energy',
  },

  // Foundation Grants
  {
    name: 'First Nations Development Institute - Native Youth and Culture Fund',
    description: 'Supports Native-led nonprofit organizations and tribal programs that work to strengthen Native American youth and families through culturally-based programming. Priority given to projects focusing on language preservation, traditional arts, and cultural education.',
    url: 'https://www.firstnations.org/grantmaking/',
    fundingAgency: 'First Nations Development Institute',
    grantType: 'foundation',
    amount: '$10,000 - $50,000',
    amountMin: 10000,
    amountMax: 50000,
    eligibility: [
      'Must be a Native-controlled nonprofit or tribal program',
      'Must serve Native American communities',
      'Project must have a cultural or youth development focus',
    ],
    tags: ['youth programs', 'cultural preservation', 'language revitalization', 'education'],
    eligibleApplicants: ['Native-controlled Nonprofits', 'Tribal Programs', 'Tribal Colleges'],
    matchingRequired: false,
    source: 'First Nations Development Institute',
  },
  {
    name: 'Native Americans in Philanthropy - Community Support Grants',
    description: 'Provides flexible general operating support to Native-led organizations working to improve conditions in Native communities. Funding supports organizations addressing a range of issues including health, education, economic development, and cultural preservation.',
    url: 'https://nativephilanthropy.org/',
    fundingAgency: 'Native Americans in Philanthropy',
    grantType: 'foundation',
    amount: '$5,000 - $25,000',
    amountMin: 5000,
    amountMax: 25000,
    eligibility: [
      'Must be a Native-led nonprofit organization',
      'Must have Native community benefit as primary purpose',
      '501(c)(3) status or fiscal sponsor required',
    ],
    tags: ['social services', 'cultural preservation', 'economic development'],
    eligibleApplicants: ['Native-led Nonprofits'],
    matchingRequired: false,
    source: 'Native Americans in Philanthropy',
  },
  {
    name: 'Lannan Foundation Indigenous Communities Program',
    description: 'Supports Native American communities in their efforts to revitalize Indigenous languages and cultures, sustain the environment of their homelands, and maintain tribal sovereignty. The program provides general operating support and project grants.',
    url: 'https://lannan.org/programs/indigenous-communities',
    fundingAgency: 'Lannan Foundation',
    grantType: 'foundation',
    amount: '$10,000 - $100,000',
    amountMin: 10000,
    amountMax: 100000,
    eligibility: [
      'Must be a Native-led organization',
      'Must focus on language, culture, environment, or sovereignty',
      'By invitation only - submit letter of inquiry',
    ],
    tags: ['cultural preservation', 'language revitalization', 'environment', 'tribal governance'],
    eligibleApplicants: ['Native-led Nonprofits', 'Tribal Organizations'],
    matchingRequired: false,
    source: 'Lannan Foundation',
  },

  // Administration for Native Americans (ANA)
  {
    name: 'ANA Social and Economic Development Strategies (SEDS)',
    description: 'Promotes social and economic self-sufficiency for American Indians, Alaska Natives, Native Hawaiians, and Native American Pacific Islanders. Funding supports community-based projects that address locally-determined needs including economic development, social development, and governance.',
    url: 'https://www.acf.hhs.gov/ana/grants/seds',
    fundingAgency: 'Administration for Native Americans',
    grantType: 'federal',
    amount: '$100,000 - $400,000',
    amountMin: 100000,
    amountMax: 400000,
    eligibility: [
      'Must be a federally recognized tribe, Native nonprofit, or other eligible Native organization',
      'Must demonstrate community support for the project',
      '20% non-federal match required',
    ],
    tags: ['economic development', 'social services', 'tribal governance'],
    eligibleApplicants: ['Federally Recognized Tribes', 'Native Nonprofits', 'Tribal Colleges', 'Native Hawaiian Organizations'],
    matchingRequired: true,
    matchingPercentage: 20,
    cfda: '93.612',
    source: 'Administration for Native Americans',
  },
  {
    name: 'ANA Native Language Preservation and Maintenance',
    description: 'Supports community-driven projects that preserve, revitalize, and maintain Native languages. Funding can be used for language documentation, curriculum development, teacher training, language immersion programs, and community language classes.',
    url: 'https://www.acf.hhs.gov/ana/grants/native-languages',
    fundingAgency: 'Administration for Native Americans',
    grantType: 'federal',
    amount: '$150,000 - $400,000',
    amountMin: 150000,
    amountMax: 400000,
    eligibility: [
      'Must be a federally recognized tribe, Native nonprofit, or tribal college',
      'Must have a language preservation plan',
      '20% non-federal match required',
    ],
    tags: ['language revitalization', 'cultural preservation', 'education'],
    eligibleApplicants: ['Federally Recognized Tribes', 'Native Nonprofits', 'Tribal Colleges'],
    matchingRequired: true,
    matchingPercentage: 20,
    cfda: '93.587',
    source: 'Administration for Native Americans',
  },
]

async function seedGrants() {
  console.log('Starting grant seeding...')

  for (const grant of grants) {
    try {
      const existing = await prisma.grant.findFirst({
        where: { name: grant.name },
      })

      if (existing) {
        console.log(`Grant already exists: ${grant.name}`)
        continue
      }

      await prisma.grant.create({
        data: {
          ...grant,
          grantType: grant.grantType as any,
        },
      })

      console.log(`Created grant: ${grant.name}`)
    } catch (error) {
      console.error(`Failed to create grant: ${grant.name}`, error)
    }
  }

  console.log('Grant seeding completed!')
}

seedGrants()
  .catch((error) => {
    console.error('Seeding failed:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
