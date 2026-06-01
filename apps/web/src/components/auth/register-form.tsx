'use client';

import { registerOrgAction } from '@/features/auth/lib/actions';
import Button from '@repo/ui/button';
import Link from 'next/link';
import { useActionState, type ReactNode } from 'react';
import { FieldError, inputClass } from './form-fields';

type RegisterFormProps = {
  intro?: ReactNode;
  columns?: 1 | 2;
  showLoginLink?: boolean;
};

export function RegisterForm({ intro, columns = 1, showLoginLink = true }: RegisterFormProps) {
  const [state, action, isPending] = useActionState(registerOrgAction, null);
  const fe = state?.fieldErrors ?? {};
  const values = state?.values ?? {};
  const fieldsClass =
    columns === 2 ? 'grid grid-cols-1 gap-4 md:grid-cols-2' : 'flex flex-col gap-6';

  return (
    <form
      action={action}
      className='flex flex-col gap-4'
    >
      {intro ?? <h1 className='text-3xl font-bold text-gray-800'>Szervezeti regisztráció</h1>}
      <div className={fieldsClass}>
        <label>
          <span className='mb-1 block text-sm font-medium text-gray-700'>Szervezet neve</span>
          <input
            type='text'
            name='orgName'
            defaultValue={values.orgName ?? ''}
            className={inputClass(fe.orgName)}
            placeholder='pl.: Máltai szeretet szolgálat'
            autoComplete='organization'
          />
          <FieldError message={fe.orgName} />
        </label>
        <label>
          <span className='mb-1 block text-sm font-medium text-gray-700'>E-mail cím</span>
          <input
            type='email'
            name='email'
            defaultValue={values.email ?? ''}
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
          <span className='mb-1 block text-sm font-medium text-gray-700'>Nyilvántartási szám</span>
          <input
            type='text'
            name='orgNum'
            defaultValue={values.orgNum ?? ''}
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
            defaultValue={values.orgWeb ?? ''}
            className={inputClass()}
            placeholder='pl.: www.onkentes.com'
          />
        </label>
        <label>
          <span className='mb-1 block text-sm font-medium text-gray-700'>Kapcsolattartó neve</span>
          <input
            type='text'
            name='userName'
            defaultValue={values.userName ?? ''}
            className={inputClass(fe.userName)}
            placeholder='pl.: Kiss József'
            autoComplete='name'
          />
          <FieldError message={fe.userName} />
        </label>
        <label>
          <span className='mb-1 block text-sm font-medium text-gray-700'>Telefonszám</span>
          <input
            type='tel'
            name='userPhone'
            defaultValue={values.userPhone ?? ''}
            className={inputClass(fe.userPhone)}
            placeholder='pl.: 06301234567'
            autoComplete='tel'
          />
          <FieldError message={fe.userPhone} />
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
      {showLoginLink && (
        <span className='text-center text-gray-600'>
          Már van fiókod?{' '}
          <Link
            href='/auth/login'
            className='font-medium text-blue-600 underline hover:text-blue-500'
          >
            Jelentkezz be!
          </Link>
        </span>
      )}
    </form>
  );
}
