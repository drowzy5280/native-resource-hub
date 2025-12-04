import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ReactMarkdown from 'react-markdown'

type Props = {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug },
    select: {
      title: true,
      excerpt: true,
    },
  })

  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  return {
    title: `${post.title} | Tribal Resource Hub Blog`,
    description: post.excerpt,
  }
}

const categoryColors: Record<string, string> = {
  news: 'bg-pine/10 text-pine-dark border-pine/30',
  policy: 'bg-clay/10 text-clay-dark border-clay/30',
  deadline: 'bg-gold/10 text-gold-dark border-gold/30',
  community: 'bg-desert/20 text-text border-desert/40',
  updates: 'bg-stone/10 text-stone border-stone/30',
}

export default async function BlogPostPage({ params }: Props) {
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug },
  })

  if (!post || !post.published) {
    notFound()
  }

  // Fetch related posts by category
  const relatedPosts = await prisma.blogPost.findMany({
    where: {
      published: true,
      category: post.category,
      NOT: {
        id: post.id,
      },
    },
    take: 3,
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      category: true,
    },
    orderBy: {
      publishedAt: 'desc',
    },
  })

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm text-text-secondary">
        <Link href="/" className="hover:text-pine transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/blog" className="hover:text-pine transition-colors">Blog</Link>
        <span className="mx-2">/</span>
        <span className="text-text">{post.title}</span>
      </nav>

      {/* Header */}
      <article>
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className={`text-xs font-semibold px-3 py-1 rounded-full border capitalize ${categoryColors[post.category] || categoryColors.news}`}>
              {post.category}
            </span>
            {post.publishedAt && (
              <span className="text-sm text-text-muted">
                {new Date(post.publishedAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl font-heading font-bold text-text mb-4">
            {post.title}
          </h1>

          <p className="text-xl text-text-secondary leading-relaxed mb-6">
            {post.excerpt}
          </p>

          <div className="flex items-center gap-4 text-text-secondary text-sm">
            <span>By {post.author}</span>
          </div>
        </header>

        {/* Featured Image */}
        {post.imageUrl && (
          <div className="mb-12 rounded-earth-lg overflow-hidden">
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-auto"
            />
          </div>
        )}

        {/* Content */}
        <div className="prose prose-lg max-w-none prose-headings:font-heading prose-headings:text-text prose-p:text-text-secondary prose-a:text-pine prose-a:no-underline hover:prose-a:underline prose-strong:text-text prose-li:text-text-secondary">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-desert/40">
            <h3 className="text-sm font-semibold text-text mb-3">Tags:</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-desert/20 text-text-secondary text-sm rounded-earth border border-desert/40"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Share */}
        <div className="mt-8 pt-8 border-t border-desert/40">
          <h3 className="text-sm font-semibold text-text mb-4">Share this article:</h3>
          <div className="flex gap-3">
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')
                }
              }}
              className="px-4 py-2 bg-pine/10 text-pine rounded-earth hover:bg-pine/20 transition-colors font-medium"
            >
              Share on Facebook
            </button>
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}`, '_blank')
                }
              }}
              className="px-4 py-2 bg-clay/10 text-clay rounded-earth hover:bg-clay/20 transition-colors font-medium"
            >
              Share on Twitter
            </button>
            <button
              onClick={() => {
                if (typeof navigator !== 'undefined') {
                  navigator.clipboard.writeText(window.location.href)
                }
              }}
              className="px-4 py-2 bg-gold/10 text-gold-dark rounded-earth hover:bg-gold/20 transition-colors font-medium"
            >
              Copy Link
            </button>
          </div>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts && relatedPosts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-heading font-bold text-text mb-6">Related Articles</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {relatedPosts.map((related) => (
              <Link
                key={related.id}
                href={`/blog/${related.slug}`}
                className="group bg-white rounded-earth-lg p-6 border-2 border-desert/20 hover:border-pine/40 transition-all shadow-soft hover:shadow-soft-lg"
              >
                <span className={`text-xs font-semibold px-3 py-1 rounded-full border capitalize ${categoryColors[related.category] || categoryColors.news}`}>
                  {related.category}
                </span>
                <h3 className="text-lg font-heading font-bold text-text mt-3 mb-2 group-hover:text-pine transition-colors line-clamp-2">
                  {related.title}
                </h3>
                <p className="text-sm text-text-secondary line-clamp-3">
                  {related.excerpt}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Newsletter CTA */}
      <div className="mt-16 bg-gradient-to-br from-pine/10 via-cream to-gold/10 rounded-earth-lg p-8 border border-desert/20">
        <h2 className="text-2xl font-heading font-bold text-text mb-4">Stay Updated</h2>
        <p className="text-text-secondary mb-6">
          Subscribe to our newsletter to get the latest news, deadline reminders, and resource updates.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 max-w-md">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-4 py-3 rounded-earth border-2 border-desert/60 focus:border-pine focus:outline-none focus:ring-2 focus:ring-pine/20"
          />
          <button className="px-6 py-3 bg-pine text-white rounded-earth font-semibold hover:bg-pine-dark transition-colors">
            Subscribe
          </button>
        </div>
      </div>

      {/* Back to Blog */}
      <div className="mt-12 text-center">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-pine hover:text-pine-dark font-medium transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to All Posts
        </Link>
      </div>
    </div>
  )
}
