import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

type Props = {
  params: { slug: string }
}

// Story data - in a real app, this would come from a database
const stories: Record<string, {
  name: string
  tribe: string
  location: string
  title: string
  excerpt: string
  category: string
  content: string
}> = {
  'maria-education-success': {
    name: 'Maria T.',
    tribe: 'Navajo Nation',
    location: 'Arizona',
    title: 'From First-Generation College Student to Graduate School',
    excerpt: 'How tribal scholarships and support programs helped me become the first in my family to earn a graduate degree.',
    category: 'scholarship',
    content: `Growing up on the Navajo reservation in Arizona, I never imagined I would one day hold a master's degree. My parents worked hard but never had the opportunity to attend college themselves. When I was in high school, a counselor told me about scholarships specifically for Native American students, and that conversation changed my life.

## Finding the Right Resources

I started by researching scholarships through the American Indian College Fund and discovered the Gates Millennium Scholars Program. The application process was intimidating at first—essays, letters of recommendation, transcripts—but my school counselor and tribal education office helped me through every step.

When I received the Gates Millennium Scholarship, covering my full undergraduate tuition, my family and I cried together. It wasn't just about the money; it was validation that my dreams were possible.

## Navigating College as a First-Generation Student

College wasn't easy. There were times I felt out of place, especially at a large university where few students shared my background. But I found my community through the Native American student organization on campus and the McNair Scholars Program, which prepared me for graduate school.

## Key Resources That Helped Me

- **Gates Millennium Scholars Program**: Covered full tuition for undergraduate and graduate school
- **American Indian College Fund**: Provided supplemental scholarships and networking opportunities
- **Tribal Higher Education Grant**: My tribe provided additional funding for books and living expenses
- **McNair Scholars Program**: Prepared me for graduate research and applications

## Graduate School and Beyond

With my undergraduate degree completed debt-free, I was able to pursue a master's degree in public health with a focus on Native American health disparities. Today, I work for a tribal health organization, helping to improve healthcare access in my community.

## Advice for Others

1. **Start early**: Begin researching scholarships in your junior year of high school
2. **Ask for help**: Tribal education offices exist to support you—use them!
3. **Apply to everything**: Don't self-select out of opportunities
4. **Find your community**: Connect with other Native students for support
5. **Give back**: Once you succeed, help others on the same path

My education journey showed me that the resources exist—we just need to know where to find them and have the courage to apply.`
  },
  'james-business-grant': {
    name: 'James W.',
    tribe: 'Cherokee Nation',
    location: 'Oklahoma',
    title: 'Building My Dream: Starting a Native-Owned Business',
    excerpt: 'The journey from idea to reality with support from SBA 8(a) and tribal business development programs.',
    category: 'business',
    content: `For years, I dreamed of starting my own construction company. Working in the industry for over a decade, I knew the business inside and out, but the capital requirements and bureaucratic hurdles seemed insurmountable. That changed when I learned about the SBA 8(a) Business Development Program and tribal business resources.

## Discovering the 8(a) Program

A fellow tribal member who ran a successful IT company told me about the SBA 8(a) program, which helps small businesses owned by socially and economically disadvantaged individuals compete for federal contracts. As an enrolled Cherokee Nation member, I qualified to apply.

## The Application Process

I won't sugarcoat it—the 8(a) application was extensive. It took me about six months to complete, with help from:

- **Cherokee Nation Small Business Assistance**: They provided free consulting and helped me prepare my business plan
- **SBA Oklahoma District Office**: Walked me through the requirements
- **SCORE mentors**: Retired business executives who reviewed my financials

## Getting Certified

When my 8(a) certification came through, doors started opening. The certification gave my company:
- Access to sole-source federal contracts up to $4 million
- Set-aside contracts specifically for 8(a) businesses
- Mentoring from established companies through the mentor-protégé program

## Tribal Business Support

Beyond the 8(a) program, the Cherokee Nation provided additional resources:
- **Business Development Grant**: $10,000 to help with startup costs
- **Equipment financing**: Low-interest loan for construction equipment
- **Networking**: Connections with other Native-owned businesses

## Where We Are Today

Three years after certification, my construction company employs 15 people—mostly from our tribal community. We've completed over $5 million in federal contracts and recently won our first competitive contract outside the 8(a) program.

## Advice for Aspiring Native Business Owners

1. **Contact your tribal business development office first**: They know the resources available
2. **Consider the 8(a) program**: It's work to get certified, but the benefits are substantial
3. **Get help with your business plan**: A solid plan is essential
4. **Network with other Native business owners**: Learn from their experiences
5. **Be patient but persistent**: Building a business takes time

The resources exist to help Native entrepreneurs succeed. It takes effort to access them, but the investment is worth it.`
  },
  'sarah-housing-assistance': {
    name: 'Sarah M.',
    tribe: 'Lakota',
    location: 'South Dakota',
    title: 'Finding Home: How HUD Native American Programs Changed Our Lives',
    excerpt: 'After years of rental instability, our family finally achieved homeownership through NAHASDA programs.',
    category: 'housing',
    content: `For years, my family moved from rental to rental, never quite feeling stable. With three children and a modest income, homeownership seemed like an impossible dream on the Pine Ridge Reservation. Then I learned about the NAHASDA programs through our tribal housing authority.

## Our Housing Situation

Like many families on the reservation, we faced significant housing challenges. Rentals were scarce, often in poor condition, and with three kids, we were constantly worried about the next move. I wanted my children to have the stability of a home they could grow up in.

## Discovering NAHASDA

NAHASDA (Native American Housing Assistance and Self-Determination Act) provides block grants to tribes for housing activities. Our tribe, the Oglala Sioux, uses these funds for several programs:

- Low-rent housing units
- Homeownership programs
- Home rehabilitation
- Down payment assistance

## The Application Process

I visited our tribal housing authority and learned about their homeownership program. The requirements included:
- Proof of tribal enrollment
- Income verification
- Completion of homebuyer education classes
- Clean background check
- Stable employment

The homebuyer education classes were actually helpful—they taught us about budgeting, mortgages, and home maintenance.

## Getting Approved

After several months, we were approved for the program. The tribe helped us with:
- **Down payment assistance**: A grant covering most of our down payment
- **Below-market interest rate**: Through the Section 184 Indian Home Loan Guarantee Program
- **New construction**: Our home was built specifically for our family

## Moving Into Our Home

The day we got our keys was the happiest day of my life. My kids each have their own room. We have a yard. We're building equity instead of paying rent to someone else. Most importantly, we have stability.

## Advice for Others

1. **Contact your tribal housing authority**: They're the gateway to all these programs
2. **Be patient**: Waitlists can be long, but stay on them
3. **Complete all requirements**: Homebuyer education and other requirements help you succeed
4. **Explore all options**: NAHASDA, Section 184 loans, and down payment assistance can work together
5. **Maintain good credit**: Start working on your credit now

Homeownership on the reservation is possible. The programs exist—you just need to take that first step.`
  },
  'robert-healthcare-journey': {
    name: 'Robert K.',
    tribe: 'Choctaw Nation',
    location: 'Mississippi',
    title: 'Accessing Quality Healthcare Through IHS',
    excerpt: 'My experience navigating the Indian Health Service system and finding comprehensive care for my family.',
    category: 'healthcare',
    content: `When I was diagnosed with Type 2 diabetes, I was overwhelmed. I didn't have employer-sponsored health insurance, and the costs of managing diabetes seemed astronomical. That's when I learned I could access care through the Indian Health Service as an enrolled Choctaw member.

## Understanding My Eligibility

As a member of the Choctaw Nation of Oklahoma, I was eligible for IHS services even though I lived in Mississippi, away from my tribal headquarters. I discovered that IHS operates facilities across the country and has agreements with other providers through the Purchased/Referred Care program.

## Finding Care

Since there's no IHS facility in my immediate area, I connected with care through:
- **Purchased/Referred Care (PRC)**: IHS approved referrals to local providers
- **Tribal health clinic**: The Mississippi Band of Choctaw Indians allowed me to use their clinic for some services
- **Telehealth**: Virtual appointments with IHS providers

## Managing My Diabetes

Through IHS, I've received:
- Regular appointments with a primary care provider
- Diabetes education classes
- Nutritional counseling
- All my medications at no cost
- Laboratory work and monitoring
- Eye exams (diabetes affects vision)

The comprehensive nature of the care surprised me. It wasn't just about treating symptoms—they focused on prevention and education.

## The Process

Here's how I accessed care:

1. **Verified eligibility**: Confirmed my tribal enrollment
2. **Contacted the nearest IHS or tribal facility**: They explained my options
3. **Got registered in the system**: Completed intake paperwork
4. **Established care**: Scheduled my first appointment
5. **Applied for PRC**: For services not available at the tribal clinic

## Tips I've Learned

- **Bring your tribal enrollment card**: You'll need it for registration
- **Understand PRC rules**: Get approval BEFORE seeking outside care
- **Be proactive**: Schedule appointments in advance
- **Use the patient portal**: Many facilities have online scheduling and records
- **Ask about all services**: Many facilities offer dental, behavioral health, and specialty care

## The Difference It's Made

My diabetes is now well-controlled. I've lost 30 pounds through the lifestyle changes they taught me. My A1C levels are in the normal range. Best of all, I'm not drowning in medical debt—something that seemed inevitable when I was first diagnosed.

## For Others Who Need Care

Don't assume IHS isn't an option because you don't live near a facility. Between PRC, urban Indian health programs, and tribal health clinics of other tribes, there are more options than you might think. Your first step should be contacting IHS or your tribe's health department to understand what's available to you.`
  },
}

