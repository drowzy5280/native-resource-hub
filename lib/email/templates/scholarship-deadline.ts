/**
 * Email template for scholarship deadline reminders
 */

interface ScholarshipDeadlineEmailProps {
  userName: string
  scholarshipName: string
  deadline: Date
  daysUntil: number
  scholarshipUrl: string
  amount?: string | null
}

export function generateScholarshipDeadlineEmail({
  userName,
  scholarshipName,
  deadline,
  daysUntil,
  scholarshipUrl,
  amount,
}: ScholarshipDeadlineEmailProps): { subject: string; html: string; text: string } {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const deadlineFormatted = deadline.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const urgencyLevel =
    daysUntil <= 3 ? 'urgent' : daysUntil <= 7 ? 'soon' : 'upcoming'

  const subject =
    urgencyLevel === 'urgent'
      ? `⚠️ URGENT: ${scholarshipName} deadline in ${daysUntil} days!`
      : `Reminder: ${scholarshipName} deadline in ${daysUntil} days`

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #F5F1E8;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .header {
      background-color: #2C8C99;
      color: white;
      padding: 30px 20px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .content {
      padding: 30px 20px;
    }
    .deadline-badge {
      display: inline-block;
      padding: 12px 24px;
      background-color: ${urgencyLevel === 'urgent' ? '#C84C3C' : urgencyLevel === 'soon' ? '#D4A24C' : '#2C8C99'};
      color: white;
      border-radius: 8px;
      font-weight: bold;
      font-size: 18px;
      margin: 20px 0;
    }
    .scholarship-details {
      background-color: #F5F1E8;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
    }
    .detail-row {
      margin: 10px 0;
    }
    .detail-label {
      font-weight: bold;
      color: #666;
    }
    .cta-button {
      display: inline-block;
      padding: 14px 32px;
      background-color: #2C8C99;
      color: white;
      text-decoration: none;
      border-radius: 8px;
      font-weight: bold;
      margin: 20px 0;
      text-align: center;
    }
    .footer {
      background-color: #3D2E2E;
      color: #F5F1E8;
      padding: 20px;
      text-align: center;
      font-size: 14px;
    }
    .footer a {
      color: #2C8C99;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📚 Scholarship Deadline Reminder</h1>
    </div>

    <div class="content">
      <p>Hi ${userName},</p>

      <p>This is a ${urgencyLevel === 'urgent' ? '<strong>urgent</strong>' : ''} reminder that the application deadline for a scholarship you saved is approaching!</p>

      <div class="deadline-badge">
        ${daysUntil} day${daysUntil === 1 ? '' : 's'} until deadline
      </div>

      <div class="scholarship-details">
        <h2 style="margin-top: 0; color: #3D2E2E;">${scholarshipName}</h2>

        <div class="detail-row">
          <span class="detail-label">Deadline:</span>
          <span>${deadlineFormatted}</span>
        </div>

        ${amount ? `
        <div class="detail-row">
          <span class="detail-label">Award Amount:</span>
          <span>${amount}</span>
        </div>
        ` : ''}
      </div>

      <p>${urgencyLevel === 'urgent' ? "<strong>Don't miss this opportunity!</strong> Make sure to submit your application before the deadline." : "Make sure you have everything ready to submit your application before the deadline approaches."}</p>

      <center>
        <a href="${baseUrl}${scholarshipUrl}" class="cta-button">
          View Scholarship Details →
        </a>
      </center>

      <p style="margin-top: 30px; font-size: 14px; color: #666;">
        💡 <strong>Tip:</strong> Set aside time to review the application requirements and gather all necessary documents before the deadline.
      </p>
    </div>

    <div class="footer">
      <p>This email was sent by Native Resource Hub</p>
      <p>
        <a href="${baseUrl}/saved">View Your Saved Resources</a> |
        <a href="${baseUrl}/settings/notifications">Notification Settings</a>
      </p>
    </div>
  </div>
</body>
</html>
`

  const text = `
Scholarship Deadline Reminder

Hi ${userName},

This is a reminder that the application deadline for a scholarship you saved is approaching!

${daysUntil} day${daysUntil === 1 ? '' : 's'} until deadline

Scholarship: ${scholarshipName}
Deadline: ${deadlineFormatted}
${amount ? `Award Amount: ${amount}` : ''}

${urgencyLevel === 'urgent' ? "Don't miss this opportunity! " : ''}Make sure to submit your application before the deadline.

View Scholarship Details: ${baseUrl}${scholarshipUrl}

---
This email was sent by Native Resource Hub
View Your Saved Resources: ${baseUrl}/saved
Notification Settings: ${baseUrl}/settings/notifications
`

  return { subject, html, text }
}
