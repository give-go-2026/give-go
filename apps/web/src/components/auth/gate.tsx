'use client';

import { loginAction, registerOrgAction } from '@/features/auth/lib/actions';
import Button from '@repo/ui/button';
import Link from 'next/link';
import { useActionState, useState } from 'react';

export function AuthGate() {
  const [tab, setTab] = useState<'login' | 'register'>('login');

  return (
    <section className='mx-auto mb-30 flex w-full max-w-416 flex-col gap-4 px-3 py-4 md:gap-6 md:px-28 md:py-5'>
      <div className='bg-background -mt-34 mb-5 flex w-full flex-col gap-6 rounded-3xl px-4 py-6 shadow-xl shadow-black/15'>
        <div className='flex gap-4 border-b border-gray-200 pb-2'>
          <button
            type='button'
            onClick={() => setTab('login')}
            className={`pb-2 font-medium ${tab === 'login' ? 'border-b-2 border-cyan-500 text-cyan-700' : 'text-gray-500'}`}
          >
            Bejelentkezés
          </button>
          <button
            type='button'
            onClick={() => setTab('register')}
            className={`pb-2 font-medium ${tab === 'register' ? 'border-b-2 border-cyan-500 text-cyan-700' : 'text-gray-500'}`}
          >
            Regisztráció
          </button>
        </div>
        {tab === 'login' ? <GateLoginForm /> : <GateRegisterForm />}
      </div>
    </section>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className='mt-1 text-xs text-red-500'>{message}</p>;
}

function inputClass(hasError?: string) {
  return `focus:border-foreground w-full rounded-md border px-3 py-2 focus:outline-none ${
    hasError ? 'border-red-400 bg-red-50' : 'border-gray-300'
  }`;
}

function GateLoginForm() {
  const [state, action, isPending] = useActionState(loginAction, null);
  const fe = state?.fieldErrors ?? {};

  return (
    <form
      action={action}
      className='flex flex-col gap-6'
    >
      <p className='text-gray-600'>
        Jelentkezz be a szervezeti fiókodba az esemény létrehozásához.
      </p>
      <label>
        <span className='mb-1 block text-sm font-medium text-gray-700'>E-mail cím</span>
        <input
          type='email'
          name='email'
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

function GateRegisterForm() {
  const [state, action, isPending] = useActionState(registerOrgAction, null);
  const fe = state?.fieldErrors ?? {};

  return (
    <form
      action={action}
      className='flex flex-col gap-4'
    >
      <p className='text-gray-600'>Hozz létre szervezeti fiókot az esemény létrehozásához.</p>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        <label>
          <span className='mb-1 block text-sm font-medium text-gray-700'>Szervezet neve</span>
          <input
            type='text'
            name='orgName'
            className={inputClass(fe.orgName)}
            placeholder='pl.: Máltai szeretet szolgálat'
          />
          <FieldError message={fe.orgName} />
        </label>
        <label>
          <span className='mb-1 block text-sm font-medium text-gray-700'>E-mail cím</span>
          <input
            type='email'
            name='email'
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
            autoComplete='new-password'
          />
          <FieldError message={fe.password} />
        </label>
        <label>
          <span className='mb-1 block text-sm font-medium text-gray-700'>
            Nyilvántartási szám
          </span>
          <input
            type='text'
            name='orgNum'
            className={inputClass(fe.orgNum)}
            placeholder='pl.: 01-01-0001234'
          />
          <FieldError message={fe.orgNum} />
        </label>
        <label>
          <span className='mb-1 block text-sm font-medium text-gray-700'>Weboldal</span>
          <input
            type='text'
            name='orgWeb'
            className='focus:border-foreground w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none'
            placeholder='pl.: www.onkentes.com'
          />
        </label>
        <label>
          <span className='mb-1 block text-sm font-medium text-gray-700'>
            Kapcsolattartó neve
          </span>
          <input
            type='text'
            name='userName'
            className={inputClass(fe.userName)}
            placeholder='pl.: Kiss József'
          />
          <FieldError message={fe.userName} />
        </label>
        <label>
          <span className='mb-1 block text-sm font-medium text-gray-700'>Telefonszám</span>
          <input
            type='tel'
            name='userPhone'
            className='focus:border-foreground w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none'
            placeholder='pl.: 06301234567'
          />
        </label>
      </div>
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
    </form>
  );
}