const categoryColors: Record<string, string> = {
  scholarship: 'bg-pine/10 text-pine border-pine/30',
  business: 'bg-gold/10 text-gold-dark border-gold/30',
  housing: 'bg-clay/10 text-clay-dark border-clay/30',
  healthcare: 'bg-stone/10 text-stone border-stone/30',
  general: 'bg-desert/10 text-text border-desert/30',
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const story = stories[params.slug]

  if (!story) {
    return {
      title: 'Story Not Found',
    }
  }

  return {
    title: `${story.title} | Success Stories | Tribal Resource Hub`,
    description: story.excerpt,
  }
}

export default function StoryPage({ params }: Props) {
  const story = stories[params.slug]

  if (!story) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm text-text-secondary">
        <Link href="/" className="hover:text-pine transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/stories" className="hover:text-pine transition-colors">Success Stories</Link>
        <span className="mx-2">/</span>
        <span className="text-text">{story.name}'s Story</span>
      </nav>

      {/* Header */}
      <article>
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className={`text-xs font-semibold px-3 py-1 rounded-full border capitalize ${categoryColors[story.category] || categoryColors.general}`}>
              {story.category}
            </span>
            <span className="text-sm text-text-muted">{story.location}</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-heading font-bold text-text mb-4">
            {story.title}
          </h1>

          <p className="text-xl text-text-secondary leading-relaxed mb-6">
            {story.excerpt}
          </p>

          <div className="flex items-center gap-4 text-text-secondary">
            <div className="w-12 h-12 bg-gradient-to-br from-pine/20 to-gold/20 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-pine" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-text">{story.name}</p>
              <p className="text-sm text-text-muted">{story.tribe}</p>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="prose prose-lg max-w-none prose-headings:font-heading prose-headings:text-text prose-p:text-text-secondary prose-a:text-pine prose-a:no-underline hover:prose-a:underline prose-strong:text-text prose-li:text-text-secondary">
          {story.content.split('\n\n').map((paragraph, index) => {
            if (paragraph.startsWith('## ')) {
              return (
                <h2 key={index} className="text-2xl font-heading font-bold text-text mt-8 mb-4">
                  {paragraph.replace('## ', '')}
                </h2>
              )
            }
            if (paragraph.startsWith('- **')) {
              const items = paragraph.split('\n').filter(line => line.startsWith('- '))
              return (
                <ul key={index} className="list-disc pl-6 space-y-2 mb-6">
                  {items.map((item, i) => {
                    const match = item.match(/- \*\*(.+?)\*\*: (.+)/)
                    if (match) {
                      return (
                        <li key={i}>
                          <strong className="text-text">{match[1]}:</strong> {match[2]}
                        </li>
                      )
                    }
                    return <li key={i}>{item.replace('- ', '')}</li>
                  })}
                </ul>
              )
            }
            if (paragraph.match(/^\d+\. /)) {
              const items = paragraph.split('\n').filter(line => line.match(/^\d+\. /))
              return (
                <ol key={index} className="list-decimal pl-6 space-y-2 mb-6">
                  {items.map((item, i) => (
                    <li key={i}>{item.replace(/^\d+\. /, '').replace(/\*\*(.+?)\*\*/g, '$1')}</li>
                  ))}
                </ol>
              )
            }
            return (
              <p key={index} className="text-text-secondary leading-relaxed mb-6">
                {paragraph}
              </p>
            )
          })}
        </div>

        {/* Share */}
        <div className="mt-12 pt-8 border-t border-desert/40">
          <h3 className="text-sm font-semibold text-text mb-4">Share this story:</h3>
          <div className="flex flex-wrap gap-3">
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=https://tribalresourcehub.com/stories/${params.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-pine/10 text-pine rounded-earth hover:bg-pine/20 transition-colors font-medium"
            >
              Share on Facebook
            </a>
            <a
              href={`https://twitter.com/intent/tweet?url=https://tribalresourcehub.com/stories/${params.slug}&text=${encodeURIComponent(story.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-clay/10 text-clay rounded-earth hover:bg-clay/20 transition-colors font-medium"
            >
              Share on Twitter
            </a>
            <a
              href={`mailto:?subject=${encodeURIComponent(story.title)}&body=Check out this inspiring story: https://tribalresourcehub.com/stories/${params.slug}`}
              className="px-4 py-2 bg-gold/10 text-gold-dark rounded-earth hover:bg-gold/20 transition-colors font-medium"
            >
              Share via Email
            </a>
          </div>
        </div>
      </article>

      {/* CTA */}
      <div className="mt-16 bg-gradient-to-br from-pine/10 via-cream to-gold/10 rounded-earth-lg p-8 border border-desert/20">
        <h2 className="text-2xl font-heading font-bold text-text mb-4">Inspired by This Story?</h2>
        <p className="text-text-secondary mb-6">
          Explore resources that can help you on your own journey.
        </p>
        <div className="flex flex-wrap gap-4">
          {story.category === 'scholarship' && (
            <Link
              href="/scholarships"
              className="px-6 py-3 bg-pine text-white rounded-earth-lg font-semibold hover:bg-pine-dark transition-colors"
            >
              Browse Scholarships
            </Link>
          )}
          {story.category === 'business' && (
            <Link
              href="/resources?category=business"
              className="px-6 py-3 bg-pine text-white rounded-earth-lg font-semibold hover:bg-pine-dark transition-colors"
            >
              Business Resources
            </Link>
          )}
          {story.category === 'housing' && (
            <Link
              href="/resources?category=housing"
              className="px-6 py-3 bg-pine text-white rounded-earth-lg font-semibold hover:bg-pine-dark transition-colors"
            >
              Housing Resources
            </Link>
          )}
          {story.category === 'healthcare' && (
            <Link
              href="/resources?category=health"
              className="px-6 py-3 bg-pine text-white rounded-earth-lg font-semibold hover:bg-pine-dark transition-colors"
            >
              Health Resources
            </Link>
          )}
          <Link
            href="/guides"
            className="px-6 py-3 bg-white text-pine border-2 border-pine rounded-earth-lg font-semibold hover:bg-pine/5 transition-colors"
          >
            Read Our Guides
          </Link>
        </div>
      </div>

      {/* Back to Stories */}
      <div className="mt-12 text-center">
        <Link
          href="/stories"
          className="inline-flex items-center gap-2 text-pine hover:text-pine-dark font-medium transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to All Stories
        </Link>
      </div>
    </div>
  )
}
