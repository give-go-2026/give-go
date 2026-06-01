import { AuthCard, AuthPage } from '@/components/auth/ui';
import { LoginForm } from '@/components/auth/login-form';
import Button from '@repo/ui/button';
import Link from 'next/link';
import { Fragment } from 'react';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const forgotPassword = (await searchParams).forgotPassword === 'true';

  return (
    <AuthPage>
      <AuthCard>{!forgotPassword ? <LoginForm /> : <ForgotPasswordCard />}</AuthCard>
    </AuthPage>
  );
}

function ForgotPasswordCard() {
  return (
    <Fragment>
      <h1 className='text-3xl font-bold text-gray-800'>Elfelejtett jelszó</h1>
      <span>Add meg az e-mail címed, és küldünk egy linket a jelszó visszaállításához!</span>
      <label>
        <span className='mb-1 block text-sm font-medium text-gray-700'>E-mail cím</span>
        <input
          type='email'
          className='focus:border-foreground w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none'
          placeholder='pelda@gmail.com'
          autoComplete='email'
        />
      </label>
      <Button
        styleType='primary'
        styleVariant='filled'
        big
        fill
      >
        Jelszó visszaállítása
      </Button>
      <span className='text-center text-gray-600'>
        <Link
          href='/create'
          className='hover:text-foreground font-medium underline'
        >
          Vissza
        </Link>
      </span>
    </Fragment>
  );
}
