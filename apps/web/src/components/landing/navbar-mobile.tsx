'use client';

import Bars3Icon from '@heroicons/react/24/solid/esm/Bars3Icon';
import XMarkIcon from '@heroicons/react/24/solid/esm/XMarkIcon';
import { Fragment, useEffect, useState } from 'react';
import { productName } from '@/lib/constants';
import Link from 'next/link';

type NavMobileMenuProps = Readonly<{
  links: React.ReactNode;
}>;
export default function NavMobileMenu({ links }: NavMobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    function handleResize() {
      setIsOpen(false);
    }

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <Fragment>
      <button
        className='ml-auto box-border block rounded-sm border border-[#6c757d44] px-3 py-1 md:hidden'
        onClick={setIsOpen.bind(null, true)}
      >
        <Bars3Icon className='h-8 w-8' />
      </button>
      {isOpen && (
        <div className='bg-background absolute top-0 left-0 z-10 min-h-screen w-full px-3 py-4 text-black md:hidden'>
          <div className='flex flex-col gap-4'>
            <div className='-mb-2 flex items-center justify-between'>
              <Link
                href='/'
                className='text-xl font-medium'
              >
                {productName}
              </Link>
              <button
                className='ml-auto box-border block rounded-sm border border-[#6c757d44] px-3 py-1 md:hidden'
                onClick={setIsOpen.bind(null, false)}
              >
                <XMarkIcon className='h-8 w-8' />
              </button>
            </div>
            {links}
          </div>
        </div>
      )}
    </Fragment>
  );
}
