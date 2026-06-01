'use client';

import { loginAction } from '@/features/auth/lib/actions';
import Button from '@repo/ui/button';
import Link from 'next/link';
import { useActionState, type ReactNode } from 'react';
import { FieldError, inputClass } from './form-fields';

export function LoginForm({ intro }: { intro?: ReactNode }) {
  const [state, action, isPending] = useActionState(loginAction, null);
  const fe = state?.fieldErrors ?? {};

  return (
    <form
      action={action}
      className='flex flex-col gap-6'
    >
      {intro ?? (
        <>
          <h1 className='text-3xl font-bold text-gray-800'>Bejelentkezés</h1>
          <span>Ahhoz hogy többet láss, jelentkezz be, vagy regisztrálj!</span>
        </>
      )}
      <label>
        <span className='mb-1 block text-sm font-medium text-gray-700'>E-mail cím</span>
        <input
          type='email'
          name='email'
          defaultValue={state?.values?.email ?? ''}
          className={inputClass(fe.email)}
          placeholder='pelda@gmail.com'
          autoComplete='email'
        />
        <FieldError message={fe.email} />
      </label>
      <label>
        <span className='mb-1 block text-sm font-medium text-gray-700'>Jelszó</span>
        <input
          type='password'
          name='password'
          placeholder='••••••••'
          className={inputClass(fe.password)}
          autoComplete='current-password'
        />
        <FieldError message={fe.password} />
      </label>
      {state?.error && <p className='text-sm text-red-500'>{state.error}</p>}
      <Link
        href='/auth/login?forgotPassword=true'
        className='cursor-pointer text-sm underline'
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
