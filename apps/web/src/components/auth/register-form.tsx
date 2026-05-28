'use client';

import { registerOrgAction } from '@/features/auth/lib/actions';
import Button from '@repo/ui/button';
import Link from 'next/link';
import { useActionState } from 'react';

export function RegisterForm() {
  const [state, action, isPending] = useActionState(registerOrgAction, null);

  return (
    <form
      action={action}
      className='flex flex-col gap-6'
    >
      <h1 className='text-3xl font-bold text-gray-800'>Szervezeti regisztráció</h1>
      <label>
        <span className='mb-1 block text-sm font-medium text-gray-700'>Szervezet neve</span>
        <input
          type='text'
          name='orgName'
          className='focus:border-foreground w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none'
          placeholder='pl.: Máltai szeretet szolgálat'
          autoComplete='organization'
        />
      </label>
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
          autoComplete='new-password'
        />
      </label>
      <label>
        <span className='mb-1 block text-sm font-medium text-gray-700'>
          Szervezet nyilvántartási száma
        </span>
        <input
          type='text'
          name='orgNum'
          className='focus:border-foreground w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none'
          placeholder='pl.: 01-01-0001234'
        />
      </label>
      <label>
        <span className='mb-1 block text-sm font-medium text-gray-700'>
          Szervezet publikus weboldala
        </span>
        <input
          type='text'
          name='orgWeb'
          className='focus:border-foreground w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none'
          placeholder='pl.: www.onkentes.com'
        />
      </label>
      <label>
        <span className='mb-1 block text-sm font-medium text-gray-700'>Kapcsolattartó neve</span>
        <input
          type='text'
          name='userName'
          className='focus:border-foreground w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none'
          placeholder='pl.: Kiss József'
          autoComplete='name'
        />
      </label>
      <label>
        <span className='mb-1 block text-sm font-medium text-gray-700'>
          Kapcsolattartói telefonszám
        </span>
        <input
          type='tel'
          name='userPhone'
          className='focus:border-foreground w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none'
          placeholder='pl.: 06301234567'
          autoComplete='tel'
        />
      </label>
      {state?.error && <p className='text-sm text-red-500'>{state.error}</p>}
      <Button
        styleType='primary'
        styleVariant='filled'
        big
        fill
        type='submit'
        disabled={isPending}
      >
        {isPending ? 'Regisztráció...' : 'Regisztráció'}
      </Button>
      <span className='text-center text-gray-600'>
        Már van fiókod?{' '}
        <Link
          href='/auth/login'
          className='font-medium text-blue-600 underline hover:text-blue-500'
        >
          Jelentkezz be!
        </Link>
      </span>
    </form>
  );
}
