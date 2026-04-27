import z from 'zod';

export const NewsLetterSubscriptionSchema = z.object({
  email: z.email('Kérjük, adjon meg egy érvényes email címet!'),
});

export type NewsLetterSubscriptionData = z.infer<typeof NewsLetterSubscriptionSchema>;
export type NewsLetterSubscriptionState = {
  email: NewsLetterSubscriptionData['email'];
  errors: Partial<Record<keyof NewsLetterSubscriptionData, string[]>>;
  message: string | null;
};

export const UnsubscribeFromNewsletterSchema = z.object({
  id: z.uuid('Érvénytelen azonosító formátum!'),
  email: z.email('Kérjük, adjon meg egy érvényes email címet!'),
});
export type UnsubscribeFromNewsletterData = z.infer<typeof UnsubscribeFromNewsletterSchema>;
