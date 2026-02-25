import Link from 'next/link';
import { Fragment } from 'react';

export default function NavLinks() {
  return (
    <Fragment>
      <Link href='#'>Kapcsolat</Link>
      <Link href='#'>Hiba bejelentő</Link>
      <Link href='#'>Rólunk</Link>
      <Link href='/auth/login'>Bejelentkezés</Link>
    </Fragment>
  );
}
