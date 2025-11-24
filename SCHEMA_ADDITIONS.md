# Schema Additions for Advanced Features

This document describes the database schema additions for advanced features.

## New Models

### Application (Scholarship Application Tracking)
Tracks scholarship applications and their status.

```prisma
model Application {
  id            String    @id @default(uuid())
  userId        String
  scholarshipId String
  status        ApplicationStatus @default(not_started)
  notes         String?
  submittedAt   DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  user          User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  scholarship   Scholarship   @relation(fields: [scholarshipId], references: [id], onDelete: Cascade)

  @@unique([userId, scholarshipId])
  @@index([userId])
  @@index([status])
}

enum ApplicationStatus {
  not_started
  in_progress
  submitted
  awarded
  denied
}
```

### Review (Ratings and Reviews)
Allows users to rate and review resources and scholarships.

```prisma
model Review {
  id            String   @id @default(uuid())
  userId        String
  resourceId    String
  resourceType  ReviewType @default(resource)
  rating        Int      // 1-5 stars
  comment       String?
  helpful       Int      @default(0)
  notHelpful    Int      @default(0)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, resourceId])
  @@index([resourceId])
  @@index([rating])
}

enum ReviewType {
  resource
  scholarship
}
```

### NotificationPreferences
User preferences for email notifications.

```prisma
model NotificationPreferences {
  id                  String   @id @default(uuid())
  userId              String   @unique
  deadlineReminders   Boolean  @default(true)
  weeklyDigest        Boolean  @default(true)
  newResourcesAlert   Boolean  @default(false)
  daysBefore1         Boolean  @default(true)
  daysBefore3         Boolean  @default(true)
  daysBefore7         Boolean  @default(true)
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt

  user                User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}
```

### Analytics
Tracks user interactions for insights.

```prisma
model Analytics {
  id          String   @id @default(uuid())
  event       String   // e.g., 'view', 'click', 'search'
  userId      String?
  resourceId  String?
  metadata    Json?    // Additional event data
  createdAt   DateTime @default(now())

  @@index([event])
  @@index([resourceId])
  @@index([createdAt])
}
```

## Migration Instructions

To apply these schema changes:

1. Add the models to `prisma/schema.prisma`
2. Run `npx prisma migrate dev --name add_advanced_features`
3. Run `npx prisma generate`

## Features Enabled

1. **Application Tracking**: Users can track scholarship application status
2. **Ratings & Reviews**: Community feedback on resources
3. **Notification Preferences**: Granular control over email notifications
4. **Analytics**: Track user behavior for insights

## API Endpoints to Create

- `POST /api/applications` - Create application
- `PUT /api/applications/[id]` - Update application status
- `GET /api/applications` - List user's applications
- `POST /api/reviews` - Add review
- `GET /api/reviews/[resourceId]` - Get reviews for resource
- `PUT /api/reviews/[id]/helpful` - Mark review as helpful
- `GET /api/settings/notifications` - Get notification preferences
- `PUT /api/settings/notifications` - Update preferences
- `POST /api/analytics/track` - Track analytics event
