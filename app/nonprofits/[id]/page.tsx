import { notFound, redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'

// Nonprofits are just resources with specific tags, so redirect to the resource detail page
export default async function NonprofitDetailPage({
  params,
}: {
  params: { id: string }
}) {
  // Verify the resource exists
  const resource = await prisma.resource.findUnique({
    where: { id: params.id },
  })

  if (!resource) {
    notFound()
  }

  // Redirect to the resources detail page
  redirect(`/resources/${params.id}`)
}
