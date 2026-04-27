import { pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const newsletterSubscriptionStatuses = ['subscribed', 'unsubscribed'] as const;
export type NewsletterSubscriptionStatus = (typeof newsletterSubscriptionStatuses)[number];
export const newsletterSubscriptionStatusEnum = pgEnum(
  'newsletter_subscription_status',
  newsletterSubscriptionStatuses,
);

export const newsLetterSubscriptions = pgTable('newsletter_subscriptions', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  status: newsletterSubscriptionStatusEnum('status').notNull().default('subscribed'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
