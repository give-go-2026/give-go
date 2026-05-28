import { Suspense } from 'react';
import Header from '@/components/create/header';
import Forms from '@/components/create/forms';
import { AuthGate } from '@/components/auth/gate';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

async function CreateContent() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return <AuthGate />;
  if (session.user.role !== 'org') redirect('/events');
  return <Forms startAtEventDetails />;
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
