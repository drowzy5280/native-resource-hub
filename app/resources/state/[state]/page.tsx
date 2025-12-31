import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { ResourceCard } from '@/components/ResourceCard'
import { ScholarshipCard } from '@/components/ScholarshipCard'
import { Breadcrumb } from '@/components/Breadcrumb'
import { SectionHeader } from '@/components/SectionHeader'
import { BreadcrumbSchema, CollectionPageSchema } from '@/components/StructuredData'

const stateNames: Record<string, string> = {
  alabama: 'Alabama',
  alaska: 'Alaska',
  arizona: 'Arizona',
  arkansas: 'Arkansas',
  california: 'California',
  colorado: 'Colorado',
  connecticut: 'Connecticut',
  delaware: 'Delaware',
  florida: 'Florida',
  georgia: 'Georgia',
  hawaii: 'Hawaii',
  idaho: 'Idaho',
  illinois: 'Illinois',
  indiana: 'Indiana',
  iowa: 'Iowa',
  kansas: 'Kansas',
  kentucky: 'Kentucky',
  louisiana: 'Louisiana',
  maine: 'Maine',
  maryland: 'Maryland',
  massachusetts: 'Massachusetts',
  michigan: 'Michigan',
  minnesota: 'Minnesota',
  mississippi: 'Mississippi',
  missouri: 'Missouri',
  montana: 'Montana',
  nebraska: 'Nebraska',
  nevada: 'Nevada',
  'new-hampshire': 'New Hampshire',
  'new-jersey': 'New Jersey',
  'new-mexico': 'New Mexico',
  'new-york': 'New York',
  'north-carolina': 'North Carolina',
  'north-dakota': 'North Dakota',
  ohio: 'Ohio',
  oklahoma: 'Oklahoma',
  oregon: 'Oregon',
  pennsylvania: 'Pennsylvania',
  'rhode-island': 'Rhode Island',
  'south-carolina': 'South Carolina',
  'south-dakota': 'South Dakota',
  tennessee: 'Tennessee',
  texas: 'Texas',
  utah: 'Utah',
  vermont: 'Vermont',
  virginia: 'Virginia',
  washington: 'Washington',
  'west-virginia': 'West Virginia',
  wisconsin: 'Wisconsin',
  wyoming: 'Wyoming',
}

const stateInfo: Record<string, { tribes: number; description: string }> = {
  oklahoma: { tribes: 39, description: 'Home to 39 federally recognized tribes, Oklahoma has the second-largest Native American population in the United States.' },
  california: { tribes: 109, description: 'California has the most federally recognized tribes in the United States, with over 100 distinct tribal nations.' },
  arizona: { tribes: 22, description: 'Arizona is home to 22 federally recognized tribes including the Navajo Nation, the largest reservation in the country.' },
  'new-mexico': { tribes: 23, description: 'New Mexico has 23 federally recognized tribes, including 19 Pueblos, 3 Apache tribes, and the Navajo Nation.' },
  alaska: { tribes: 229, description: 'Alaska has 229 federally recognized tribes, more than any other state, representing diverse Alaska Native cultures.' },
  washington: { tribes: 29, description: 'Washington State is home to 29 federally recognized tribes with rich Pacific Northwest traditions.' },
  montana: { tribes: 8, description: 'Montana has 8 federally recognized tribes, with reservations covering significant portions of the state.' },
  'south-dakota': { tribes: 9, description: 'South Dakota is home to 9 federally recognized tribes, including parts of the Great Sioux Nation.' },
  'north-dakota': { tribes: 5, description: 'North Dakota has 5 federally recognized tribes with strong cultural preservation efforts.' },
  minnesota: { tribes: 11, description: 'Minnesota is home to 11 federally recognized tribes, including 7 Anishinaabe and 4 Dakota communities.' },
}

interface Props {
  params: Promise<{ state: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state } = await params
  const stateName = stateNames[state.toLowerCase()]

  if (!stateName) {
    return { title: 'State Not Found' }
  }

  return {
    title: `Native American Resources in ${stateName} | Tribal Benefits & Programs`,
    description: `Find Native American resources, tribal benefits, scholarships, and programs available in ${stateName}. Access federal, state, and tribal assistance for Indigenous communities.`,
    keywords: [
      `${stateName} Native American resources`,
      `${stateName} tribal benefits`,
      `${stateName} Indian programs`,
      `${stateName} Native scholarships`,
      `${stateName} tribal assistance`,
    ],
    openGraph: {
      title: `Native American Resources in ${stateName}`,
      description: `Comprehensive guide to Native American resources and tribal benefits available in ${stateName}.`,
    },
  }
}

export async function generateStaticParams() {
  return Object.keys(stateNames).map((state) => ({ state }))
}

