import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function addComprehensiveData() {
  console.log('🌱 Adding comprehensive data to Tribal Resource Hub...\n')

  // ========================================
  // FEDERAL RESOURCES (Government Programs)
  // ========================================
  console.log('📚 Adding Federal Resources...')

  const federalResources = [
    {
      title: 'Indian Health Service Direct Care Services',
      description: 'Comprehensive healthcare services including medical, dental, and behavioral health care for American Indians and Alaska Natives at IHS facilities.',
      url: 'https://www.ihs.gov/forpatients/directcare/',
      tags: ['health', 'medical', 'dental', 'mental health'],
      eligibility: ['Enrolled tribal member', 'Descendant of enrolled member', 'Must reside on or near reservation'],
      type: 'federal' as const,
    },
    {
      title: 'Native American Housing Assistance and Self-Determination Act (NAHASDA)',
      description: 'Block grant program providing affordable housing activities for Native American families in need of housing assistance.',
      url: 'https://www.hud.gov/program_offices/public_indian_housing/ih/grants/ihbg',
      tags: ['housing', 'financial assistance', 'homeownership'],
      eligibility: ['Low-income Native American families', 'Tribal membership required'],
      type: 'federal' as const,
    },
    {
      title: 'BIA General Assistance Program',
      description: 'Provides financial assistance for essential needs including food, clothing, utilities, and other basic necessities.',
      url: 'https://www.bia.gov/service/general-assistance',
      tags: ['emergency', 'financial assistance', 'utilities', 'food'],
      eligibility: ['Enrolled tribal member', 'Reside on or near reservation', 'Meet income requirements'],
      type: 'federal' as const,
    },
    {
      title: 'Indian Education Formula Grant Program',
      description: 'Provides funding to support supplemental education programs for Native American students to meet challenging academic standards.',
      url: 'https://oese.ed.gov/offices/office-of-formula-grants/school-support-and-accountability/indian-education/',
      tags: ['education', 'k-12', 'academic support', 'tutoring'],
      eligibility: ['Native American students in public schools', 'School district must have eligible students'],
      type: 'federal' as const,
    },
    {
      title: 'Native American Employment and Training Program',
      description: 'Job training, education, and employment services to increase employment opportunities for Native Americans.',
      url: 'https://www.dol.gov/agencies/eta/dinap',
      tags: ['employment', 'job training', 'career development', 'education'],
      eligibility: ['Native American adults', 'Native American youth', 'Must be unemployed or underemployed'],
      type: 'federal' as const,
    },
    {
      title: 'IHS Behavioral Health Programs',
      description: 'Mental health and substance abuse services including counseling, crisis intervention, and prevention programs.',
      url: 'https://www.ihs.gov/healthcommunications/behavioralhealth/',
      tags: ['mental health', 'substance abuse', 'counseling', 'health'],
      eligibility: ['Native American individuals', 'Tribal enrollment preferred'],
      type: 'federal' as const,
    },
    {
      title: 'Native American Graves Protection and Repatriation Act (NAGPRA)',
      description: 'Protects Native American cultural items and provides for repatriation of remains and sacred objects.',
      url: 'https://www.nps.gov/subjects/nagpra/index.htm',
      tags: ['cultural preservation', 'legal rights', 'heritage'],
      eligibility: ['Federally recognized tribes', 'Lineal descendants', 'Native Hawaiian organizations'],
      type: 'federal' as const,
    },
    {
      title: 'Administration for Native Americans (ANA) Social and Economic Development',
      description: 'Grants to support community projects that promote self-sufficiency and cultural preservation.',
      url: 'https://www.acf.hhs.gov/ana',
      tags: ['community development', 'economic development', 'cultural preservation'],
      eligibility: ['Native American tribes', 'Alaska Native villages', 'Native Hawaiian organizations'],
      type: 'federal' as const,
    },
    {
      title: 'Indian Community Development Block Grant Program',
      description: 'Funding for housing, community facilities, economic development, and infrastructure improvements.',
      url: 'https://www.hud.gov/program_offices/public_indian_housing/ih/grants/icdbg',
      tags: ['community development', 'infrastructure', 'housing', 'economic development'],
      eligibility: ['Federally recognized tribes', 'Alaska Native villages', 'Tribal organizations'],
      type: 'federal' as const,
    },
    {
      title: 'Special Supplemental Nutrition Program for Women, Infants, and Children (WIC)',
      description: 'Provides nutritious foods, nutrition education, and health referrals for pregnant women, new mothers, and young children.',
      url: 'https://www.fns.usda.gov/wic',
      tags: ['nutrition', 'food', 'health', 'youth', 'women'],
      eligibility: ['Pregnant women', 'Postpartum women', 'Infants and children up to age 5', 'Meet income requirements'],
      type: 'federal' as const,
    },
  ]

  // ========================================
  // STATE RESOURCES (Various States)
  // ========================================
  console.log('🏛️ Adding State Resources...')

  const stateResources = [
    {
      title: 'California Indian Legal Services',
      description: 'Free legal assistance for California Indians in areas including family law, housing, public benefits, and tribal matters.',
      url: 'https://www.calindian.org',
      tags: ['legal', 'advocacy', 'family law', 'housing'],
      eligibility: ['California Indian', 'Low-income'],
      type: 'state' as const,
      state: 'CA',
    },
    {
      title: 'Arizona Native American Student Services',
      description: 'Support services including tutoring, counseling, and cultural programming for Native American students in Arizona schools.',
      url: 'https://www.azed.gov/indian-education',
      tags: ['education', 'k-12', 'tutoring', 'counseling'],
      eligibility: ['Native American students in Arizona', 'K-12 enrollment'],
      type: 'state' as const,
      state: 'AZ',
    },
    {
      title: 'Oklahoma Indian Affairs Commission',
      description: 'State advocacy and resource connection for Oklahoma\'s 39 tribal nations and urban Indian population.',
      url: 'https://www.ok.gov/oiac/',
      tags: ['advocacy', 'resources', 'government services'],
      eligibility: ['Oklahoma tribal citizens', 'Urban Indians in Oklahoma'],
      type: 'state' as const,
      state: 'OK',
    },
    {
      title: 'New Mexico Indian Affairs Department',
      description: 'Coordinates state services and programs for New Mexico\'s 23 tribes, nations, and pueblos.',
      url: 'https://www.iad.state.nm.us',
      tags: ['government services', 'advocacy', 'resources'],
      eligibility: ['New Mexico tribal members', 'Pueblos', 'Nations'],
      type: 'state' as const,
      state: 'NM',
    },
    {
      title: 'Washington State Indian Health Care Providers',
      description: 'Network of clinics providing comprehensive healthcare services to Native Americans in Washington State.',
      url: 'https://www.doh.wa.gov/ForPublicHealthandHealthcareProviders/PublicHealthSystemResourcesandServices/LocalHealthResourcesandTools/IndianHealthCareProviders',
      tags: ['health', 'medical', 'clinics'],
      eligibility: ['Native American residents of Washington', 'Tribal membership preferred'],
      type: 'state' as const,
      state: 'WA',
    },
    {
      title: 'Montana Indian Education Association',
      description: 'Educational resources, professional development, and advocacy for Native American students and educators in Montana.',
      url: 'https://www.mtiea.org',
      tags: ['education', 'professional development', 'advocacy'],
      eligibility: ['Montana Native American students', 'Educators', 'Tribal members'],
      type: 'state' as const,
      state: 'MT',
    },
    {
      title: 'Wisconsin Indian Education Association',
      description: 'Promotes quality education for Native American students through advocacy, resources, and professional development.',
      url: 'https://www.wiea.org',
      tags: ['education', 'advocacy', 'professional development'],
      eligibility: ['Wisconsin Native American students', 'Educators working with Native students'],
      type: 'state' as const,
      state: 'WI',
    },
    {
      title: 'Alaska Native Medical Center',
      description: 'Full-service hospital providing comprehensive medical, dental, and behavioral health services to Alaska Native and American Indian people.',
      url: 'https://anmc.org',
      tags: ['health', 'hospital', 'medical', 'dental', 'emergency'],
      eligibility: ['Alaska Native', 'American Indian with tribal enrollment'],
      type: 'state' as const,
      state: 'AK',
    },
  ]

  // ========================================
  // EMERGENCY RESOURCES
  // ========================================
  console.log('🚨 Adding Emergency Resources...')

  const emergencyResources = [
    {
      title: 'National Domestic Violence Hotline - Native American Services',
      description: '24/7 support for domestic violence victims with culturally-specific services for Native Americans.',
      url: 'https://www.thehotline.org',
      tags: ['emergency', 'domestic violence', 'crisis', 'hotline'],
      eligibility: ['Anyone experiencing domestic violence', 'Confidential and free'],
      type: 'emergency' as const,
    },
    {
      title: 'StrongHearts Native Helpline',
      description: 'Culturally-appropriate domestic and sexual violence helpline for Native Americans and Alaska Natives.',
      url: 'https://www.strongheartshelpline.org',
      tags: ['emergency', 'domestic violence', 'sexual violence', 'crisis', 'hotline'],
      eligibility: ['Native American and Alaska Native individuals', 'Family members', 'Friends'],
      type: 'emergency' as const,
    },
    {
      title: 'Indian Health Service Crisis Line',
      description: 'Immediate mental health crisis support for Native Americans and Alaska Natives.',
      url: 'https://www.ihs.gov/suicideprevention/crisisresources/',
      tags: ['emergency', 'mental health', 'crisis', 'suicide prevention'],
      eligibility: ['Native American individuals', 'Alaska Native individuals', 'Available 24/7'],
      type: 'emergency' as const,
    },
    {
      title: 'FEMA Tribal Emergency Management Assistance',
      description: 'Emergency preparedness, response, and recovery assistance for tribal communities.',
      url: 'https://www.fema.gov/about/organization/region-9/tribal',
      tags: ['emergency', 'disaster relief', 'preparedness', 'recovery'],
      eligibility: ['Federally recognized tribes', 'Tribal emergency management organizations'],
      type: 'federal' as const,
    },
  ]

  // ========================================
  // SCHOLARSHIPS (Diverse Deadlines)
  // ========================================
  console.log('🎓 Adding Scholarships...')

  const scholarships = [
    {
      name: 'American Indian College Fund Full Circle Scholarship',
      description: 'Merit and need-based scholarships for Native American students attending tribal colleges and universities.',
      amount: 'Varies ($500 - $10,000)',
      deadline: new Date('2025-05-31'),
      tags: ['education', 'undergraduate', 'tribal college', 'merit-based'],
      eligibility: ['Enrolled tribal member', 'Attending tribal college or university', '2.0 GPA minimum'],
      url: 'https://collegefund.org/students/scholarships/',
    },
    {
      name: 'Udall Undergraduate Scholarship',
      description: 'For sophomores and juniors studying environmental fields, tribal public policy, or Native American health care.',
      amount: '$7,000',
      deadline: new Date('2025-03-01'),
      tags: ['education', 'undergraduate', 'environmental', 'public policy', 'health'],
      eligibility: ['Native American or Alaska Native', 'U.S. citizen', 'Sophomore or junior', '3.0 GPA'],
      url: 'https://www.udall.gov/OurPrograms/UdallUndergraduateScholarship.aspx',
    },
    {
      name: 'AISES Intel Growing the Legacy Scholarship',
      description: 'For Native American students pursuing degrees in STEM fields.',
      amount: '$5,000 - $10,000',
      deadline: new Date('2025-04-15'),
      tags: ['education', 'undergraduate', 'graduate', 'STEM', 'engineering'],
      eligibility: ['AISES member', 'Native American', 'STEM major', '3.0 GPA minimum'],
      url: 'https://www.aises.org/scholarships',
    },
    {
      name: 'Catching the Dream Scholarship',
      description: 'Multiple scholarship programs including MESBEC (math, engineering, science, business), Native Teachers, and Tribal Business Management.',
      amount: '$500 - $5,000',
      deadline: new Date('2025-04-30'),
      tags: ['education', 'undergraduate', 'graduate', 'STEM', 'business', 'teaching'],
      eligibility: ['At least 1/4 Native American', 'Enrolled in accredited institution', '3.0 GPA'],
      url: 'http://www.catchingthedream.org',
    },
    {
      name: 'Cobell Scholarship for Graduate Students',
      description: 'Scholarships for Native American and Alaska Native graduate students in any field of study.',
      amount: 'Up to $40,000',
      deadline: new Date('2025-06-01'),
      tags: ['education', 'graduate', 'masters', 'doctorate'],
      eligibility: ['Enrolled tribal member', 'Accepted to graduate program', 'Demonstrate financial need'],
      url: 'https://www.cobellscholar.org',
    },
    {
      name: 'Association on American Indian Affairs Emergency Aid Scholarship',
      description: 'Emergency funding for Native American students facing unexpected financial crises.',
      amount: 'Up to $400',
      deadline: new Date('2025-12-31'),
      tags: ['education', 'emergency', 'financial aid', 'undergraduate', 'graduate'],
      eligibility: ['Native American student', 'Enrolled in accredited institution', 'Experiencing financial emergency'],
      url: 'https://www.indian-affairs.org/emergency-aid-scholarship.html',
    },
    {
      name: 'Native Forward Scholars Fund',
      description: 'Comprehensive scholarship program with mentorship for Native American students.',
      amount: '$1,000 - $10,000',
      deadline: new Date('2025-02-28'),
      tags: ['education', 'undergraduate', 'graduate', 'mentorship'],
      eligibility: ['Enrolled tribal member', 'Full-time student', '2.5 GPA minimum'],
      url: 'https://www.nativescholarsfund.org',
    },
    {
      name: 'Smithsonian Native American Internship Program',
      description: 'Paid internships for Native American students interested in museum studies, research, and cultural preservation.',
      amount: '$750/week stipend',
      deadline: new Date('2025-02-01'),
      tags: ['internship', 'museum studies', 'cultural preservation', 'research'],
      eligibility: ['Native American student', 'Undergraduate or graduate', 'Interest in museum field'],
      url: 'https://www.si.edu/ofi/internship-opportunities',
    },
    {
      name: 'Bureau of Indian Affairs Higher Education Grant',
      description: 'Financial assistance for undergraduate and graduate Native American students.',
      amount: 'Varies by tribe',
      deadline: new Date('2025-07-01'),
      tags: ['education', 'undergraduate', 'graduate', 'financial aid'],
      eligibility: ['Enrolled tribal member', 'Apply through tribal education department', 'Demonstrate financial need'],
      url: 'https://www.bie.edu/topic-page/higher-education-scholarship',
    },
    {
      name: 'National Indian Gaming Association Scholarships',
      description: 'Scholarships for Native American students, with preference for gaming industry related studies.',
      amount: '$2,500 - $10,000',
      deadline: new Date('2025-05-01'),
      tags: ['education', 'undergraduate', 'graduate', 'business', 'hospitality'],
      eligibility: ['Enrolled tribal member', '3.0 GPA minimum', 'Full-time enrollment'],
      url: 'https://www.indiangaming.org/education/scholarships/',
    },
    {
      name: 'Hopi Education Endowment Fund',
      description: 'Scholarships for Hopi tribal members pursuing higher education.',
      amount: '$1,000 - $5,000',
      deadline: new Date('2025-04-01'),
      tags: ['education', 'undergraduate', 'graduate', 'tribal-specific'],
      eligibility: ['Enrolled Hopi tribal member', 'Accepted to accredited institution'],
      url: 'https://www.hopieducationfund.org',
    },
    {
      name: 'Cherokee Nation Higher Education Scholarship',
      description: 'Comprehensive scholarship program for Cherokee Nation citizens.',
      amount: 'Varies',
      deadline: new Date('2025-06-15'),
      tags: ['education', 'undergraduate', 'graduate', 'tribal-specific'],
      eligibility: ['Cherokee Nation citizenship', 'Enrolled in accredited institution', 'Maintain satisfactory progress'],
      url: 'https://www.cherokee.org/all-services/education-services/',
    },
    {
      name: 'American Indian Graduate Center Fellowship',
      description: 'Fellowships for Native American graduate students pursuing masters and doctoral degrees.',
      amount: '$1,000 - $5,000',
      deadline: new Date('2025-05-15'),
      tags: ['education', 'graduate', 'masters', 'doctorate', 'fellowship'],
      eligibility: ['Enrolled tribal member', 'Admitted to graduate program', 'Financial need'],
      url: 'https://www.aigcs.org/scholarships/graduate-fellowships/',
    },
    {
      name: 'National Society of Professional Engineers Auxiliary Scholarship',
      description: 'For Native American engineering students.',
      amount: '$1,000',
      deadline: new Date('2025-03-15'),
      tags: ['education', 'undergraduate', 'engineering', 'STEM'],
      eligibility: ['Native American', 'Engineering major', 'Junior or senior year'],
      url: 'https://www.nspe.org/resources/students/scholarships',
    },
    {
      name: 'United South and Eastern Tribes (USET) Scholarship',
      description: 'For enrolled members of USET tribes pursuing higher education.',
      amount: '$500 - $2,500',
      deadline: new Date('2025-04-30'),
      tags: ['education', 'undergraduate', 'graduate', 'tribal-specific'],
      eligibility: ['Enrolled member of USET tribe', 'Full-time enrollment', 'Good academic standing'],
      url: 'https://www.usetinc.org',
    },
  ]

  // ========================================
  // YOUTH PROGRAMS
  // ========================================
  console.log('👶 Adding Youth Programs...')

  const youthResources = [
    {
      title: 'Native American Youth and Family Center',
      description: 'Programs for Native youth including after-school activities, summer camps, college prep, and cultural education.',
      url: 'https://www.nayapdx.org',
      tags: ['youth', 'education', 'cultural programming', 'after-school'],
      eligibility: ['Native American youth', 'Families'],
      type: 'tribal' as const,
    },
    {
      title: 'Boys & Girls Clubs of Native America',
      description: 'Safe, positive environments for Native youth with programs in education, health, leadership, and cultural activities.',
      url: 'https://www.bgca.org/about-us/serving-native-communities',
      tags: ['youth', 'after-school', 'leadership', 'sports', 'cultural programming'],
      eligibility: ['Native American youth ages 6-18', 'Located in or near Native communities'],
      type: 'federal' as const,
    },
    {
      title: 'United National Indian Tribal Youth (UNITY)',
      description: 'Youth leadership organization promoting personal development, citizenship, and cultural awareness.',
      url: 'https://www.unityinc.org',
      tags: ['youth', 'leadership', 'cultural programming', 'community service'],
      eligibility: ['Native American youth ages 14-24'],
      type: 'tribal' as const,
    },
  ]

  // ========================================
  // ELDERS PROGRAMS
  // ========================================
  console.log('👵 Adding Elder Programs...')

  const eldersResources = [
    {
      title: 'Administration for Community Living - Native American Programs',
      description: 'Nutrition services, caregiver support, and elder services for Native American elders.',
      url: 'https://acl.gov/programs/aging-and-disability-networks/native-american-aging-programs',
      tags: ['elders', 'nutrition', 'caregiver support', 'health'],
      eligibility: ['Native American elders age 60+', 'Caregivers of Native American elders'],
      type: 'federal' as const,
    },
    {
      title: 'National Indian Council on Aging',
      description: 'Advocacy and resources for Native American elders including health, long-term care, and quality of life programs.',
      url: 'https://www.nicoa.org',
      tags: ['elders', 'advocacy', 'health', 'long-term care'],
      eligibility: ['Native American elders', 'Tribal aging programs'],
      type: 'federal' as const,
    },
  ]

  // ========================================
  // LANGUAGE & CULTURE
  // ========================================
  console.log('🗣️ Adding Language & Culture Programs...')

  const languageResources = [
    {
      title: 'Native American Languages Act Grant Program',
      description: 'Grants for tribal programs to preserve and revitalize Native American languages.',
      url: 'https://www.acf.hhs.gov/ana/programs/native-language-preservation-maintenance',
      tags: ['language', 'cultural preservation', 'grants', 'education'],
      eligibility: ['Federally recognized tribes', 'Alaska Native villages', 'Native Hawaiian organizations'],
      type: 'federal' as const,
    },
    {
      title: 'First Nations Development Institute Cultural Language Program',
      description: 'Support for Native language revitalization efforts including education materials and teacher training.',
      url: 'https://www.firstnations.org/what-we-do/native-languages/',
      tags: ['language', 'cultural preservation', 'education', 'training'],
      eligibility: ['Native communities', 'Language preservation programs'],
      type: 'tribal' as const,
    },
  ]

  // ========================================
  // INSERT DATA
  // ========================================
  const allResources = [
    ...federalResources,
    ...stateResources,
    ...emergencyResources,
    ...youthResources,
    ...eldersResources,
    ...languageResources,
  ]

  let resourcesAdded = 0
  for (const resource of allResources) {
    try {
      const existing = await prisma.resource.findFirst({
        where: { title: resource.title },
      })

      if (!existing) {
        await prisma.resource.create({ data: resource })
        resourcesAdded++
      }
    } catch (error) {
      console.log(`⚠️ Skipped: ${resource.title}`)
    }
  }

  let scholarshipsAdded = 0
  for (const scholarship of scholarships) {
    try {
      const existing = await prisma.scholarship.findFirst({
        where: { name: scholarship.name },
      })

      if (!existing) {
        await prisma.scholarship.create({ data: scholarship })
        scholarshipsAdded++
      }
    } catch (error) {
      console.log(`⚠️ Skipped: ${scholarship.name}`)
    }
  }

  // ========================================
  // FINAL REPORT
  // ========================================
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('✅ COMPREHENSIVE DATA ADDED!')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log(`📊 New Data Added:`)
  console.log(`   • Resources: ${resourcesAdded}`)
  console.log(`   • Scholarships: ${scholarshipsAdded}`)
  console.log('\n📊 Database Totals:')

  const totals = {
    tribes: await prisma.tribe.count({ where: { deletedAt: null } }),
    resources: await prisma.resource.count({ where: { deletedAt: null } }),
    scholarships: await prisma.scholarship.count({ where: { deletedAt: null } }),
  }

  console.log(`   • Tribes: ${totals.tribes}`)
  console.log(`   • Resources: ${totals.resources}`)
  console.log(`   • Scholarships: ${totals.scholarships}`)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
}

addComprehensiveData()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
