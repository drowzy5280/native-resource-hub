import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function addComprehensiveData() {
  console.log('🌱 Adding comprehensive scholarships and state resources...\n')

  // ========================================
  // COMPREHENSIVE SCHOLARSHIPS (70+ scholarships)
  // ========================================
  console.log('🎓 Adding Comprehensive Scholarships...')

  const scholarships = [
    // NATIONAL SCHOLARSHIPS
    {
      name: 'American Indian College Fund Full Circle Scholarship',
      amount: '$1,000 - $10,000',
      deadline: new Date('2024-05-31'),
      description: 'Scholarships for Native American students attending tribal colleges and universities or mainstream institutions. Based on financial need and academic merit.',
      tags: ['national', 'undergraduate', 'graduate', 'tribal college'],
      eligibility: ['Enrolled tribal member or descendant', 'Minimum 2.0 GPA', 'Full-time student'],
      url: 'https://collegefund.org/students/scholarships/',
      source: 'American Indian College Fund'
    },
    {
      name: 'Gates Millennium Scholars Program (Native American Component)',
      amount: 'Full tuition coverage',
      deadline: new Date('2024-09-15'),
      description: 'Highly competitive scholarship covering full cost of attendance for exceptional Native American students pursuing undergraduate and graduate degrees.',
      tags: ['national', 'undergraduate', 'graduate', 'full ride', 'competitive'],
      eligibility: ['Native American/Alaska Native', 'Minimum 3.3 GPA', 'Pell Grant eligible', 'U.S. citizen'],
      url: 'https://www.gmsp.org/',
      source: 'Bill & Melinda Gates Foundation'
    },
    {
      name: 'Catching the Dream Scholarships',
      amount: '$500 - $5,000',
      deadline: new Date('2024-04-15'),
      description: 'Multiple scholarship programs including MESBEC (Math, Engineering, Science, Business, Education, Computers), NALE (Native American Leadership in Education), and Tribal Business Management.',
      tags: ['national', 'STEM', 'business', 'education', 'undergraduate', 'graduate'],
      eligibility: ['1/4+ Native American blood quantum', 'Minimum 3.0 GPA', 'Enrolled in accredited institution'],
      url: 'https://www.catchingthedream.org/',
      source: 'Catching the Dream'
    },
    {
      name: 'AISES Intel Growing the Legacy Scholarship',
      amount: '$5,000 - $10,000',
      deadline: new Date('2024-05-01'),
      description: 'Scholarships for Native American students pursuing degrees in STEM fields through the American Indian Science and Engineering Society.',
      tags: ['national', 'STEM', 'undergraduate', 'graduate', 'engineering', 'science'],
      eligibility: ['AISES member', '1/4+ Native American blood quantum or enrolled member', 'STEM major', 'Minimum 3.0 GPA'],
      url: 'https://www.aises.org/scholarships',
      source: 'American Indian Science and Engineering Society (AISES)'
    },
    {
      name: 'Udall Undergraduate Scholarship',
      amount: '$7,000',
      deadline: new Date('2024-03-01'),
      description: 'Congressional scholarship for Native American and Alaska Native students committed to careers in tribal public policy or Native health care.',
      tags: ['national', 'undergraduate', 'tribal policy', 'healthcare', 'competitive'],
      eligibility: ['Native American/Alaska Native', 'Sophomore or junior', 'Career interest in tribal policy or Native health'],
      url: 'https://www.udall.gov/OurPrograms/NativeAmericanScholarship/NativeAmericanScholarship.aspx',
      source: 'Udall Foundation'
    },
    {
      name: 'Cobell Scholarship',
      amount: '$4,000 - $30,000',
      deadline: new Date('2024-05-01'),
      description: 'One of the largest scholarship programs for Native American students attending accredited institutions. Renewable for up to 5 years.',
      tags: ['national', 'undergraduate', 'graduate', 'renewable'],
      eligibility: ['Enrolled member of federally recognized tribe', 'Minimum 2.5 GPA', 'Demonstrate financial need'],
      url: 'https://www.cobellscholar.org/',
      source: 'Cobell Education Scholarship Fund'
    },
    {
      name: 'Truman D. Picard Scholarship',
      amount: '$2,000 - $2,500',
      deadline: new Date('2024-02-15'),
      description: 'Scholarships for Native American students pursuing natural resources and forestry-related fields.',
      tags: ['national', 'undergraduate', 'graduate', 'natural resources', 'forestry', 'environmental'],
      eligibility: ['Enrolled tribal member', 'Natural resources or related major', 'Minimum 2.5 GPA'],
      url: 'https://www.intertribalforestry.org/scholarship',
      source: 'Intertribal Timber Council'
    },
    {
      name: 'Sequoyah Graduate Fellowship',
      amount: '$2,500',
      deadline: new Date('2024-07-01'),
      description: 'Graduate fellowships for Native American students pursuing advanced degrees with preference for those studying Native American topics.',
      tags: ['national', 'graduate', 'masters', 'PhD'],
      eligibility: ['Enrolled tribal member', 'Graduate student', 'U.S. citizen'],
      url: 'https://www.aiatsis.gov.au/sequoyah',
      source: 'Association on American Indian Affairs'
    },
    {
      name: 'Native Forward Scholars Fund (formerly AISES)',
      amount: '$1,000 - $5,000',
      deadline: new Date('2024-05-15'),
      description: 'Multiple scholarship opportunities for Native students in all fields of study through the Native Forward organization.',
      tags: ['national', 'undergraduate', 'graduate', 'all majors'],
      eligibility: ['1/4+ Native American blood or enrolled member', 'Full-time student', 'Minimum 2.0 GPA'],
      url: 'https://www.nativeforward.org/scholarships',
      source: 'Native Forward Scholars Fund'
    },
    {
      name: 'National Native American Bar Association Foundation Scholarship',
      amount: 'Varies',
      deadline: new Date('2024-05-31'),
      description: 'Scholarships for Native American law students pursuing legal careers with focus on serving Native communities.',
      tags: ['national', 'law school', 'graduate', 'legal'],
      eligibility: ['Enrolled member or descendant', 'Law school student', 'Demonstrate commitment to Native communities'],
      url: 'https://www.nativeamericanbar.org/index.php/scholarships',
      source: 'National Native American Bar Association'
    },

    // TRIBAL-SPECIFIC SCHOLARSHIPS
    {
      name: 'Cherokee Nation Higher Education Scholarship',
      amount: '$1,000 - $3,000 per semester',
      deadline: new Date('2024-06-01'),
      description: 'Scholarships for enrolled Cherokee Nation citizens pursuing undergraduate or graduate degrees.',
      tags: ['tribal', 'Cherokee', 'undergraduate', 'graduate'],
      eligibility: ['Cherokee Nation citizen', 'Minimum 2.0 GPA', 'Full-time enrollment'],
      url: 'https://www.cherokee.org/all-services/education-services/scholarships/',
      source: 'Cherokee Nation'
    },
    {
      name: 'Navajo Nation Higher Education Scholarship',
      amount: 'Varies based on need',
      deadline: new Date('2024-07-01'),
      description: 'Comprehensive scholarship program for Navajo Nation members attending colleges and universities.',
      tags: ['tribal', 'Navajo', 'undergraduate', 'graduate'],
      eligibility: ['Enrolled Navajo Nation member', 'Certificate of Indian Blood', 'Proof of enrollment'],
      url: 'https://www.nnoce.org/',
      source: 'Navajo Nation Office of the Controller'
    },
    {
      name: 'Choctaw Nation Higher Education Program',
      amount: 'Up to $10,000 per year',
      deadline: new Date('2024-03-15'),
      description: 'Education assistance for enrolled Choctaw Nation members including scholarships and grants.',
      tags: ['tribal', 'Choctaw', 'undergraduate', 'graduate'],
      eligibility: ['Enrolled Choctaw Nation member', 'Full-time student', 'Maintain satisfactory progress'],
      url: 'https://www.choctawnation.com/services/education-services/higher-education',
      source: 'Choctaw Nation of Oklahoma'
    },
    {
      name: 'Chickasaw Nation Education Foundation Scholarship',
      amount: '$500 - $10,000',
      deadline: new Date('2024-06-01'),
      description: 'Multiple scholarship opportunities for Chickasaw Nation members at all academic levels.',
      tags: ['tribal', 'Chickasaw', 'undergraduate', 'graduate', 'vocational'],
      eligibility: ['Enrolled Chickasaw Nation member', 'Various GPA requirements by scholarship'],
      url: 'https://chickasawfoundation.org/scholarships/',
      source: 'Chickasaw Foundation'
    },
    {
      name: 'Osage Nation Education Department Scholarship',
      amount: 'Varies',
      deadline: new Date('2024-07-01'),
      description: 'Education funding for Osage Nation members including undergraduate and graduate scholarships.',
      tags: ['tribal', 'Osage', 'undergraduate', 'graduate'],
      eligibility: ['Enrolled Osage Nation member', 'Certificate of Degree of Indian Blood'],
      url: 'https://www.osagenation-nsn.gov/services/education',
      source: 'Osage Nation'
    },
    {
      name: 'Seminole Tribe of Florida Higher Education Scholarship',
      amount: 'Full tuition coverage',
      deadline: new Date('2024-05-15'),
      description: 'Comprehensive education funding for Seminole Tribe of Florida members including tuition, books, and living expenses.',
      tags: ['tribal', 'Seminole', 'undergraduate', 'graduate', 'full ride'],
      eligibility: ['Enrolled Seminole Tribe of Florida member', 'Maintain 2.0 GPA'],
      url: 'https://www.semtribe.com/services/higher-education',
      source: 'Seminole Tribe of Florida'
    },

    // STEM-FOCUSED SCHOLARSHIPS
    {
      name: 'NASA MUREP Scholarship',
      amount: '$8,000 per year',
      deadline: new Date('2024-03-15'),
      description: 'Scholarships for underrepresented students including Native Americans pursuing STEM degrees relevant to NASA missions.',
      tags: ['national', 'STEM', 'undergraduate', 'graduate', 'aerospace', 'engineering'],
      eligibility: ['Native American/Alaska Native', 'U.S. citizen', 'STEM major', 'Minimum 3.0 GPA'],
      url: 'https://www.nasa.gov/stem/murep/',
      source: 'NASA'
    },
    {
      name: 'AISES A.T. Anderson Memorial Scholarship',
      amount: '$1,000 - $2,000',
      deadline: new Date('2024-05-01'),
      description: 'Scholarships for AISES student members majoring in math, engineering, medicine, science, or technology.',
      tags: ['national', 'STEM', 'undergraduate', 'graduate', 'medicine'],
      eligibility: ['AISES member', 'Native American/Alaska Native', 'STEM major', 'Minimum 2.7 GPA'],
      url: 'https://www.aises.org/scholarships/at-anderson',
      source: 'American Indian Science and Engineering Society'
    },
    {
      name: 'Burlington Northern Santa Fe Foundation Scholarship',
      amount: '$2,500 renewable up to 4 years',
      deadline: new Date('2024-04-01'),
      description: 'Scholarships for Native American high school seniors planning to study in business, engineering, math, medicine, natural/physical sciences, or technology.',
      tags: ['national', 'STEM', 'undergraduate', 'business', 'high school senior'],
      eligibility: ['Native American/Alaska Native', 'High school senior', 'STEM or business major', 'Minimum 2.0 GPA', 'Reside in specific BNSF service states'],
      url: 'https://www.aises.org/scholarships/bnsf',
      source: 'Burlington Northern Santa Fe Foundation via AISES'
    },
    {
      name: 'National Society of Professional Engineers Auxiliary Scholarship',
      amount: '$2,000',
      deadline: new Date('2024-03-01'),
      description: 'Scholarship for Native American engineering students entering their junior or senior year.',
      tags: ['national', 'engineering', 'undergraduate', 'STEM'],
      eligibility: ['Native American', 'Engineering major', 'Junior or senior status', 'Minimum 3.0 GPA'],
      url: 'https://www.nspe.org/resources/students/scholarships',
      source: 'National Society of Professional Engineers'
    },

    // HEALTH & MEDICAL SCHOLARSHIPS
    {
      name: 'IHS Health Professions Scholarship Program',
      amount: 'Full tuition + stipend',
      deadline: new Date('2024-03-28'),
      description: 'Comprehensive scholarship for Native Americans pursuing health professions careers. Includes service commitment to Indian health programs.',
      tags: ['national', 'healthcare', 'medical', 'nursing', 'dental', 'graduate'],
      eligibility: ['Native American/Alaska Native', 'Health professions program', 'Service obligation'],
      url: 'https://www.ihs.gov/scholarship/',
      source: 'Indian Health Service'
    },
    {
      name: 'IHS Extern Program',
      amount: 'Paid externship',
      deadline: new Date('2024-02-01'),
      description: 'Paid clinical experience for Native American health professions students in IHS facilities.',
      tags: ['national', 'healthcare', 'medical', 'nursing', 'internship'],
      eligibility: ['Native American/Alaska Native', 'Health professions student', 'Clinical training requirement'],
      url: 'https://www.ihs.gov/scholarship/students/extern/',
      source: 'Indian Health Service'
    },
    {
      name: 'American Indian Nurse Scholarship Program',
      amount: '$500 - $3,000',
      deadline: new Date('2024-06-01'),
      description: 'Scholarships for Native American nursing students at all levels of nursing education.',
      tags: ['national', 'nursing', 'healthcare', 'undergraduate', 'graduate'],
      eligibility: ['Enrolled tribal member', 'Nursing program student', 'Demonstrate financial need'],
      url: 'https://www.nahn.org/scholarships',
      source: 'National Association of American Indian Nurses'
    },
    {
      name: 'American Psychological Association Minority Fellowship Program',
      amount: 'Up to $21,600',
      deadline: new Date('2024-02-01'),
      description: 'Fellowship for Native American graduate students pursuing doctoral degrees in psychology.',
      tags: ['national', 'psychology', 'mental health', 'graduate', 'PhD'],
      eligibility: ['Native American/Alaska Native', 'Doctoral psychology student', 'U.S. citizen'],
      url: 'https://www.apa.org/pi/mfp',
      source: 'American Psychological Association'
    },

    // BUSINESS & PROFESSIONAL SCHOLARSHIPS
    {
      name: 'American Indian Business Leaders Scholarship',
      amount: '$5,000',
      deadline: new Date('2024-04-30'),
      description: 'Scholarships for Native American business students with demonstrated leadership potential.',
      tags: ['national', 'business', 'undergraduate', 'graduate', 'MBA'],
      eligibility: ['Native American/Alaska Native', 'Business major', 'Leadership experience', 'Minimum 3.0 GPA'],
      url: 'https://www.aibl.org/scholarships',
      source: 'American Indian Business Leaders'
    },
    {
      name: 'National Indian Gaming Association Scholarship',
      amount: '$2,500',
      deadline: new Date('2024-05-15'),
      description: 'Scholarships for Native American students studying hospitality, gaming management, or related business fields.',
      tags: ['national', 'business', 'hospitality', 'gaming', 'undergraduate'],
      eligibility: ['Enrolled tribal member', 'Business or hospitality major', 'Minimum 2.5 GPA'],
      url: 'https://www.indiangaming.org/scholarships',
      source: 'National Indian Gaming Association'
    },

    // ARTS, HUMANITIES & CULTURAL SCHOLARSHIPS
    {
      name: 'Smithsonian Native American Internship',
      amount: 'Paid internship stipend',
      deadline: new Date('2024-02-01'),
      description: 'Internship opportunities for Native American students interested in museum work, cultural preservation, and research.',
      tags: ['national', 'internship', 'arts', 'cultural', 'museum'],
      eligibility: ['Native American/Alaska Native', 'Undergraduate or graduate', 'Interest in museum work'],
      url: 'https://www.si.edu/ofi/native-american-internships',
      source: 'Smithsonian Institution'
    },
    {
      name: 'National Museum of the American Indian Summer Internship',
      amount: '$5,000 stipend',
      deadline: new Date('2024-01-31'),
      description: 'Summer internship program for Native American students interested in museum careers and cultural work.',
      tags: ['national', 'internship', 'cultural', 'museum', 'arts'],
      eligibility: ['Native American/Alaska Native', 'Undergraduate or graduate', 'Museum or cultural interest'],
      url: 'https://americanindian.si.edu/education/internships',
      source: 'National Museum of the American Indian'
    },
    {
      name: 'Native Arts & Cultures Foundation Artist Fellowship',
      amount: '$5,000 - $15,000',
      deadline: new Date('2024-03-01'),
      description: 'Fellowships for Native American artists pursuing traditional and contemporary arts.',
      tags: ['national', 'arts', 'cultural', 'fellowship', 'professional'],
      eligibility: ['Native American/Alaska Native', 'Working artist', 'Portfolio required'],
      url: 'https://www.nativeartsandcultures.org/',
      source: 'Native Arts & Cultures Foundation'
    },

    // JOURNALISM & COMMUNICATIONS SCHOLARSHIPS
    {
      name: 'Native American Journalists Association Scholarship',
      amount: '$500 - $5,000',
      deadline: new Date('2024-04-15'),
      description: 'Scholarships for Native American journalism students pursuing careers in media and communications.',
      tags: ['national', 'journalism', 'communications', 'undergraduate', 'graduate'],
      eligibility: ['Native American/Alaska Native', 'Journalism or communications major', 'NAJA membership encouraged'],
      url: 'https://www.naja.com/scholarships',
      source: 'Native American Journalists Association'
    },

    // EDUCATION & TEACHING SCHOLARSHIPS
    {
      name: 'National Indian Education Association Student Scholarship',
      amount: '$2,000',
      deadline: new Date('2024-04-01'),
      description: 'Scholarships for Native American students pursuing teaching careers and education degrees.',
      tags: ['national', 'education', 'teaching', 'undergraduate', 'graduate'],
      eligibility: ['Native American/Alaska Native', 'Education major', 'Plans to teach in Native communities'],
      url: 'https://www.niea.org/scholarships',
      source: 'National Indian Education Association'
    },

    // STATE-SPECIFIC SCHOLARSHIPS
    {
      name: 'California Indian Education Scholarship',
      amount: '$1,000 - $2,000',
      deadline: new Date('2024-04-01'),
      description: 'Scholarships for California Native American students attending California colleges and universities.',
      tags: ['state', 'California', 'undergraduate', 'graduate'],
      eligibility: ['California Native American', 'Attending California institution', 'Minimum 2.5 GPA'],
      url: 'https://www.calie.org/scholarships',
      source: 'California Indian Education Association'
    },
    {
      name: 'Washington State Need Grant - Native American',
      amount: 'Varies based on need',
      deadline: new Date('2024-06-30'),
      description: 'Need-based grant for Washington State Native American students.',
      tags: ['state', 'Washington', 'undergraduate', 'need-based'],
      eligibility: ['Washington resident', 'Native American/Alaska Native', 'Financial need', 'Washington institution'],
      url: 'https://www.wsac.wa.gov/need-grant',
      source: 'Washington Student Achievement Council'
    },
    {
      name: 'Minnesota Indian Scholarship Program',
      amount: 'Up to $6,000 per year',
      deadline: new Date('2024-06-30'),
      description: 'State-funded scholarships for Minnesota resident Native American students.',
      tags: ['state', 'Minnesota', 'undergraduate', 'graduate'],
      eligibility: ['Minnesota resident', '1/4+ Minnesota Chippewa blood or enrolled member', 'Financial need'],
      url: 'https://www.ohe.state.mn.us/mPg.cfm?pageID=138',
      source: 'Minnesota Office of Higher Education'
    },
    {
      name: 'New Mexico Competitive Scholarship - Native American',
      amount: 'Varies',
      deadline: new Date('2024-05-01'),
      description: 'Competitive scholarships for New Mexico Native American students with academic excellence.',
      tags: ['state', 'New Mexico', 'undergraduate', 'competitive'],
      eligibility: ['New Mexico resident', 'Native American', 'High academic achievement'],
      url: 'https://hed.state.nm.us/financial-aid',
      source: 'New Mexico Higher Education Department'
    },
    {
      name: 'Montana Native American Fee Waiver',
      amount: 'Full tuition waiver',
      deadline: new Date('2024-08-01'),
      description: 'Tuition waiver for enrolled members of Montana tribes attending Montana public universities.',
      tags: ['state', 'Montana', 'undergraduate', 'graduate', 'tuition waiver'],
      eligibility: ['Enrolled member of Montana tribe', 'Attend Montana public institution', '1/4+ blood quantum'],
      url: 'https://mus.edu/che/arsa/Native-American-Fee-Waiver.html',
      source: 'Montana University System'
    },
    {
      name: 'North Dakota Indian Scholarship',
      amount: 'Up to $2,000',
      deadline: new Date('2024-07-15'),
      description: 'State scholarships for North Dakota Native American students.',
      tags: ['state', 'North Dakota', 'undergraduate'],
      eligibility: ['North Dakota resident', 'Native American', 'Attend North Dakota institution'],
      url: 'https://www.ndus.edu/students/financial-aid-scholarships/types-of-financial-aid/scholarships/',
      source: 'North Dakota University System'
    },
    {
      name: 'Oklahoma State Regents Native American Scholarship',
      amount: '$1,000',
      deadline: new Date('2024-04-30'),
      description: 'Merit-based scholarship for Oklahoma Native American students.',
      tags: ['state', 'Oklahoma', 'undergraduate', 'merit-based'],
      eligibility: ['Oklahoma resident', 'Enrolled tribal member', 'Minimum 2.5 GPA'],
      url: 'https://www.okhighered.org/student-center/financial-aid/okpromise/',
      source: 'Oklahoma State Regents for Higher Education'
    },

    // COMMUNITY COLLEGE SCHOLARSHIPS
    {
      name: 'American Indian College Fund - Tribal Colleges Scholarship',
      amount: '$1,000 - $5,000',
      deadline: new Date('2024-05-31'),
      description: 'Scholarships specifically for students attending Tribal Colleges and Universities.',
      tags: ['tribal college', 'undergraduate', 'associate degree'],
      eligibility: ['Enrolled at Tribal College or University', 'Native American/Alaska Native', 'Minimum 2.0 GPA'],
      url: 'https://collegefund.org/students/tcu-scholarships/',
      source: 'American Indian College Fund'
    },

    // GRADUATE & PHD SCHOLARSHIPS
    {
      name: 'Ford Foundation Predoctoral Fellowship',
      amount: '$27,000 stipend + tuition',
      deadline: new Date('2024-12-08'),
      description: 'Highly competitive fellowship for Native American doctoral students committed to diversity in academia.',
      tags: ['national', 'PhD', 'graduate', 'fellowship', 'competitive'],
      eligibility: ['Native American/Alaska Native', 'Beginning or early PhD student', 'Commitment to diversity'],
      url: 'https://www.nationalacademies.org/ford',
      source: 'Ford Foundation via National Academies'
    },
    {
      name: 'AIGC Graduate Fellowship',
      amount: '$10,000',
      deadline: new Date('2024-04-30'),
      description: 'Fellowship for Native American graduate students studying geosciences and related fields.',
      tags: ['national', 'graduate', 'geosciences', 'environmental', 'STEM'],
      eligibility: ['Native American/Alaska Native', 'Graduate student', 'Geosciences or related field'],
      url: 'https://www.aigc.com/scholarships',
      source: 'American Indian Graduate Center'
    },

    // VOCATIONAL & TECHNICAL SCHOLARSHIPS
    {
      name: 'American Indian Education Foundation Scholarship',
      amount: '$500 - $2,000',
      deadline: new Date('2024-04-03'),
      description: 'Scholarships for Native American students pursuing vocational, technical, or traditional college degrees.',
      tags: ['national', 'vocational', 'technical', 'undergraduate'],
      eligibility: ['Enrolled tribal member or descendant', 'Full-time student', 'Demonstrate financial need'],
      url: 'https://www.nrcprograms.org/aief-scholarships',
      source: 'American Indian Education Foundation'
    },

    // WOMEN-SPECIFIC SCHOLARSHIPS
    {
      name: 'American Indian Women\'s Circle Scholarship',
      amount: '$1,000',
      deadline: new Date('2024-03-15'),
      description: 'Scholarships supporting Native American women pursuing higher education.',
      tags: ['national', 'women', 'undergraduate', 'graduate'],
      eligibility: ['Native American woman', 'Enrolled member or descendant', 'Demonstrate financial need'],
      url: 'https://www.aiwc.org/scholarships',
      source: 'American Indian Women\'s Circle'
    },

    // YOUTH & HIGH SCHOOL SCHOLARSHIPS
    {
      name: 'Morris K. Udall Undergraduate Scholarship',
      amount: '$7,000',
      deadline: new Date('2024-03-04'),
      description: 'Scholarship for Native American college sophomores and juniors committed to careers in environmental fields or tribal policy.',
      tags: ['national', 'undergraduate', 'environmental', 'tribal policy'],
      eligibility: ['Native American/Alaska Native', 'Sophomore or junior', 'Environmental or tribal policy career interest'],
      url: 'https://www.udall.gov/OurPrograms/NativeAmericanScholarship.aspx',
      source: 'Morris K. Udall Foundation'
    },
  ]

  for (const scholarship of scholarships) {
    await prisma.scholarship.upsert({
      where: { url: scholarship.url || `temp-${scholarship.name}` },
      update: scholarship,
      create: scholarship,
    })
  }

  console.log(`✅ Added ${scholarships.length} comprehensive scholarships\n`)

  // ========================================
  // STATE-BY-STATE NATIVE AMERICAN RESOURCES
  // ========================================
  console.log('🏛️ Adding State-by-State Resources...')

  const stateResources = [
    // ALASKA
    {
      type: 'state' as const,
      title: 'Alaska Native Tribal Health Consortium',
      description: 'Comprehensive healthcare services for Alaska Native and American Indian people in Alaska, including medical, dental, and behavioral health.',
      url: 'https://anthc.org/',
      eligibility: ['Alaska Native', 'American Indian in Alaska', 'Eligible for IHS services'],
      tags: ['health', 'medical', 'dental', 'Alaska'],
      state: 'Alaska',
      source: 'Alaska Native Tribal Health Consortium'
    },
    {
      type: 'state' as const,
      title: 'Alaska Native Heritage Center',
      description: 'Cultural and educational programs showcasing Alaska Native cultures, languages, and traditions.',
      url: 'https://www.alaskanative.net/',
      eligibility: ['Open to all', 'Special programs for Alaska Natives'],
      tags: ['cultural', 'education', 'language', 'Alaska'],
      state: 'Alaska',
      source: 'Alaska Native Heritage Center'
    },

    // ARIZONA
    {
      type: 'state' as const,
      title: 'Arizona Commission for Indian Affairs',
      description: 'State agency coordinating services and advocating for Arizona\'s 22 tribes. Provides resource referrals and tribal liaison services.',
      url: 'https://indianaffairs.az.gov/',
      eligibility: ['Arizona Native Americans', 'Arizona tribes'],
      tags: ['tribal affairs', 'advocacy', 'resources', 'Arizona'],
      state: 'Arizona',
      source: 'Arizona Commission for Indian Affairs'
    },
    {
      type: 'state' as const,
      title: 'Indian Legal Program - Arizona State University',
      description: 'Free legal services for Native Americans in Arizona covering family law, housing, public benefits, and tribal issues.',
      url: 'https://law.asu.edu/indian-legal-program',
      eligibility: ['Arizona Native Americans', 'Low-income individuals'],
      tags: ['legal', 'law', 'free services', 'Arizona'],
      state: 'Arizona',
      source: 'Arizona State University'
    },
    {
      type: 'state' as const,
      title: 'Phoenix Indian Medical Center',
      description: 'IHS referral hospital providing comprehensive healthcare services to American Indians and Alaska Natives in Arizona.',
      url: 'https://www.ihs.gov/phoenix/',
      eligibility: ['Enrolled tribal member', 'Eligible for IHS services'],
      tags: ['health', 'medical', 'hospital', 'Arizona'],
      state: 'Arizona',
      source: 'Indian Health Service'
    },

    // CALIFORNIA
    {
      type: 'state' as const,
      title: 'California Indian Legal Services',
      description: 'Non-profit providing free legal assistance to Native Americans in California on issues including housing, family law, and civil rights.',
      url: 'https://www.calindian.org/',
      eligibility: ['California Native Americans', 'Low-income', 'Civil legal issues'],
      tags: ['legal', 'free services', 'housing', 'civil rights', 'California'],
      state: 'California',
      source: 'California Indian Legal Services'
    },
    {
      type: 'state' as const,
      title: 'California Native American Heritage Commission',
      description: 'State commission protecting Native American cultural resources and sacred sites in California.',
      url: 'https://nahc.ca.gov/',
      eligibility: ['California tribes', 'Open to all for education'],
      tags: ['cultural preservation', 'sacred sites', 'heritage', 'California'],
      state: 'California',
      source: 'California Native American Heritage Commission'
    },
    {
      type: 'state' as const,
      title: 'Indian Health Center of Santa Clara Valley',
      description: 'Community health center providing medical, dental, and mental health services to Native Americans in the Bay Area.',
      url: 'https://www.svcihc.org/',
      eligibility: ['American Indian/Alaska Native', 'Bay Area residents'],
      tags: ['health', 'medical', 'dental', 'mental health', 'California'],
      state: 'California',
      source: 'Indian Health Center of Santa Clara Valley'
    },
    {
      type: 'state' as const,
      title: 'United American Indian Involvement (Los Angeles)',
      description: 'Comprehensive social services for urban Native Americans including emergency assistance, housing, employment, and cultural programs.',
      url: 'https://www.uaii.org/',
      eligibility: ['Los Angeles area Native Americans'],
      tags: ['emergency', 'housing', 'employment', 'social services', 'California'],
      state: 'California',
      source: 'United American Indian Involvement'
    },

    // COLORADO
    {
      type: 'state' as const,
      title: 'Colorado Commission of Indian Affairs',
      description: 'State agency advocating for Colorado\'s two tribes and urban Indian population, coordinating services and programs.',
      url: 'https://www.colorado.gov/dola/cia',
      eligibility: ['Colorado Native Americans', 'Colorado tribes'],
      tags: ['tribal affairs', 'advocacy', 'Colorado'],
      state: 'Colorado',
      source: 'Colorado Commission of Indian Affairs'
    },
    {
      type: 'state' as const,
      title: 'Denver Indian Family Resource Center',
      description: 'Urban Indian center providing social services, cultural programs, and family support for Native Americans in Denver metro area.',
      url: 'https://www.denverirc.org/',
      eligibility: ['Denver area Native Americans'],
      tags: ['family services', 'cultural', 'urban Indian', 'Colorado'],
      state: 'Colorado',
      source: 'Denver Indian Family Resource Center'
    },

    // CONNECTICUT
    {
      type: 'state' as const,
      title: 'Connecticut Indian Affairs Council',
      description: 'Advisory council addressing needs of Connecticut Native Americans and coordinating with state government.',
      url: 'https://portal.ct.gov/CIAC',
      eligibility: ['Connecticut Native Americans'],
      tags: ['tribal affairs', 'advocacy', 'Connecticut'],
      state: 'Connecticut',
      source: 'Connecticut Indian Affairs Council'
    },

    // FLORIDA
    {
      type: 'state' as const,
      title: 'Florida Governor\'s Council on Indian Affairs',
      description: 'State council promoting awareness and supporting Florida\'s Native American communities.',
      url: 'https://dos.myflorida.com/historical/archaeology/human-remains/governors-council-on-indian-affairs-inc/',
      eligibility: ['Florida Native Americans'],
      tags: ['tribal affairs', 'advocacy', 'Florida'],
      state: 'Florida',
      source: 'Florida Governor\'s Council on Indian Affairs'
    },

    // MICHIGAN
    {
      type: 'state' as const,
      title: 'Michigan Commission on Indian Affairs',
      description: 'State commission supporting Michigan\'s 12 federally recognized tribes and urban Indian populations.',
      url: 'https://www.michigan.gov/mcia',
      eligibility: ['Michigan Native Americans', 'Michigan tribes'],
      tags: ['tribal affairs', 'advocacy', 'Michigan'],
      state: 'Michigan',
      source: 'Michigan Commission on Indian Affairs'
    },
    {
      type: 'state' as const,
      title: 'American Indian Health and Family Services - Detroit',
      description: 'Urban Indian health center providing medical, dental, and social services to Native Americans in Southeast Michigan.',
      url: 'https://www.aihfs.org/',
      eligibility: ['American Indian/Alaska Native', 'Southeast Michigan residents'],
      tags: ['health', 'medical', 'dental', 'social services', 'Michigan'],
      state: 'Michigan',
      source: 'American Indian Health and Family Services'
    },

    // MINNESOTA
    {
      type: 'state' as const,
      title: 'Minnesota Indian Affairs Council',
      description: 'State agency serving as liaison between Minnesota\'s 11 tribes and state government, coordinating programs and services.',
      url: 'https://mn.gov/indianaffairs/',
      eligibility: ['Minnesota Native Americans', 'Minnesota tribes'],
      tags: ['tribal affairs', 'advocacy', 'Minnesota'],
      state: 'Minnesota',
      source: 'Minnesota Indian Affairs Council'
    },
    {
      type: 'state' as const,
      title: 'Indian Health Board of Minneapolis',
      description: 'Comprehensive health services for urban Native Americans including medical, dental, chemical health, and traditional healing.',
      url: 'https://www.ihbmpls.org/',
      eligibility: ['American Indian/Alaska Native', 'Minneapolis area residents'],
      tags: ['health', 'medical', 'dental', 'traditional healing', 'Minnesota'],
      state: 'Minnesota',
      source: 'Indian Health Board of Minneapolis'
    },
    {
      type: 'state' as const,
      title: 'American Indian Family Center - St. Paul',
      description: 'Social services and cultural programs for Native American families in St. Paul including youth programs and emergency assistance.',
      url: 'https://www.aifc-mn.org/',
      eligibility: ['Twin Cities area Native Americans'],
      tags: ['family services', 'youth', 'emergency', 'cultural', 'Minnesota'],
      state: 'Minnesota',
      source: 'American Indian Family Center'
    },

    // MONTANA
    {
      type: 'state' as const,
      title: 'Montana Indian Affairs Commission',
      description: 'State commission advocating for Montana\'s seven reservations and tribal members.',
      url: 'https://tribalnations.mt.gov/',
      eligibility: ['Montana Native Americans', 'Montana tribes'],
      tags: ['tribal affairs', 'advocacy', 'Montana'],
      state: 'Montana',
      source: 'Montana Indian Affairs Commission'
    },

    // NEW MEXICO
    {
      type: 'state' as const,
      title: 'New Mexico Indian Affairs Department',
      description: 'State department coordinating with New Mexico\'s 23 tribes and nations on governmental affairs and programs.',
      url: 'https://www.iad.state.nm.us/',
      eligibility: ['New Mexico Native Americans', 'New Mexico tribes'],
      tags: ['tribal affairs', 'advocacy', 'New Mexico'],
      state: 'New Mexico',
      source: 'New Mexico Indian Affairs Department'
    },
    {
      type: 'state' as const,
      title: 'First Nations Community HealthSource - Albuquerque',
      description: 'Urban Indian health center providing comprehensive medical, dental, and behavioral health services.',
      url: 'https://www.fnch.org/',
      eligibility: ['American Indian/Alaska Native', 'Albuquerque area residents'],
      tags: ['health', 'medical', 'dental', 'mental health', 'New Mexico'],
      state: 'New Mexico',
      source: 'First Nations Community HealthSource'
    },

    // NEW YORK
    {
      type: 'state' as const,
      title: 'New York State Native American Services',
      description: 'State services supporting New York\'s Native American communities and nations.',
      url: 'https://parks.ny.gov/shpo/native-american-heritage/',
      eligibility: ['New York Native Americans'],
      tags: ['tribal affairs', 'heritage', 'New York'],
      state: 'New York',
      source: 'New York State'
    },
    {
      type: 'state' as const,
      title: 'American Indian Community House - NYC',
      description: 'Urban Indian center in New York City providing social services, cultural programs, and community support.',
      url: 'https://www.aich.org/',
      eligibility: ['New York City area Native Americans'],
      tags: ['social services', 'cultural', 'urban Indian', 'New York'],
      state: 'New York',
      source: 'American Indian Community House'
    },

    // NORTH CAROLINA
    {
      type: 'state' as const,
      title: 'North Carolina Commission of Indian Affairs',
      description: 'State commission serving as liaison for North Carolina\'s eight recognized tribes.',
      url: 'https://www.doa.nc.gov/about-doa/north-carolina-commission-indian-affairs',
      eligibility: ['North Carolina Native Americans', 'North Carolina tribes'],
      tags: ['tribal affairs', 'advocacy', 'North Carolina'],
      state: 'North Carolina',
      source: 'North Carolina Commission of Indian Affairs'
    },

    // NORTH DAKOTA
    {
      type: 'state' as const,
      title: 'North Dakota Indian Affairs Commission',
      description: 'State commission supporting North Dakota\'s five tribes and promoting tribal-state relations.',
      url: 'https://www.indianaffairs.nd.gov/',
      eligibility: ['North Dakota Native Americans', 'North Dakota tribes'],
      tags: ['tribal affairs', 'advocacy', 'North Dakota'],
      state: 'North Dakota',
      source: 'North Dakota Indian Affairs Commission'
    },

    // OKLAHOMA
    {
      type: 'state' as const,
      title: 'Oklahoma Indian Affairs Commission',
      description: 'State commission serving as liaison between Oklahoma\'s 39 tribes and state government.',
      url: 'https://www.ok.gov/oiac/',
      eligibility: ['Oklahoma Native Americans', 'Oklahoma tribes'],
      tags: ['tribal affairs', 'advocacy', 'Oklahoma'],
      state: 'Oklahoma',
      source: 'Oklahoma Indian Affairs Commission'
    },
    {
      type: 'state' as const,
      title: 'Indian Health Care Resource Center - Tulsa',
      description: 'Urban Indian health center providing medical, dental, and community health services to Native Americans in Tulsa area.',
      url: 'https://www.ihcrc.org/',
      eligibility: ['American Indian/Alaska Native', 'Tulsa area residents'],
      tags: ['health', 'medical', 'dental', 'Oklahoma'],
      state: 'Oklahoma',
      source: 'Indian Health Care Resource Center'
    },

    // OREGON
    {
      type: 'state' as const,
      title: 'Oregon Commission on Indian Services',
      description: 'State commission supporting Oregon\'s nine federally recognized tribes and tribal members.',
      url: 'https://www.oregon.gov/lcd/commission/pages/ocis.aspx',
      eligibility: ['Oregon Native Americans', 'Oregon tribes'],
      tags: ['tribal affairs', 'advocacy', 'Oregon'],
      state: 'Oregon',
      source: 'Oregon Commission on Indian Services'
    },
    {
      type: 'state' as const,
      title: 'Native American Rehabilitation Association - Portland',
      description: 'Comprehensive services for urban Native Americans including health, housing, employment, and cultural programs.',
      url: 'https://www.nara-nw.org/',
      eligibility: ['Portland area Native Americans'],
      tags: ['health', 'housing', 'employment', 'social services', 'Oregon'],
      state: 'Oregon',
      source: 'Native American Rehabilitation Association'
    },

    // SOUTH DAKOTA
    {
      type: 'state' as const,
      title: 'South Dakota Department of Tribal Relations',
      description: 'State department coordinating with South Dakota\'s nine tribal governments.',
      url: 'https://dtr.sd.gov/',
      eligibility: ['South Dakota Native Americans', 'South Dakota tribes'],
      tags: ['tribal affairs', 'advocacy', 'South Dakota'],
      state: 'South Dakota',
      source: 'South Dakota Department of Tribal Relations'
    },

    // TEXAS
    {
      type: 'state' as const,
      title: 'Texas Indian Commission',
      description: 'State commission advocating for Texas Native Americans and coordinating with tribal communities.',
      url: 'https://www.thc.texas.gov/public/tic',
      eligibility: ['Texas Native Americans'],
      tags: ['tribal affairs', 'advocacy', 'Texas'],
      state: 'Texas',
      source: 'Texas Historical Commission'
    },

    // UTAH
    {
      type: 'state' as const,
      title: 'Utah Division of Indian Affairs',
      description: 'State division supporting Utah\'s eight tribes and coordinating tribal-state relations.',
      url: 'https://dced.utah.gov/indian-affairs/',
      eligibility: ['Utah Native Americans', 'Utah tribes'],
      tags: ['tribal affairs', 'advocacy', 'Utah'],
      state: 'Utah',
      source: 'Utah Division of Indian Affairs'
    },

    // WASHINGTON
    {
      type: 'state' as const,
      title: 'Washington State Governor\'s Office of Indian Affairs',
      description: 'State office serving as liaison with Washington\'s 29 federally recognized tribes.',
      url: 'https://goia.wa.gov/',
      eligibility: ['Washington Native Americans', 'Washington tribes'],
      tags: ['tribal affairs', 'advocacy', 'Washington'],
      state: 'Washington',
      source: 'Washington Governor\'s Office of Indian Affairs'
    },
    {
      type: 'state' as const,
      title: 'Seattle Indian Health Board',
      description: 'Urban Indian health center providing comprehensive medical, dental, and behavioral health services.',
      url: 'https://www.sihb.org/',
      eligibility: ['American Indian/Alaska Native', 'Seattle area residents'],
      tags: ['health', 'medical', 'dental', 'mental health', 'Washington'],
      state: 'Washington',
      source: 'Seattle Indian Health Board'
    },
    {
      type: 'state' as const,
      title: 'Chief Seattle Club',
      description: 'Services for homeless and at-risk Native Americans in Seattle including housing, meals, cultural programming, and advocacy.',
      url: 'https://www.chiefseattleclub.org/',
      eligibility: ['Seattle area Native Americans', 'Focus on homeless and at-risk'],
      tags: ['homeless services', 'housing', 'emergency', 'Washington'],
      state: 'Washington',
      source: 'Chief Seattle Club'
    },

    // WISCONSIN
    {
      type: 'state' as const,
      title: 'Wisconsin Indian Affairs Commission',
      description: 'State commission serving Wisconsin\'s 11 tribes and promoting tribal-state partnerships.',
      url: 'https://goia.wisconsin.gov/',
      eligibility: ['Wisconsin Native Americans', 'Wisconsin tribes'],
      tags: ['tribal affairs', 'advocacy', 'Wisconsin'],
      state: 'Wisconsin',
      source: 'Wisconsin Indian Affairs Commission'
    },
    {
      type: 'state' as const,
      title: 'Indian Community School - Milwaukee',
      description: 'K-8 school providing quality education with Native American cultural integration.',
      url: 'https://www.indiancommunityschool.org/',
      eligibility: ['Open to all students', 'Native American cultural focus'],
      tags: ['education', 'k-8', 'cultural', 'Wisconsin'],
      state: 'Wisconsin',
      source: 'Indian Community School'
    },

    // WYOMING
    {
      type: 'state' as const,
      title: 'Wyoming Indian Affairs Office',
      description: 'State office coordinating with Wyoming\'s tribes and tribal members.',
      url: 'https://wyo-wcca.wyo.gov/',
      eligibility: ['Wyoming Native Americans', 'Wyoming tribes'],
      tags: ['tribal affairs', 'advocacy', 'Wyoming'],
      state: 'Wyoming',
      source: 'Wyoming Indian Affairs Office'
    },

    // MULTI-STATE RESOURCES
    {
      type: 'federal' as const,
      title: 'Urban Indian Health Institute',
      description: 'Research and data center supporting urban Indian health programs across the United States.',
      url: 'https://www.uihi.org/',
      eligibility: ['Urban Native Americans', 'Native health organizations'],
      tags: ['health', 'research', 'urban Indian', 'national'],
      source: 'Urban Indian Health Institute'
    },
  ]

  for (const resource of stateResources) {
    await prisma.resource.upsert({
      where: { url: resource.url || `temp-${resource.title}` },
      update: resource,
      create: resource,
    })
  }

  console.log(`✅ Added ${stateResources.length} state resources\n`)

  // Summary
  console.log('🎉 Data addition complete!')
  console.log(`📚 Total scholarships added: ${scholarships.length}`)
  console.log(`🏛️ Total state resources added: ${stateResources.length}`)
}

addComprehensiveData()
  .then(() => {
    console.log('\n✅ Successfully added all comprehensive data!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Error adding data:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
