/**
 * Email template for weekly digest of new resources and scholarships
 */

interface WeeklyDigestEmailProps {
  userName: string
  newResources: Array<{
    id: string
    title: string
    type: string
    description: string
  }>
  newScholarships: Array<{
    id: string
    name: string
    amount?: string | null
    deadline?: Date | null
  }>
  upcomingDeadlines: Array<{
    id: string
    name: string
    deadline: Date
    daysUntil: number
  }>
}

export function generateWeeklyDigestEmail({
  userName,
  newResources,
  newScholarships,
  upcomingDeadlines,
}: WeeklyDigestEmailProps): { subject: string; html: string; text: string } {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  const subject = `📬 Your Weekly Digest from Native Resource Hub`

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
    .content {
      padding: 30px 20px;
    }
    .section {
      margin: 30px 0;
    }
    .section-title {
      color: #3D2E2E;
      font-size: 20px;
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 2px solid #2C8C99;
    }
    .item {
      background-color: #F5F1E8;
      padding: 15px;
      border-radius: 8px;
      margin: 10px 0;
    }
    .item-title {
      font-weight: bold;
      color: #3D2E2E;
      margin-bottom: 5px;
    }
    .item-meta {
      font-size: 14px;
      color: #666;
    }
    .badge {
      display: inline-block;
      padding: 4px 10px;
      background-color: #2C8C99;
      color: white;
      border-radius: 4px;
      font-size: 12px;
      margin-right: 5px;
    }
    .urgent {
      background-color: #C84C3C;
    }
    .cta-button {
      display: inline-block;
      padding: 12px 24px;
      background-color: #2C8C99;
      color: white;
      text-decoration: none;
      border-radius: 8px;
      font-weight: bold;
      margin: 10px 0;
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
      <h1>📬 Your Weekly Digest</h1>
      <p style="margin: 0; opacity: 0.9;">What's new at Native Resource Hub</p>
    </div>

    <div class="content">
      <p>Hi ${userName},</p>

      <p>Here's what happened this week at Native Resource Hub!</p>

      ${upcomingDeadlines.length > 0 ? `
      <div class="section">
        <h2 class="section-title">⏰ Upcoming Deadlines</h2>
        ${upcomingDeadlines.map(deadline => `
          <div class="item">
            <div class="item-title">${deadline.name}</div>
            <div class="item-meta">
              <span class="badge ${deadline.daysUntil <= 7 ? 'urgent' : ''}">
                ${deadline.daysUntil} days left
              </span>
              Deadline: ${deadline.deadline.toLocaleDateString()}
            </div>
            <a href="${baseUrl}/scholarships/${deadline.id}" class="cta-button">View Details</a>
          </div>
        `).join('')}
      </div>
      ` : ''}

      ${newScholarships.length > 0 ? `
      <div class="section">
        <h2 class="section-title">🎓 New Scholarships</h2>
        ${newScholarships.slice(0, 5).map(scholarship => `
          <div class="item">
            <div class="item-title">${scholarship.name}</div>
            <div class="item-meta">
              ${scholarship.amount || 'Amount varies'}
              ${scholarship.deadline ? ` • Deadline: ${scholarship.deadline.toLocaleDateString()}` : ' • Rolling deadline'}
            </div>
            <a href="${baseUrl}/scholarships/${scholarship.id}" class="cta-button">View Details</a>
          </div>
        `).join('')}
        ${newScholarships.length > 5 ? `<p><a href="${baseUrl}/scholarships">View all ${newScholarships.length} new scholarships →</a></p>` : ''}
      </div>
      ` : ''}

      ${newResources.length > 0 ? `
      <div class="section">
        <h2 class="section-title">📚 New Resources</h2>
        ${newResources.slice(0, 5).map(resource => `
          <div class="item">
            <div class="item-title">${resource.title}</div>
            <div class="item-meta">
              <span class="badge">${resource.type}</span>
              ${resource.description.substring(0, 100)}...
            </div>
            <a href="${baseUrl}/resources/${resource.id}" class="cta-button">View Details</a>
          </div>
        `).join('')}
        ${newResources.length > 5 ? `<p><a href="${baseUrl}/resources">View all ${newResources.length} new resources →</a></p>` : ''}
      </div>
      ` : ''}

      ${newResources.length === 0 && newScholarships.length === 0 ? `
      <div class="section">
        <p>No new content this week, but check out our existing resources and scholarships!</p>
        <center>
          <a href="${baseUrl}/resources" class="cta-button">Browse Resources</a>
          <a href="${baseUrl}/scholarships" class="cta-button">Browse Scholarships</a>
        </center>
      </div>
      ` : ''}
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
Your Weekly Digest from Native Resource Hub

Hi ${userName},

Here's what happened this week at Native Resource Hub!

${upcomingDeadlines.length > 0 ? `
UPCOMING DEADLINES
${upcomingDeadlines.map(d => `
- ${d.name}
  ${d.daysUntil} days left • Deadline: ${d.deadline.toLocaleDateString()}
  View: ${baseUrl}/scholarships/${d.id}
`).join('\n')}
` : ''}

${newScholarships.length > 0 ? `
NEW SCHOLARSHIPS (${newScholarships.length})
${newScholarships.slice(0, 5).map(s => `
- ${s.name}
  ${s.amount || 'Amount varies'}${s.deadline ? ` • ${s.deadline.toLocaleDateString()}` : ' • Rolling'}
  View: ${baseUrl}/scholarships/${s.id}
`).join('\n')}
` : ''}

${newResources.length > 0 ? `
NEW RESOURCES (${newResources.length})
${newResources.slice(0, 5).map(r => `
- ${r.title} (${r.type})
  ${r.description.substring(0, 100)}...
  View: ${baseUrl}/resources/${r.id}
`).join('\n')}
` : ''}

---
This email was sent by Native Resource Hub
View Your Saved Resources: ${baseUrl}/saved
Notification Settings: ${baseUrl}/settings/notifications
`

  return { subject, html, text }
}
