import Link from 'next/link';
import { productName } from '@/lib/constants';
import NavLinks from './navbar-links';
import NavMobileMenu from './navbar-mobile';
import CreateEventButton from './create-event-button';

export default function Navbar() {
  return (
    <nav className='md:text-foreground flex w-full items-center justify-between'>
      <div className='flex'>
        <Link
          href='/'
          className='text-xl font-medium md:text-lg md:font-bold'
        >
          {productName}
        </Link>
        <div className='mx-6 hidden items-center gap-4 font-normal md:flex'>
          <NavLinks />
        </div>
      </div>

      <div className='hidden items-center gap-4 md:flex'>
        <CreateEventButton />
      </div>
      <NavMobileMenu
        links={
          <>
            <NavLinks />
            <CreateEventButton />
          </>
        }
      />
    </nav>
  );
}
