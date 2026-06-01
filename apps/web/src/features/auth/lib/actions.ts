'use server';

import { auth } from '@/lib/auth';
import { APIError } from 'better-auth/api';
import { redirect } from 'next/navigation';

export type AuthState = {
  error?: string;
  fieldErrors?: Partial<Record<string, string>>;
  values?: Partial<Record<string, string>>;
} | null;

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function loginAction(prevState: AuthState, formData: FormData): Promise<AuthState> {
  const email = (formData.get('email') as string).trim();
  const password = formData.get('password') as string;

  const fieldErrors: Record<string, string> = {};
  if (!email) fieldErrors.email = 'Az e-mail cím megadása kötelező';
  else if (!isValidEmail(email)) fieldErrors.email = 'Érvénytelen e-mail cím formátum';
  if (!password) fieldErrors.password = 'A jelszó megadása kötelező';

  if (Object.keys(fieldErrors).length > 0) return { fieldErrors, values: { email } };

  try {
    await auth.api.signInEmail({ body: { email, password } });
  } catch (e) {
    if (e instanceof APIError) {
      return { fieldErrors: { password: 'Hibás e-mail cím vagy jelszó' }, values: { email } };
    }
    return { error: 'Ismeretlen hiba történt', values: { email } };
  }

  redirect('/create');
}

export async function registerOrgAction(
  prevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const name = (formData.get('orgName') as string).trim();
  const email = (formData.get('email') as string).trim();
  const password = formData.get('password') as string;
  const registrationNumber = (formData.get('orgNum') as string).trim();
  const website = (formData.get('orgWeb') as string).trim();
  const contactName = (formData.get('userName') as string).trim();
  const contactPhone = (formData.get('userPhone') as string).trim();
  const description = (formData.get('orgDescription') as string).trim();

  const values = {
    orgName: name,
    email,
    orgNum: registrationNumber,
    orgWeb: website,
    userName: contactName,
    userPhone: contactPhone,
    orgDescription: description,
  };

  const fieldErrors: Record<string, string> = {};
  if (!name) fieldErrors.orgName = 'A szervezet neve kötelező';
  if (!email) fieldErrors.email = 'Az e-mail cím megadása kötelező';
  else if (!isValidEmail(email)) fieldErrors.email = 'Érvénytelen e-mail cím formátum';
  if (!password) fieldErrors.password = 'A jelszó megadása kötelező';
  else if (password.length < 8)
    fieldErrors.password = 'A jelszónak legalább 8 karakter hosszúnak kell lennie';
  if (!registrationNumber) fieldErrors.orgNum = 'A nyilvántartási szám kötelező';
  if (!contactName) fieldErrors.userName = 'A kapcsolattartó neve kötelező';
  if (!contactPhone) fieldErrors.userPhone = 'A telefonszám kötelező';

  if (Object.keys(fieldErrors).length > 0) return { fieldErrors, values };

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
        description,
      },
    });
  } catch (e) {
    if (e instanceof APIError && e.status === 'UNPROCESSABLE_ENTITY') {
      return { fieldErrors: { email: 'Ez az e-mail cím már foglalt' }, values };
    }
    return { error: 'Hiba történt a regisztráció során. Próbáld újra!', values };
  }

  redirect('/create');
}

export async function logoutAction(): Promise<void> {
  await auth.api.signOut();
  redirect('/');
}