export default async function StateLandingPage({ params }: Props) {
  const { state } = await params
  const stateSlug = state.toLowerCase()
  const stateName = stateNames[stateSlug]

  if (!stateName) {
    notFound()
  }

  // Fetch resources and scholarships for this state
  const [resources, scholarships, tribes] = await Promise.all([
    prisma.resource.findMany({
      where: {
        deletedAt: null,
        state: { contains: stateName, mode: 'insensitive' },
      },
      orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
      take: 12,
    }),
    prisma.scholarship.findMany({
      where: {
        deletedAt: null,
        OR: [
          { eligibility: { has: stateName } },
          { tags: { has: stateName.toLowerCase() } },
        ],
      },
      orderBy: [{ featured: 'desc' }, { deadline: 'asc' }],
      take: 6,
    }),
    prisma.tribe.findMany({
      where: {
        deletedAt: null,
        region: { contains: stateName, mode: 'insensitive' },
      },
      orderBy: { name: 'asc' },
      take: 20,
    }),
  ])

  const info = stateInfo[stateSlug]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Resources', url: '/resources' },
          { name: stateName, url: `/resources/state/${stateSlug}` },
        ]}
      />
      <CollectionPageSchema
        name={`Native American Resources in ${stateName}`}
        description={`Find Native American resources, tribal benefits, and programs in ${stateName}`}
        url={`/resources/state/${stateSlug}`}
        itemCount={resources.length + scholarships.length}
      />

      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Resources', href: '/resources' },
          { label: stateName },
        ]}
      />

      {/* Hero Section */}
      <div className="mt-6 mb-12 bg-gradient-to-br from-pine/10 via-cream to-gold/5 rounded-earth-xl p-8 md:p-12 border border-desert/20">
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-text mb-4">
          Native American Resources in {stateName}
        </h1>
        {info && (
          <p className="text-lg text-text-secondary mb-6 max-w-3xl">
            {info.description}
          </p>
        )}
        <div className="flex flex-wrap gap-4">
          <div className="bg-white rounded-earth px-4 py-2 border border-desert/20">
            <span className="text-2xl font-bold text-pine">{resources.length}</span>
            <span className="text-text-secondary ml-2">Resources</span>
          </div>
          <div className="bg-white rounded-earth px-4 py-2 border border-desert/20">
            <span className="text-2xl font-bold text-gold">{scholarships.length}</span>
            <span className="text-text-secondary ml-2">Scholarships</span>
          </div>
          {tribes.length > 0 && (
            <div className="bg-white rounded-earth px-4 py-2 border border-desert/20">
              <span className="text-2xl font-bold text-clay">{tribes.length}</span>
              <span className="text-text-secondary ml-2">Tribes</span>
            </div>
          )}
        </div>
      </div>

      {/* Resources Section */}
      {resources.length > 0 && (
        <section className="mb-16">
          <SectionHeader
            title={`Resources in ${stateName}`}
            description={`Federal, state, and tribal programs available for Native Americans in ${stateName}`}
            actionLabel="View All"
            actionHref={`/resources?state=${encodeURIComponent(stateName)}`}
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource) => (
              <ResourceCard
                key={resource.id}
                id={resource.id}
                title={resource.title}
                description={resource.description}
                type={resource.type}
                tags={resource.tags}
                state={resource.state}
                url={resource.url}
              />
            ))}
          </div>
        </section>
      )}

      {/* Scholarships Section */}
      {scholarships.length > 0 && (
        <section className="mb-16">
          <SectionHeader
            title="Available Scholarships"
            description={`Educational scholarships for Native American students in ${stateName}`}
            actionLabel="View All"
            actionHref="/scholarships"
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {scholarships.map((scholarship) => (
              <ScholarshipCard
                key={scholarship.id}
                id={scholarship.id}
                name={scholarship.name}
                description={scholarship.description}
                amount={scholarship.amount}
                deadline={scholarship.deadline}
                tags={scholarship.tags}
                url={scholarship.url}
              />
            ))}
          </div>
        </section>
      )}

      {/* Tribes Section */}
      {tribes.length > 0 && (
        <section className="mb-16">
          <SectionHeader
            title={`Federally Recognized Tribes in ${stateName}`}
            description="Connect with tribal governments and organizations in your area"
            actionLabel="View All Tribes"
            actionHref="/tribes"
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {tribes.map((tribe) => (
              <Link
                key={tribe.id}
                href={`/tribes/${tribe.id}`}
                className="bg-white rounded-earth-lg p-4 border border-desert/20 hover:border-pine/50 hover:shadow-soft transition-all group"
              >
                <h3 className="font-heading font-semibold text-text group-hover:text-pine transition-colors line-clamp-2">
                  {tribe.name}
                </h3>
                {tribe.website && (
                  <p className="text-sm text-text-muted mt-1 truncate">
                    {new URL(tribe.website).hostname}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Related States */}
      <section>
        <SectionHeader
          title="Explore Other States"
          description="Find resources in neighboring states"
        />
        <div className="flex flex-wrap gap-2">
          {Object.entries(stateNames)
            .filter(([slug]) => slug !== stateSlug)
            .slice(0, 12)
            .map(([slug, name]) => (
              <Link
                key={slug}
                href={`/resources/state/${slug}`}
                className="px-4 py-2 bg-desert/30 hover:bg-desert/50 rounded-earth text-sm font-medium text-text-secondary hover:text-text transition-colors"
              >
                {name}
              </Link>
            ))}
          <Link
            href="/resources"
            className="px-4 py-2 bg-pine/10 hover:bg-pine/20 rounded-earth text-sm font-medium text-pine transition-colors"
          >
            View All States
          </Link>
        </div>
      </section>
    </div>
  )
}
