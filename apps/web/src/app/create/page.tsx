import Header from '@/components/create/header';
import Forms from '@/components/create/forms';
import { AuthGate } from '@/components/auth/gate';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export default async function CreateFormPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  return (
    <div className='min-h-screen'>
      <Header text='Esemény hirdetés létrehozása' />
      {session?.user ? <Forms startAtEventDetails /> : <AuthGate />}
    </div>
  );
}
