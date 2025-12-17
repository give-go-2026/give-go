import Link from 'next/link';
import { productName } from '@/lib/constants';
import NavLinks from './navbar-links';
import NavMobileMenu from './navbar-mobile';

export default function Navbar() {
  return (
    <nav className='md:text-foreground flex w-full items-center'>
      <Link
        href='/'
        className='text-xl font-medium md:text-lg md:font-bold'
      >
        {productName}
      </Link>
      <div className='mx-6 hidden items-center gap-4 md:mx-4 md:flex'>
        <NavLinks />
      </div>
      <NavMobileMenu links={<NavLinks />} />
    </nav>
  );
}
