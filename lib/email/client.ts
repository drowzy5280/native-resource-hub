import { Resend } from 'resend'

/**
 * Email client for sending notifications
 */

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM_EMAIL = process.env.FROM_EMAIL || 'Native Resource Hub <noreply@native-resource-hub.com>'

export interface EmailOptions {
  to: string | string[]
  subject: string
  html: string
  text?: string
}

export class EmailClient {
  async send(options: EmailOptions) {
    try {
      const { data, error } = await resend.emails.send({
        from: FROM_EMAIL,
        to: Array.isArray(options.to) ? options.to : [options.to],
        subject: options.subject,
        html: options.html,
        ...(options.text && { text: options.text }),
      })

      if (error) {
        throw error
      }

      return { success: true, data }
    } catch (error) {
      console.error('Email send failed:', error)
      return { success: false, error }
    }
  }

  async sendBatch(emails: EmailOptions[]) {
    try {
      const results = await Promise.allSettled(
        emails.map((email) => this.send(email))
      )

      const successful = results.filter((r) => r.status === 'fulfilled').length
      const failed = results.filter((r) => r.status === 'rejected').length

      return {
        success: failed === 0,
        total: emails.length,
        successful,
        failed,
      }
    } catch (error) {
      console.error('Batch email send failed:', error)
      return { success: false, error }
    }
  }
}

export const emailClient = new EmailClient()
