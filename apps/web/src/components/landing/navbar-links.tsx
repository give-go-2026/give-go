'use client';

import Link from 'next/link';
import { Fragment } from 'react';
import { authClient } from '@/lib/auth-client';

export default function NavLinks() {
  const { data: session } = authClient.useSession();

  return (
    <Fragment>
      <Link href='#'>Elérhetőségek</Link>
      {session ? (
        <>
          <Link href='/dashboard'>Irányítópult</Link>
          <button onClick={() => authClient.signOut()}>Kijelentkezés</button>
        </>
      ) : undefined}

      {/* <Link href='#'>Kapcsolat</Link>
      <Link href='#'>Hiba bejelentő</Link>
      <Link href='#'>Rólunk</Link>
      <Link href='/auth/login'>Bejelentkezés</Link> */}
    </Fragment>
  );
}
