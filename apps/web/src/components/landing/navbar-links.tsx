'use client';

import Link from 'next/link';
import { Fragment } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';

export default function NavLinks() {
  const { data: session } = authClient.useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await authClient.api.signOut();
      router.push('/');
    } catch (e) {
      // keep console for debugging; do not disrupt UX

      console.error('Sign out failed', e);
    }
  };

  return (
    <Fragment>
      <Link href='#'>Elérhetőségek</Link>
      {session ? (
        <>
          <Link href='/dashboard'>Irányítópult</Link>
          <button onClick={handleSignOut}>Kijelentkezés</button>
        </>
      ) : null}

      {/* <Link href='#'>Kapcsolat</Link>
      <Link href='#'>Hiba bejelentő</Link>
      <Link href='#'>Rólunk</Link>
      <Link href='/auth/login'>Bejelentkezés</Link> */}
    </Fragment>
  );
}
