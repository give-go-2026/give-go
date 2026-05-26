import { Suspense } from 'react';
import Header from '@/components/create/header';
import Forms from '@/components/create/forms';
import { AuthGate } from '@/components/auth/gate';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

async function CreateContent() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user ? <Forms startAtEventDetails /> : <AuthGate />;
}

export default function CreateFormPage() {
  return (
    <div className='min-h-screen'>
      <Header text='Esemény hirdetés létrehozása' />
      <Suspense>
        <CreateContent />
      </Suspense>
    </div>
  );
}
