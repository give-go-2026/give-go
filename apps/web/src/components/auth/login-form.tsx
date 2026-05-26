'use client';

import { loginAction } from '@/features/auth/lib/actions';
import Button from '@repo/ui/button';
import Link from 'next/link';
import { useActionState } from 'react';

export function LoginForm() {
  const [state, action, isPending] = useActionState(loginAction, null);

  return (
    <form
      action={action}
      className='flex flex-col gap-8'
    >
      <h1 className='text-3xl font-bold text-gray-800'>Bejelentkezés</h1>
      <span>Ahhoz hogy többet láss, jelentkezz be, vagy regisztrálj!</span>
      <label>
        <span className='mb-1 block text-sm font-medium text-gray-700'>E-mail cím</span>
        <input
          type='email'
          name='email'
          className='focus:border-foreground w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none'
          placeholder='pelda@gmail.com'
          autoComplete='email'
        />
      </label>
      <label>
        <span className='mb-1 block text-sm font-medium text-gray-700'>Jelszó</span>
        <input
          type='password'
          name='password'
          placeholder='••••••••'
          className='focus:border-foreground w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none'
          autoComplete='current-password'
        />
      </label>
      {state?.error && <p className='text-sm text-red-500'>{state.error}</p>}
      <Link
        href='/auth/login?forgotPassword=true'
        className='cursor-pointer underline'
      >
        Elfelejtettem a jelszavam
      </Link>
      <Button
        styleType='primary'
        styleVariant='filled'
        big
        fill
        type='submit'
        disabled={isPending}
      >
        {isPending ? 'Bejelentkezés...' : 'Bejelentkezés'}
      </Button>
    </form>
  );
}
