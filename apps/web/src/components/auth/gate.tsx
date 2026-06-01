'use client';

import { useState } from 'react';
import { LoginForm } from './login-form';
import { RegisterForm } from './register-form';

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
        {tab === 'login' ? (
          <LoginForm
            intro={
              <p className='text-gray-600'>
                Jelentkezz be a szervezeti fiókodba az esemény létrehozásához.
              </p>
            }
          />
        ) : (
          <RegisterForm
            columns={2}
            showLoginLink={false}
            intro={
              <p className='text-gray-600'>
                Hozz létre szervezeti fiókot az esemény létrehozásához.
              </p>
            }
          />
        )}
      </div>
    </section>
  );
}
