import { emailClient } from './client'
import { generateScholarshipDeadlineEmail } from './templates/scholarship-deadline'
import { generateWeeklyDigestEmail } from './templates/weekly-digest'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'

/**
 * Notification service for sending automated emails
 */

export class NotificationService {
  /**
   * Send scholarship deadline reminders
   * Called by cron job daily
   */
  async sendDeadlineReminders() {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Check for deadlines in 1, 3, and 7 days
    const reminderDays = [1, 3, 7]

    for (const days of reminderDays) {
      const targetDate = new Date(today)
      targetDate.setDate(targetDate.getDate() + days)
      targetDate.setHours(23, 59, 59, 999)

      try {
        // Find scholarships with deadlines matching target date
        const scholarships = await prisma.scholarship.findMany({
          where: {
            deletedAt: null,
            deadline: {
              gte: targetDate,
              lte: new Date(targetDate.getTime() + 24 * 60 * 60 * 1000),
            },
          },
        })

        for (const scholarship of scholarships) {
          // Find users who saved this scholarship
          // Note: Current schema only supports saving resources, not scholarships
          // This will need to be updated when scholarship saving is implemented
          const savedBy = await prisma.savedResource.findMany({
            where: {
              resourceId: scholarship.id,
            },
            include: {
              user: true,
            },
          })

          // Send reminders to each user
          for (const saved of savedBy) {
            if (!saved.user.email) continue

            const emailContent = generateScholarshipDeadlineEmail({
              userName: saved.user.email.split('@')[0],
              scholarshipName: scholarship.name,
              deadline: scholarship.deadline!,
              daysUntil: days,
              scholarshipUrl: `/scholarships/${scholarship.id}`,
              amount: scholarship.amount,
            })

            await emailClient.send({
              to: saved.user.email,
              subject: emailContent.subject,
              html: emailContent.html,
              text: emailContent.text,
            })

            logger.info('Sent deadline reminder', {
              userId: saved.user.id,
              scholarshipId: scholarship.id,
              daysUntil: days,
            })
          }
        }
      } catch (error) {
        logger.error('Failed to send deadline reminders', error as Error, {
          days,
        })
      }
    }
  }

  /**
   * Send weekly digest emails
   * Called by cron job weekly
   */
  async sendWeeklyDigests() {
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

    try {
      // Get new content from the past week
      const [newResources, newScholarships] = await Promise.all([
        prisma.resource.findMany({
          where: {
            deletedAt: null,
            createdAt: { gte: oneWeekAgo },
          },
          select: {
            id: true,
            title: true,
            type: true,
            description: true,
          },
          take: 10,
        }),
        prisma.scholarship.findMany({
          where: {
            deletedAt: null,
            createdAt: { gte: oneWeekAgo },
          },
          select: {
            id: true,
            name: true,
            amount: true,
            deadline: true,
          },
          take: 10,
        }),
      ])

      // Get upcoming deadlines for next 2 weeks
      const twoWeeksFromNow = new Date()
      twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() + 14)

      // Fetch scholarships with upcoming deadlines
      const upcomingScholarships = await prisma.scholarship.findMany({
        where: {
          deletedAt: null,
          deadline: {
            gte: new Date(),
            lte: twoWeeksFromNow,
          },
        },
        select: {
          id: true,
          name: true,
          amount: true,
          deadline: true,
        },
        orderBy: { deadline: 'asc' },
        take: 10,
      })

      // Get users who want weekly digests
      const users = await prisma.user.findMany({
        where: {
          deletedAt: null,
          // Add preference field in schema: weeklyDigest: true
          // For now, send to all users with email
          NOT: { email: '' },
        },
        select: {
          id: true,
          email: true,
          saved: {
            include: {
              resource: {
                select: {
                  id: true,
                  title: true,
                  type: true,
                },
              },
            },
          },
        },
      })

      for (const user of users) {
        if (!user.email) continue

        // Format upcoming deadlines for the email template
        // Filter out any without deadlines and ensure proper types
        const upcomingDeadlines = upcomingScholarships
          .filter((s): s is typeof s & { deadline: Date } => s.deadline !== null)
          .map((s) => ({
            id: s.id,
            name: s.name,
            deadline: s.deadline,
            daysUntil: Math.ceil((s.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
          }))

        const emailContent = generateWeeklyDigestEmail({
          userName: user.email.split('@')[0],
          newResources,
          newScholarships,
          upcomingDeadlines,
        })

        await emailClient.send({
          to: user.email,
          subject: emailContent.subject,
          html: emailContent.html,
          text: emailContent.text,
        })

        logger.info('Sent weekly digest', {
          userId: user.id,
        })
      }
    } catch (error) {
      logger.error('Failed to send weekly digests', error as Error)
    }
  }
}

export const notificationService = new NotificationService()
