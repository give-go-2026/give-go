'use server';

import { flattenError } from 'zod';
import {
  NewsLetterSubscriptionSchema,
  NewsLetterSubscriptionState,
  UnsubscribeFromNewsletterSchema,
} from './definitions';
import { db } from '@/database';
import { newsLetterSubscriptions } from '@/database/schema';
import { eq } from 'drizzle-orm';
import { resend } from '@/lib/definitions';
import NewsletterEmail from '@/components/newsletter/email-template';

export const subscribeToNewsletter = async (email: string) => {
  const validated = NewsLetterSubscriptionSchema.safeParse({ email });

  if (!validated.success) {
    throw new Error('Érvénytelen email cím. Kérjük, adjon meg egy érvényes email címet!');
  }

  try {
    const [subscription] = await db
      .insert(newsLetterSubscriptions)
      .values({
        email,
      })
      .onConflictDoUpdate({
        target: newsLetterSubscriptions.email,
        set: { status: 'subscribed' }, // Ha korábban leiratkozott, újraaktiváljuk
      })
      .returning();

    if (!subscription) {
      throw new Error('Subscription failed');
    }

    return subscription;
  } catch {
    throw new Error('Sikertelen feliratkozás. Kérjük, próbálja újra később.');
  }
};

export const unsubscribeFromNewsletter = async (params: { id: string; email: string }) => {
  const validated = UnsubscribeFromNewsletterSchema.safeParse(params);

  if (!validated.success) {
    throw new Error(
      'Érvénytelen leiratkozási adatok. Kérjük, ellenőrizze a linket és próbálja újra.',
    );
  }

  const { id, email } = validated.data;

  const subscription = await db.query.newsLetterSubscriptions.findFirst({
    where: (newsletterSubscription, { eq }) => eq(newsletterSubscription.email, email),
  });

  if (!subscription) {
    throw new Error('Ez az email cím nincs feliratkozva a hírlevélre.');
  }

  if (subscription.id !== id) {
    throw new Error('Leiratkozáshoz használja az email címhez tartozó leiratkozási linket.');
  }

  try {
    const [updatedSubscription] = await db
      .update(newsLetterSubscriptions)
      .set({ status: 'unsubscribed' })
      .where(eq(newsLetterSubscriptions.email, email))
      .returning();

    if (!updatedSubscription) {
      throw new Error('Failed to unsubscribe');
    }
  } catch {
    throw new Error('Sikertelen leiratkozás. Kérjük, próbálja újra később.');
  }
};

export const subscribeToNewsletterAction = async (
  prevState: NewsLetterSubscriptionState,
  formData: FormData,
) => {
  const newState: NewsLetterSubscriptionState = {
    email: (formData.get('email') as string) || '',
    message: null,
    errors: {},
  };

  const validated = NewsLetterSubscriptionSchema.safeParse({
    email: formData.get('email'),
  });
  if (!validated.success) {
    return {
      ...newState,
      errors: flattenError(validated.error).fieldErrors as NewsLetterSubscriptionState['errors'],
    };
  }
  const { email } = validated.data;

  const subscription = await db.query.newsLetterSubscriptions.findFirst({
    where: (newsletterSubscription, { eq }) => eq(newsletterSubscription.email, email),
  });

  if (!subscription || subscription.status === 'unsubscribed') {
    try {
      const subscription = await subscribeToNewsletter(email);

      try {
        await sendSubscriptionEmail({ id: subscription.id, email: subscription.email });
      } catch (error) {
        console.error('Email küldése sikertelen:', error);
      }
    } catch (error) {
      return {
        ...newState,
        message:
          (error as Error).message || 'Sikertelen feliratkozás. Kérjük, próbálja újra később.',
      };
    }
  }

  return {
    email: '',
    errors: {},
    message: 'Sikeres feliratkozás! A továbbiakban értesítéseket fog kapni a legfrissebb hírekről!',
  };
};

export const sendSubscriptionEmail = async ({ id, email }: { id: string; email: string }) => {
  const { data, error } = await resend.emails.send({
    from: 'Give&Go <hello@givego.hu>',
    to: [email],
    subject: 'Hírlevél feliratkozás',
    react: NewsletterEmail({ id, email }),
  });

  if (error) {
    throw new Error('Sikertelen email küldés. Kérjük, próbálja újra később.');
  }

  return data;
};
