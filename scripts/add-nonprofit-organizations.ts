import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function addNonprofitOrganizations() {
  console.log('🏛️ Adding Nonprofit Organizations to Tribal Resource Hub...\n')

  // ========================================
  // FEDERAL/NATIONAL NONPROFITS
  // ========================================
  console.log('🌎 Adding National Nonprofit Organizations...')

  const nationalNonprofits = [
    {
      title: 'National Congress of American Indians (NCAI)',
      description: 'The oldest, largest and most representative American Indian and Alaska Native organization serving the broad interests of tribal governments and communities.',
      url: 'https://www.ncai.org',
      tags: ['advocacy', 'policy', 'tribal sovereignty', 'government relations'],
      eligibility: ['Open to all tribes and Native organizations', 'Services available to all Native communities'],
      type: 'federal' as const,
    },
    {
      title: 'Native American Rights Fund (NARF)',
      description: 'National Indian legal defense and education organization providing legal representation and technical assistance to Indian tribes, organizations and individuals.',
      url: 'https://www.narf.org',
      tags: ['legal', 'advocacy', 'tribal sovereignty', 'rights protection'],
      eligibility: ['Native American tribes', 'Organizations', 'Individuals seeking legal assistance'],
      type: 'federal' as const,
    },
    {
      title: 'First Nations Development Institute',
      description: 'Works to strengthen American Indian economies to support healthy Native communities through asset-building, financial education, and community development.',
      url: 'https://www.firstnations.org',
      tags: ['economic development', 'financial education', 'grants', 'community development'],
      eligibility: ['Native American communities', 'Tribes', 'Native-led organizations'],
      type: 'federal' as const,
    },
    {
      title: 'National Indian Child Welfare Association (NICWA)',
      description: 'Dedicated to the well-being of American Indian and Alaska Native children and families through advocacy, education, and public awareness.',
      url: 'https://www.nicwa.org',
      tags: ['child welfare', 'family services', 'advocacy', 'education'],
      eligibility: ['Tribal child welfare programs', 'Native families', 'Child welfare professionals'],
      type: 'federal' as const,
    },
    {
      title: 'American Indian College Fund',
      description: 'Nation\'s largest scholarship provider for Native students attending tribal colleges, also supports tribal college operations and programs.',
      url: 'https://collegefund.org',
      tags: ['education', 'scholarships', 'tribal colleges', 'higher education'],
      eligibility: ['Native American students', 'Tribal colleges and universities'],
      type: 'federal' as const,
    },
    {
      title: 'National Indian Education Association (NIEA)',
      description: 'Advances comprehensive educational opportunities for American Indian, Alaska Native, and Native Hawaiian students while protecting cultural and linguistic traditions.',
      url: 'https://www.niea.org',
      tags: ['education', 'advocacy', 'cultural preservation', 'professional development'],
      eligibility: ['Native students', 'Educators', 'Education programs'],
      type: 'federal' as const,
    },
    {
      title: 'Association on American Indian Affairs (AAIA)',
      description: 'Provides direct support to Native communities including scholarships, legal advocacy, cultural preservation, and youth programs.',
      url: 'https://www.indian-affairs.org',
      tags: ['scholarships', 'legal advocacy', 'cultural preservation', 'youth programs'],
      eligibility: ['Native American individuals', 'Tribes', 'Native communities'],
      type: 'federal' as const,
    },
    {
      title: 'National Indian Health Board',
      description: 'Tribal-driven organization advocating for healthcare policy development and delivery to tribal communities.',
      url: 'https://www.nihb.org',
      tags: ['health', 'healthcare policy', 'advocacy', 'tribal health'],
      eligibility: ['Tribal health programs', 'Native communities', 'Health professionals'],
      type: 'federal' as const,
    },
    {
      title: 'Native American Finance Officers Association (NAFOA)',
      description: 'Strengthens tribal economies and fiscal management through training, technical assistance, and advocacy for Native American financial professionals.',
      url: 'https://www.nafoa.org',
      tags: ['finance', 'economic development', 'professional development', 'training'],
      eligibility: ['Tribal financial officers', 'Tribal governments', 'Native finance professionals'],
      type: 'federal' as const,
    },
    {
      title: 'Notah Begay III Foundation',
      description: 'Works to reduce childhood obesity and Type 2 diabetes in Native American communities through physical activity programs and health education.',
      url: 'https://www.nb3foundation.org',
      tags: ['health', 'youth', 'wellness', 'diabetes prevention', 'sports'],
      eligibility: ['Native American youth', 'Native communities', 'Schools serving Native students'],
      type: 'federal' as const,
    },
    {
      title: 'National Native American Boarding School Healing Coalition',
      description: 'Addresses the impacts of the boarding school era through education, truth-telling, and support for healing initiatives.',
      url: 'https://boardingschoolhealing.org',
      tags: ['healing', 'advocacy', 'historical trauma', 'education'],
      eligibility: ['Boarding school survivors', 'Descendants', 'Native communities'],
      type: 'federal' as const,
    },
    {
      title: 'Native Governance Center',
      description: 'Strengthens the capacity of Native nations to exercise effective governance through training, technical assistance, and resources.',
      url: 'https://nativegov.org',
      tags: ['governance', 'leadership', 'tribal sovereignty', 'capacity building'],
      eligibility: ['Tribal governments', 'Tribal leaders', 'Native nations'],
      type: 'federal' as const,
    },
    {
      title: 'Seventh Generation Fund for Indigenous Peoples',
      description: 'Promotes, protects, and sustains the uniqueness of Native peoples through capacity building, advocacy, and grantmaking.',
      url: 'https://www.7genfund.org',
      tags: ['environmental justice', 'cultural preservation', 'advocacy', 'grants'],
      eligibility: ['Indigenous communities', 'Grassroots organizations', 'Native activists'],
      type: 'federal' as const,
    },
    {
      title: 'National Urban Indian Family Coalition',
      description: 'Strengthens the health and well-being of urban Indian families through advocacy, training, and community development.',
      url: 'https://www.nuifc.org',
      tags: ['urban Indians', 'family services', 'advocacy', 'health'],
      eligibility: ['Urban Indian health organizations', 'Urban Native families'],
      type: 'federal' as const,
    },
    {
      title: 'Illuminative',
      description: 'Research and advocacy organization combating invisibility of Native peoples in media, data, and education.',
      url: 'https://illuminatives.org',
      tags: ['advocacy', 'representation', 'education', 'media'],
      eligibility: ['Native communities', 'Educators', 'Media professionals'],
      type: 'federal' as const,
    },
    {
      title: 'American Indian Science and Engineering Society (AISES)',
      description: 'Advances STEM education and careers for Indigenous peoples through scholarships, professional development, and networking.',
      url: 'https://www.aises.org',
      tags: ['STEM', 'education', 'scholarships', 'career development', 'professional networking'],
      eligibility: ['Native American students in STEM', 'STEM professionals', 'Educators'],
      type: 'federal' as const,
    },
    {
      title: 'Native Arts and Cultures Foundation',
      description: 'Promotes excellence and cultural sovereignty in Native arts through grants, advocacy, and public awareness.',
      url: 'https://www.nativeartsandcultures.org',
      tags: ['arts', 'cultural preservation', 'grants', 'artists'],
      eligibility: ['Native artists', 'Cultural organizations', 'Art programs'],
      type: 'federal' as const,
    },
    {
      title: 'National Council of Urban Indian Health',
      description: 'Advocates for quality, accessible healthcare for urban Indians through policy, training, and technical assistance.',
      url: 'https://www.ncuih.org',
      tags: ['health', 'urban Indians', 'healthcare access', 'advocacy'],
      eligibility: ['Urban Indian health programs', 'Urban Native communities'],
      type: 'federal' as const,
    },
    {
      title: 'Partnership With Native Americans',
      description: 'Provides immediate assistance to Native Americans on reservations through food, clothing, shelter improvements, and education support.',
      url: 'https://www.nativepartnership.org',
      tags: ['emergency assistance', 'food', 'housing', 'education', 'basic needs'],
      eligibility: ['Native Americans on reservations', 'Tribal communities in need'],
      type: 'federal' as const,
    },
    {
      title: 'Native Forward Scholars Fund (formerly AIEF)',
      description: 'Provides scholarships and student support services to American Indian students pursuing higher education.',
      url: 'https://www.nativescholarsfund.org',
      tags: ['scholarships', 'education', 'student support', 'mentorship'],
      eligibility: ['Native American students', 'Enrolled tribal members pursuing higher education'],
      type: 'federal' as const,
    },
    {
      title: 'Honor the Earth',
      description: 'Creates awareness and support for Native environmental issues and develops financial resources for Native environmental groups.',
      url: 'https://www.honorearth.org',
      tags: ['environmental justice', 'climate', 'renewable energy', 'advocacy'],
      eligibility: ['Native environmental organizations', 'Indigenous communities', 'Environmental activists'],
      type: 'federal' as const,
    },
    {
      title: 'NDN Collective',
      description: 'Builds Indigenous power through organizing, activism, philanthropy, grantmaking, and capacity-building support.',
      url: 'https://ndncollective.org',
      tags: ['advocacy', 'social justice', 'grantmaking', 'organizing', 'land back'],
      eligibility: ['Indigenous-led organizations', 'Native activists', 'Tribal communities'],
      type: 'federal' as const,
    },
    {
      title: 'National Indian Council on Aging (NICOA)',
      description: 'Advocates for improved, comprehensive health and social services for American Indian and Alaska Native elders.',
      url: 'https://www.nicoa.org',
      tags: ['elders', 'aging services', 'health', 'advocacy'],
      eligibility: ['Native American elders', 'Tribal aging programs', 'Elder caregivers'],
      type: 'federal' as const,
    },
    {
      title: 'Native Women\'s Society of the Great Plains',
      description: 'Promotes leadership development, cultural preservation, and advocacy for Native women and families.',
      url: 'https://www.nativewomenssociety.org',
      tags: ['women', 'leadership', 'advocacy', 'cultural preservation'],
      eligibility: ['Native women', 'Native families', 'Women leaders'],
      type: 'federal' as const,
    },
  ]

  // ========================================
  // STATE-LEVEL NONPROFITS
  // ========================================
  console.log('🏛️ Adding State-Level Nonprofit Organizations...')

  const stateNonprofits = [
    // CALIFORNIA
    {
      title: 'California Indian Legal Services (CILS)',
      description: 'Provides free civil legal services to Native Americans in California, focusing on Indian child welfare, housing, public benefits, and tribal governance.',
      url: 'https://www.calindian.org',
      tags: ['legal', 'advocacy', 'child welfare', 'housing'],
      eligibility: ['California Indians', 'Low-income Native Americans in California'],
      type: 'state' as const,
      state: 'CA',
    },
    {
      title: 'California Indian Museum and Cultural Center',
      description: 'Preserves and promotes California Indian cultures through education, exhibitions, and cultural programs.',
      url: 'https://www.cimcc.org',
      tags: ['cultural preservation', 'education', 'museum', 'history'],
      eligibility: ['Open to public', 'Special programs for Native communities'],
      type: 'state' as const,
      state: 'CA',
    },
    {
      title: 'Intertribal Friendship House',
      description: 'Oakland-based community center providing cultural, educational, and social services to urban Native Americans.',
      url: 'https://www.ifhurbanrez.org',
      tags: ['urban Indians', 'community services', 'cultural programming', 'youth programs'],
      eligibility: ['Urban Native Americans in Bay Area', 'Native families'],
      type: 'state' as const,
      state: 'CA',
    },

    // ARIZONA
    {
      title: 'Native Americans for Community Action (NACA)',
      description: 'Flagstaff organization providing housing, family services, education, and cultural programs to Native Americans.',
      url: 'https://www.nacaflagstaff.org',
      tags: ['housing', 'family services', 'education', 'cultural programming'],
      eligibility: ['Native Americans in Northern Arizona', 'Low-income families'],
      type: 'state' as const,
      state: 'AZ',
    },
    {
      title: 'Arizona Native American Legal Services',
      description: 'Provides free civil legal services to low-income Native Americans in Arizona.',
      url: 'https://www.DNA-Peoples.org',
      tags: ['legal', 'advocacy', 'civil rights', 'housing'],
      eligibility: ['Low-income Native Americans in Arizona'],
      type: 'state' as const,
      state: 'AZ',
    },

    // OKLAHOMA
    {
      title: 'Native American Advocacy Program (Oklahoma)',
      description: 'Provides legal advocacy and support services for Native American children and families in Oklahoma.',
      url: 'https://www.legalaidok.org/native-american-advocacy',
      tags: ['legal', 'advocacy', 'child welfare', 'family services'],
      eligibility: ['Native American families in Oklahoma', 'Low-income individuals'],
      type: 'state' as const,
      state: 'OK',
    },

    // NEW MEXICO
    {
      title: 'First Nations Community HealthSource',
      description: 'Provides comprehensive healthcare services to Native Americans and other underserved populations in Albuquerque.',
      url: 'https://www.fnch.org',
      tags: ['health', 'medical', 'dental', 'behavioral health'],
      eligibility: ['Native Americans', 'Low-income individuals in Albuquerque area'],
      type: 'state' as const,
      state: 'NM',
    },

    // WASHINGTON
    {
      title: 'Seattle Indian Health Board',
      description: 'Provides comprehensive healthcare, dental, and social services to urban Native Americans in the Seattle area.',
      url: 'https://www.sihb.org',
      tags: ['health', 'medical', 'dental', 'behavioral health', 'urban Indians'],
      eligibility: ['Native Americans in Seattle area', 'Alaska Natives'],
      type: 'state' as const,
      state: 'WA',
    },
    {
      title: 'United Indians of All Tribes Foundation',
      description: 'Seattle organization providing social services, cultural programs, and community development for urban Native Americans.',
      url: 'https://www.unitedindians.org',
      tags: ['social services', 'cultural programming', 'community development', 'urban Indians'],
      eligibility: ['Urban Native Americans in Seattle area'],
      type: 'state' as const,
      state: 'WA',
    },

    // OREGON
    {
      title: 'Native American Youth and Family Center (NAYA)',
      description: 'Portland-based organization providing education, cultural programming, and family services to urban Native youth and families.',
      url: 'https://www.nayapdx.org',
      tags: ['youth', 'education', 'family services', 'cultural programming', 'urban Indians'],
      eligibility: ['Native American youth and families in Portland area'],
      type: 'state' as const,
      state: 'OR',
    },
    {
      title: 'Native American Rehabilitation Association (NARA)',
      description: 'Provides substance abuse treatment, mental health services, and wellness programs for Native Americans in Oregon.',
      url: 'https://www.naranorthwest.org',
      tags: ['substance abuse', 'mental health', 'wellness', 'treatment'],
      eligibility: ['Native Americans struggling with substance abuse', 'Mental health needs'],
      type: 'state' as const,
      state: 'OR',
    },

    // MONTANA
    {
      title: 'Montana Indian Education Association',
      description: 'Promotes quality education for Native American students in Montana through advocacy, resources, and professional development.',
      url: 'https://www.mtiea.org',
      tags: ['education', 'advocacy', 'professional development', 'k-12'],
      eligibility: ['Montana Native students', 'Educators', 'Schools'],
      type: 'state' as const,
      state: 'MT',
    },

    // MINNESOTA
    {
      title: 'Minnesota Indian Women\'s Resource Center',
      description: 'Provides shelter, advocacy, and support services for Native American women and children experiencing violence.',
      url: 'https://www.miwrc.org',
      tags: ['domestic violence', 'shelter', 'advocacy', 'women', 'family services'],
      eligibility: ['Native American women', 'Children experiencing violence'],
      type: 'state' as const,
      state: 'MN',
    },
    {
      title: 'Division of Indian Work',
      description: 'Minneapolis-based organization providing housing, chemical health services, and family support to urban Native Americans.',
      url: 'https://www.diw-mn.org',
      tags: ['housing', 'substance abuse', 'family services', 'urban Indians'],
      eligibility: ['Urban Native Americans in Minneapolis area'],
      type: 'state' as const,
      state: 'MN',
    },
    {
      title: 'American Indian Community Housing Organization',
      description: 'Provides affordable housing and homeownership opportunities for Native American families in Minnesota.',
      url: 'https://www.aicho.org',
      tags: ['housing', 'homeownership', 'affordable housing'],
      eligibility: ['Native American families in Minnesota', 'Low-to-moderate income'],
      type: 'state' as const,
      state: 'MN',
    },

    // WISCONSIN
    {
      title: 'Indian Community School of Milwaukee',
      description: 'K-12 school integrating Native American culture and language into comprehensive education.',
      url: 'https://www.icsm.org',
      tags: ['education', 'k-12', 'cultural preservation', 'language'],
      eligibility: ['Native American students', 'Students interested in Native culture'],
      type: 'state' as const,
      state: 'WI',
    },

    // MICHIGAN
    {
      title: 'American Indian Health and Family Services',
      description: 'Detroit-based organization providing healthcare, dental care, and social services to urban Native Americans.',
      url: 'https://www.aihfs.org',
      tags: ['health', 'medical', 'dental', 'social services', 'urban Indians'],
      eligibility: ['Native Americans in Detroit area', 'Urban Indians'],
      type: 'state' as const,
      state: 'MI',
    },

    // ILLINOIS
    {
      title: 'American Indian Center of Chicago',
      description: 'One of the oldest urban Indian centers, providing cultural programming, social services, and community gathering space.',
      url: 'https://www.aicchicago.org',
      tags: ['cultural programming', 'social services', 'community center', 'urban Indians'],
      eligibility: ['Urban Native Americans in Chicago area'],
      type: 'state' as const,
      state: 'IL',
    },

    // NORTH CAROLINA
    {
      title: 'North Carolina Commission of Indian Affairs',
      description: 'State agency working with Native American communities to address needs in education, health, and economic development.',
      url: 'https://www.ncadmin.nc.gov/about-doa/north-carolina-commission-indian-affairs',
      tags: ['advocacy', 'education', 'health', 'economic development'],
      eligibility: ['North Carolina Native American communities'],
      type: 'state' as const,
      state: 'NC',
    },

    // ALASKA
    {
      title: 'Alaska Native Heritage Center',
      description: 'Cultural center and museum celebrating Alaska Native cultures through exhibits, performances, and educational programs.',
      url: 'https://www.alaskanative.net',
      tags: ['cultural preservation', 'museum', 'education', 'heritage'],
      eligibility: ['Open to public', 'Alaska Native cultural programming'],
      type: 'state' as const,
      state: 'AK',
    },
    {
      title: 'Cook Inlet Tribal Council',
      description: 'Provides comprehensive health and social services to Alaska Native and American Indian people in Anchorage.',
      url: 'https://www.citci.org',
      tags: ['health', 'social services', 'family services', 'urban Indians'],
      eligibility: ['Alaska Native', 'American Indian in Anchorage area'],
      type: 'state' as const,
      state: 'AK',
    },

    // SOUTH DAKOTA
    {
      title: 'Native American Community Board',
      description: 'Provides health education, nutrition programs, and advocacy for Native communities in South Dakota.',
      url: 'https://www.nativeshop.org',
      tags: ['health education', 'nutrition', 'advocacy', 'wellness'],
      eligibility: ['Native Americans in South Dakota', 'Tribal communities'],
      type: 'state' as const,
      state: 'SD',
    },

    // COLORADO
    {
      title: 'Denver Indian Family Resource Center',
      description: 'Provides family services, child welfare support, and cultural programming to urban Native families.',
      url: 'https://www.difrc.org',
      tags: ['family services', 'child welfare', 'cultural programming', 'urban Indians'],
      eligibility: ['Urban Native families in Denver area'],
      type: 'state' as const,
      state: 'CO',
    },

    // TEXAS
    {
      title: 'American Indians in Texas at the Spanish Colonial Missions',
      description: 'Preserves and promotes the history and culture of Texas Native peoples.',
      url: 'https://www.texasindians.com',
      tags: ['cultural preservation', 'history', 'education'],
      eligibility: ['Texas Native communities', 'General public'],
      type: 'state' as const,
      state: 'TX',
    },

    // NEW YORK
    {
      title: 'American Indian Community House',
      description: 'New York City organization providing social services, cultural programming, and advocacy for urban Native Americans.',
      url: 'https://www.aich.org',
      tags: ['social services', 'cultural programming', 'advocacy', 'urban Indians'],
      eligibility: ['Urban Native Americans in NYC area'],
      type: 'state' as const,
      state: 'NY',
    },

    // FLORIDA
    {
      title: 'Florida Governor\'s Council on Indian Affairs',
      description: 'State agency advocating for Florida\'s tribal communities and coordinating services.',
      url: 'https://www.flgcia.com',
      tags: ['advocacy', 'government services', 'tribal affairs'],
      eligibility: ['Florida tribal communities', 'Seminole and Miccosukee tribes'],
      type: 'state' as const,
      state: 'FL',
    },

    // NEVADA
    {
      title: 'Nevada Indian Commission',
      description: 'State agency serving Nevada\'s tribal communities through advocacy, resource coordination, and cultural preservation.',
      url: 'https://indiancommission.nv.gov',
      tags: ['advocacy', 'government services', 'cultural preservation'],
      eligibility: ['Nevada tribal members', 'Native communities'],
      type: 'state' as const,
      state: 'NV',
    },

    // UTAH
    {
      title: 'Utah Division of Indian Affairs',
      description: 'Promotes cooperation between state and tribal governments, provides advocacy and resources for Utah tribes.',
      url: 'https://dian.utah.gov',
      tags: ['advocacy', 'government services', 'tribal relations'],
      eligibility: ['Utah tribal members', 'Eight federally recognized tribes in Utah'],
      type: 'state' as const,
      state: 'UT',
    },

    // IDAHO
    {
      title: 'Idaho Commission on Indian Affairs',
      description: 'State commission working to improve relationships and services for Idaho\'s five federally recognized tribes.',
      url: 'https://www.idaho.gov/indian-affairs/',
      tags: ['advocacy', 'government services', 'tribal affairs'],
      eligibility: ['Idaho tribal communities', 'Five federally recognized tribes'],
      type: 'state' as const,
      state: 'ID',
    },

    // WYOMING
    {
      title: 'Wyoming Tribal Liaison Office',
      description: 'Facilitates communication and cooperation between state government and tribal nations.',
      url: 'https://tribalnations.wyo.gov',
      tags: ['advocacy', 'government services', 'tribal relations'],
      eligibility: ['Wyoming tribal members', 'Eastern Shoshone and Northern Arapaho tribes'],
      type: 'state' as const,
      state: 'WY',
    },

    // NEBRASKA
    {
      title: 'Nebraska Commission on Indian Affairs',
      description: 'Works to improve communication and relationships between state and tribal governments.',
      url: 'https://indianaffairs.nebraska.gov',
      tags: ['advocacy', 'government services', 'tribal affairs'],
      eligibility: ['Nebraska tribal communities', 'Four federally recognized tribes'],
      type: 'state' as const,
      state: 'NE',
    },

    // KANSAS
    {
      title: 'Kansas Office of Native American Affairs',
      description: 'State office coordinating services and advocacy for Kansas tribal nations.',
      url: 'https://onaa.ks.gov',
      tags: ['advocacy', 'government services', 'tribal affairs'],
      eligibility: ['Kansas tribal members', 'Four federally recognized tribes in Kansas'],
      type: 'state' as const,
      state: 'KS',
    },

    // LOUISIANA
    {
      title: 'Louisiana Office of Indian Affairs',
      description: 'Provides assistance and advocacy for Louisiana\'s tribal communities.',
      url: 'https://www.doa.la.gov/office-of-indian-affairs/',
      tags: ['advocacy', 'government services', 'tribal affairs'],
      eligibility: ['Louisiana tribal communities', 'State recognized tribes'],
      type: 'state' as const,
      state: 'LA',
    },

    // VIRGINIA
    {
      title: 'Virginia Council on Indians',
      description: 'State advisory council representing Virginia\'s Native American tribes and communities.',
      url: 'https://commonwealth.virginia.gov/native-american-tribes/',
      tags: ['advocacy', 'tribal affairs', 'cultural preservation'],
      eligibility: ['Virginia tribal members', 'Seven state-recognized tribes'],
      type: 'state' as const,
      state: 'VA',
    },

    // CONNECTICUT
    {
      title: 'Connecticut Indian Affairs Council',
      description: 'State agency advocating for Connecticut\'s Native American tribes and preserving indigenous culture.',
      url: 'https://portal.ct.gov/CIAC',
      tags: ['advocacy', 'cultural preservation', 'government services'],
      eligibility: ['Connecticut tribal members', 'Five state-recognized tribes'],
      type: 'state' as const,
      state: 'CT',
    },

    // RHODE ISLAND
    {
      title: 'Rhode Island Commission on Indian Affairs',
      description: 'Works to preserve indigenous culture and advocate for Native American communities in Rhode Island.',
      url: 'https://riincommission.org',
      tags: ['advocacy', 'cultural preservation', 'community services'],
      eligibility: ['Rhode Island tribal members', 'Native communities'],
      type: 'state' as const,
      state: 'RI',
    },

    // MAINE
    {
      title: 'Wabanaki Public Health and Wellness',
      description: 'Provides healthcare and wellness services to Maine\'s Wabanaki tribes.',
      url: 'https://wphw.org',
      tags: ['health', 'wellness', 'community services'],
      eligibility: ['Wabanaki tribal members', 'Maine Native communities'],
      type: 'state' as const,
      state: 'ME',
    },

    // INDIANA
    {
      title: 'Indiana Native American Indian Affairs Commission',
      description: 'State commission addressing needs and concerns of Indiana\'s Native American communities.',
      url: 'https://www.in.gov/naia/',
      tags: ['advocacy', 'government services', 'community support'],
      eligibility: ['Indiana Native American residents', 'Tribal communities'],
      type: 'state' as const,
      state: 'IN',
    },

    // IOWA
    {
      title: 'Sac and Fox Tribe of the Mississippi in Iowa - Community Services',
      description: 'Provides health, education, and social services to tribal members and community.',
      url: 'https://www.meskwaki.org',
      tags: ['health', 'education', 'social services', 'community support'],
      eligibility: ['Sac and Fox tribal members', 'Iowa Native communities'],
      type: 'state' as const,
      state: 'IA',
    },

    // GEORGIA
    {
      title: 'Georgia Council on American Indian Concerns',
      description: 'Advocates for Native American communities in Georgia and preserves indigenous heritage.',
      url: 'https://nativegeorgians.org',
      tags: ['advocacy', 'cultural preservation', 'heritage'],
      eligibility: ['Georgia Native American communities'],
      type: 'state' as const,
      state: 'GA',
    },

    // TENNESSEE
    {
      title: 'Tennessee Commission of Indian Affairs',
      description: 'State commission promoting awareness and addressing needs of Tennessee\'s Native American communities.',
      url: 'https://www.tn.gov/humanrights/commission-divisions/tennessee-commission-of-indian-affairs.html',
      tags: ['advocacy', 'government services', 'cultural awareness'],
      eligibility: ['Tennessee Native American communities'],
      type: 'state' as const,
      state: 'TN',
    },

    // ALABAMA
    {
      title: 'Alabama Indian Affairs Commission',
      description: 'Works to improve quality of life for Native Americans in Alabama through advocacy and resource coordination.',
      url: 'https://aiac.alabama.gov',
      tags: ['advocacy', 'government services', 'community support'],
      eligibility: ['Alabama Native American communities', 'State-recognized tribes'],
      type: 'state' as const,
      state: 'AL',
    },

    // MASSACHUSETTS
    {
      title: 'Massachusetts Commission on Indian Affairs',
      description: 'State agency serving Massachusetts Native American communities through advocacy and cultural preservation.',
      url: 'https://www.mass.gov/orgs/massachusetts-commission-on-indian-affairs',
      tags: ['advocacy', 'cultural preservation', 'government services'],
      eligibility: ['Massachusetts Native American residents', 'Tribal communities'],
      type: 'state' as const,
      state: 'MA',
    },

    // PENNSYLVANIA
    {
      title: 'Pennsylvania Commission on Native American Affairs',
      description: 'Advises state government on Native American issues and coordinates services for indigenous communities.',
      url: 'https://www.pconaac.org',
      tags: ['advocacy', 'government services', 'community coordination'],
      eligibility: ['Pennsylvania Native American communities'],
      type: 'state' as const,
      state: 'PA',
    },

    // OHIO
    {
      title: 'Ohio Commission on Native American Affairs',
      description: 'State commission addressing concerns of Ohio\'s Native American population.',
      url: 'https://development.ohio.gov/business/equal-opportunity-and-compliance/ohio-commission-on-native-american-affairs',
      tags: ['advocacy', 'government services', 'community support'],
      eligibility: ['Ohio Native American residents'],
      type: 'state' as const,
      state: 'OH',
    },
  ]

  // ========================================
  // INSERT DATA
  // ========================================
  const allNonprofits = [...nationalNonprofits, ...stateNonprofits]

  let nonprofitsAdded = 0
  for (const nonprofit of allNonprofits) {
    try {
      const existing = await prisma.resource.findFirst({
        where: { title: nonprofit.title },
      })

      if (!existing) {
        await prisma.resource.create({ data: nonprofit })
        nonprofitsAdded++
        console.log(`   ✅ Added: ${nonprofit.title}`)
      } else {
        console.log(`   ⏭️  Exists: ${nonprofit.title}`)
      }
    } catch (error) {
      console.log(`   ⚠️  Error with: ${nonprofit.title}`)
      console.error(error)
    }
  }

  // ========================================
  // FINAL REPORT
  // ========================================
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('✅ NONPROFIT ORGANIZATIONS ADDED!')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log(`📊 New Organizations Added: ${nonprofitsAdded}`)
  console.log(`   • National/Federal Nonprofits: ${nationalNonprofits.length}`)
  console.log(`   • State-Level Nonprofits: ${stateNonprofits.length}`)
  console.log(`   • Total in Script: ${allNonprofits.length}`)
  console.log('\n📊 Database Totals:')

  const totals = {
    resources: await prisma.resource.count({ where: { deletedAt: null } }),
    federal: await prisma.resource.count({
      where: { type: 'federal', deletedAt: null },
    }),
    state: await prisma.resource.count({
      where: { type: 'state', deletedAt: null },
    }),
  }

  console.log(`   • Total Resources: ${totals.resources}`)
  console.log(`   • Federal Resources: ${totals.federal}`)
  console.log(`   • State Resources: ${totals.state}`)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
}

addNonprofitOrganizations()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
