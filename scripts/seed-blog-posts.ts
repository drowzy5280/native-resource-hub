import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const sampleBlogPosts = [
  {
    slug: 'new-scholarship-opportunities-2026',
    title: 'New Scholarship Opportunities for Native Students in 2026',
    excerpt: 'Discover the latest scholarship programs specifically designed for Native American students, including STEM-focused awards and tribal-specific opportunities.',
    content: `# New Scholarship Opportunities for Native Students in 2026

We're excited to announce several new scholarship programs that have opened for the 2026 academic year. These opportunities represent over $5 million in available funding for Native American students pursuing higher education.

## STEM Excellence Scholarship Program

The newly launched STEM Excellence Scholarship Program is offering up to $15,000 per year for Native American students pursuing degrees in Science, Technology, Engineering, and Mathematics fields. This renewable scholarship covers:

- Full tuition assistance
- Book stipends
- Research opportunities
- Mentorship programs

**Deadline:** March 15, 2026

## Tribal Leadership Initiative

Five major tribes have partnered to create the Tribal Leadership Initiative, providing $10,000 scholarships to students interested in public service, tribal governance, and community development.

**Key Features:**
- Renewable for up to 4 years
- Summer internship opportunities
- Leadership training workshops
- Networking with tribal leaders

**Deadline:** April 1, 2026

## How to Apply

Visit our scholarships page to find detailed application requirements and links to apply. Remember to start your applications early and gather all required documents, including:

- Tribal enrollment verification
- Letters of recommendation
- Academic transcripts
- Personal statement

Don't miss these incredible opportunities to fund your education and build connections with other Native scholars!`,
    category: 'news',
    tags: ['scholarships', 'education', 'STEM', 'opportunities'],
    author: 'Sarah Johnson',
    imageUrl: null,
    published: true,
    featured: true,
    publishedAt: new Date('2025-12-01'),
  },
  {
    slug: 'understanding-federal-funding-changes',
    title: 'Important Changes to Federal Funding for Tribal Programs',
    excerpt: 'Learn about recent policy updates affecting Native American programs and how they impact available resources and benefits.',
    content: `# Important Changes to Federal Funding for Tribal Programs

The Bureau of Indian Affairs announced significant updates to federal funding allocations that will affect several programs serving Native American communities. Here's what you need to know.

## Increased Funding for Education Programs

Good news! The Indian Education Programs will see a 15% increase in funding for the 2026 fiscal year. This includes:

- Higher Education Grants
- Tribal Colleges and Universities Support
- K-12 Native Language Programs
- Career and Technical Education

## Healthcare Expansion

The Indian Health Service (IHS) will expand its coverage to include:

- Mental health services
- Substance abuse treatment
- Telehealth programs in rural areas
- Traditional healing practices

## Housing Assistance Updates

New eligibility requirements for housing assistance programs take effect January 1, 2026. Make sure to review the updated criteria if you're planning to apply.

## What You Should Do

1. Review your current benefits to see if you're affected
2. Update your contact information with relevant agencies
3. Check new eligibility requirements
4. Apply for newly available programs

Visit our resources page for detailed information about each program and how to apply.`,
    category: 'policy',
    tags: ['federal-funding', 'policy', 'programs', 'updates'],
    author: 'Michael Running Bear',
    imageUrl: null,
    published: true,
    featured: true,
    publishedAt: new Date('2025-11-28'),
  },
  {
    slug: 'upcoming-scholarship-deadlines-january',
    title: "Don't Miss These Scholarship Deadlines in January 2026",
    excerpt: "Mark your calendars! Important scholarship deadlines are approaching for Native American students. Here's your complete January deadline checklist.",
    content: `# Don't Miss These Scholarship Deadlines in January 2026

January is a critical month for scholarship applications. Several major scholarships have deadlines coming up, and we want to make sure you don't miss out!

## January 15, 2026
- **American Indian College Fund General Scholarship**
  - Award: $2,000 - $5,000
  - For: All undergraduate students
  - Requirements: 2.0 GPA, tribal enrollment

- **Native American Leadership in Education (NALE)**
  - Award: $5,000
  - For: Students pursuing education degrees
  - Requirements: 3.0 GPA, commitment to teaching

## January 31, 2026
- **AISES Scholarship Program**
  - Award: $1,000 - $10,000
  - For: STEM majors
  - Requirements: AISES membership, 3.0 GPA

- **Tribal Business Management Scholarship**
  - Award: $7,500
  - For: Business and economics majors
  - Requirements: Tribal enrollment, 2.5 GPA

## Application Tips

1. **Start Early**: Don't wait until the last day!
2. **Gather Documents**: Have your transcripts and enrollment certificate ready
3. **Strong Essays**: Take time to write compelling personal statements
4. **Letters of Recommendation**: Ask professors/mentors at least 2 weeks in advance
5. **Proofread**: Have someone review your application before submitting

## Need Help?

Check out our comprehensive guide on "First-Time Applying for Tribal Benefits" for step-by-step instructions on completing scholarship applications.

Good luck!`,
    category: 'deadline',
    tags: ['scholarships', 'deadlines', 'January', 'applications'],
    author: 'Lisa Whitehorse',
    imageUrl: null,
    published: true,
    featured: false,
    publishedAt: new Date('2025-12-03'),
  },
  {
    slug: 'success-story-engineering-graduate',
    title: "From Small Town to Silicon Valley: A Native Engineer's Journey",
    excerpt: 'Read how David Martinez used tribal resources and scholarships to become a software engineer at a leading tech company.',
    content: `# From Small Town to Silicon Valley: A Native Engineer's Journey

**Community Spotlight**

David Martinez grew up on a small reservation in New Mexico with limited access to technology and educational resources. Today, he's a successful software engineer at a major Silicon Valley tech company. Here's his inspiring story.

## Early Challenges

"Growing up, I didn't even have reliable internet access," David recalls. "The idea of becoming a software engineer seemed impossible."

## Discovering Resources

Everything changed when David's high school counselor told him about scholarships and resources available specifically for Native American students interested in STEM.

## The Path to Success

David's journey included:

1. **Securing Funding**: Applied for and received multiple scholarships
2. **Community College Start**: Began at local tribal college
3. **University Transfer**: Transferred to state university with full scholarship
4. **Internships**: Participated in Native American tech internship programs
5. **Networking**: Connected with other Native professionals in tech

## Resources That Helped

- American Indian Science and Engineering Society (AISES)
- Tribal College scholarship
- Google CS Summer Institute
- Local tribal education grants

## Giving Back

Now, David mentors Native students interested in technology and has created a coding workshop program on his home reservation.

## His Advice

"Don't let your circumstances define your future. The resources are out there - you just need to find them and be willing to work hard. And once you succeed, remember to lift others up with you."

**Want to share your success story?** Contact us at stories@tribalresourcehub.com`,
    category: 'community',
    tags: ['success-story', 'STEM', 'inspiration', 'careers'],
    author: 'Jennifer Blackbear',
    imageUrl: null,
    published: true,
    featured: false,
    publishedAt: new Date('2025-11-25'),
  },
  {
    slug: 'tribal-cdfi-grant-program-expansion',
    title: 'Tribal CDFI Grant Program Expands to Support Small Businesses',
    excerpt: 'The Native American CDFI Assistance Program announces $50 million in new grants to support tribal small business development.',
    content: `# Tribal CDFI Grant Program Expands to Support Small Businesses

The U.S. Treasury Department announced a major expansion of the Native American Community Development Financial Institution (CDFI) Assistance Program, allocating $50 million in new grants.

## What is the CDFI Program?

CDFIs provide financial services in underserved communities, including:

- Small business loans
- Microenterprise development
- Financial literacy training
- Technical assistance

## New Expansion Details

### Increased Funding
- $50 million in new allocations
- Focus on rural and remote tribal communities
- Support for renewable energy projects
- Tourism and hospitality sector development

### Eligibility
To qualify for CDFI assistance:
- Must be located in or serve tribal communities
- Provide financial products/services
- Serve low-income populations
- Have majority Native board representation

## Application Process

Applications will open February 1, 2026. Eligible organizations should:

1. Review program requirements
2. Gather financial documentation
3. Develop community impact plan
4. Submit application by April 30, 2026

## Success Stories

Several tribal CDFIs have already made significant impact:

- **Lakota Funds**: Supported 200+ small businesses
- **Four Bands Community Fund**: $5M in small business loans
- **Oweesta Corporation**: Training for 50+ new tribal CDFIs

## Get Involved

If you're interested in starting a business or accessing capital:
- Contact your tribal economic development office
- Connect with regional Native CDFIs
- Attend upcoming webinars on tribal entrepreneurship

Visit our resources page for a complete directory of tribal CDFIs and small business assistance programs.`,
    category: 'news',
    tags: ['business', 'grants', 'economic-development', 'CDFIs'],
    author: 'Robert Standing Elk',
    imageUrl: null,
    published: true,
    featured: false,
    publishedAt: new Date('2025-11-20'),
  },
]

async function main() {
  console.log('Seeding blog posts...')

  for (const post of sampleBlogPosts) {
    const created = await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: post,
      create: post,
    })
    console.log(`Created/Updated blog post: ${created.title}`)
  }

  console.log('✅ Blog posts seeded successfully!')
}

main()
  .catch((e) => {
    console.error('Error seeding blog posts:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
