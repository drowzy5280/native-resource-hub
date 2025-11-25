import { PrismaClient } from '@prisma/client'
import { createClient } from '@supabase/supabase-js'

const prisma = new PrismaClient()

async function makeAdmin() {
  const email = process.argv[2]

  if (!email) {
    console.error('❌ Please provide an email address')
    console.log('Usage: tsx scripts/make-admin.ts your-email@example.com')
    process.exit(1)
  }

  try {
    // Initialize Supabase client to get auth user ID
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Get all users from Supabase auth
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers()

    if (authError) {
      console.error('❌ Error fetching auth users:', authError)
      process.exit(1)
    }

    // Find user by email in Supabase auth
    const authUser = authUsers.users.find(u => u.email === email)

    if (!authUser) {
      console.error(`❌ No authenticated user found with email: ${email}`)
      console.log('Make sure you have signed up with this email address first.')
      process.exit(1)
    }

    console.log(`Found auth user: ${authUser.email} (ID: ${authUser.id})`)

    // Create or update user in database
    const user = await prisma.user.upsert({
      where: { id: authUser.id },
      update: { role: 'admin' },
      create: {
        id: authUser.id,
        email: authUser.email!,
        role: 'admin',
      },
    })

    console.log(`✅ Successfully made ${email} an admin!`)
    console.log('You can now access the admin dashboard at: http://localhost:3000/admin')
    console.log('Make sure to refresh your browser!')
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

makeAdmin()
