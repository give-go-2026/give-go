'use server';

import { auth } from '@/lib/auth';
import { APIError } from 'better-auth/api';
import { redirect } from 'next/navigation';

export type AuthState = { error: string } | null;

export async function loginAction(prevState: AuthState, formData: FormData): Promise<AuthState> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    await auth.api.signInEmail({ body: { email, password } });
  } catch (e) {
    if (e instanceof APIError) {
      return { error: 'Hibás e-mail cím vagy jelszó' };
    }
    return { error: 'Ismeretlen hiba történt' };
  }

  redirect('/create');
}

export async function registerOrgAction(
  prevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const name = formData.get('orgName') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const registrationNumber = formData.get('orgNum') as string;
  const website = formData.get('orgWeb') as string;
  const contactName = formData.get('userName') as string;
  const contactPhone = formData.get('userPhone') as string;

  try {
    await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
        registrationNumber,
        website,
        contactName,
        contactPhone,
      },
    });
  } catch (e) {
    if (e instanceof APIError && e.status === 'UNPROCESSABLE_ENTITY') {
      return { error: 'Ez az e-mail cím már foglalt' };
    }
    return { error: 'Hiba történt a regisztráció során. Próbáld újra!' };
  }

  redirect('/create');
}

export async function logoutAction(): Promise<void> {
  await auth.api.signOut();
  redirect('/');
}
