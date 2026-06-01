import {
  BuildingOfficeIcon,
  ComputerDesktopIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  HeartIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { productName } from '@/lib/constants';

export default function ContactPage() {
  return (
    <div className='min-h-screen overflow-hidden'>
      <header className='main-gradient h-76 w-full'>
        <section className='mx-auto flex w-full max-w-416 flex-col gap-4 px-3 py-4 md:gap-6 md:px-28 md:py-5'>
          <Link
            href='/'
            className='text-xl font-medium md:text-lg md:font-bold'
          >
            {productName}
          </Link>
          <h1 className='w-[90%] text-3xl font-bold tracking-wider md:text-4xl'>Impresszum</h1>
          <div className='hidden w-fit rounded-md bg-sky-300 px-3 text-lg select-none md:block'>
            Béta
          </div>
        </section>
      </header>

      <section className='mx-auto flex w-full max-w-416 flex-col gap-4 px-3 py-4 md:gap-6 md:px-28 md:py-5'>
        <div className='bg-background -mt-34 flex w-full flex-col gap-8 rounded-3xl px-4 py-6 shadow-xl shadow-black/15 md:px-8 md:py-8'>

          {/* Give & Go */}
          <div className='flex flex-col gap-3'>
            <div className='flex items-center gap-2 text-foreground'>
              <HeartIcon className='h-5 w-5 shrink-0' />
              <h2 className='text-xl font-semibold'>Give &amp; Go</h2>
            </div>
            <p className='text-base leading-relaxed text-gray-600'>
              A Give &amp; Go célja, hogy összekösse az önkéntes segítséget kereső szervezeteket azokkal az emberekkel, akik szívesen segítenének.
            </p>
          </div>

          {/* Üzemeltető */}
          <div className='flex flex-col gap-3'>
            <div className='flex items-center gap-2 text-foreground'>
              <BuildingOfficeIcon className='h-5 w-5 shrink-0' />
              <h2 className='text-xl font-semibold'>Üzemeltető</h2>
            </div>
            <p className='text-gray-600'>A platformot jelenleg magánszemély(ek) üzemeltetik.</p>
            <p className='text-gray-600'>A projekt hosszú távú célja egy hivatalos civil szervezeti forma létrehozása.</p>
          </div>

          {/* Elérhetőség */}
          <div className='flex flex-col gap-3'>
            <div className='flex items-center gap-2 text-foreground'>
              <EnvelopeIcon className='h-5 w-5 shrink-0' />
              <h2 className='text-xl font-semibold'>Elérhetőség</h2>
            </div>
            <div className='flex flex-col divide-y divide-gray-200 overflow-hidden rounded-xl bg-gray-50'>
              <div className='flex items-center justify-between px-4 py-3'>
                <span className='text-sm text-gray-500'>E-mail</span>
                <Link
                  href='mailto:hello@givego.hu'
                  className='text-sm font-medium text-blue-500 hover:underline'
                >
                  hello@givego.hu
                </Link>
              </div>
              <div className='flex items-center justify-between px-4 py-3'>
                <span className='text-sm text-gray-500'>Weboldal</span>
                <Link
                  href='https://givego.hu'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-sm font-medium text-blue-500 hover:underline'
                >
                  givego.hu
                </Link>
              </div>
              <div className='flex items-center justify-between px-4 py-3'>
                <span className='text-sm text-gray-500'>Tárhelyszolgáltató</span>
                <span className='text-sm font-medium'>Vercel Inc.</span>
              </div>
              <div className='flex items-center justify-between px-4 py-3'>
                <span className='text-sm text-gray-500'>Tárhelyszolgáltató weboldala</span>
                <Link
                  href='https://vercel.com'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-sm font-medium text-blue-500 hover:underline'
                >
                  vercel.com
                </Link>
              </div>
            </div>
          </div>

          {/* A platform működése */}
          <div className='flex flex-col gap-3'>
            <div className='flex items-center gap-2 text-foreground'>
              <ComputerDesktopIcon className='h-5 w-5 shrink-0' />
              <h2 className='text-xl font-semibold'>A platform működése</h2>
            </div>
            <p className='text-gray-600'>
              A Give &amp; Go platformon civil szervezetek és közösségi kezdeményezések jeleníthetnek meg önkéntes lehetőségeket és segítségkéréseket.
            </p>
            <p className='text-gray-600'>A weboldalon megjelenő információk tájékoztató jellegűek.</p>
            <p className='text-gray-600'>
              A kapcsolatfelvétel közvetlenül, e-mailen keresztül történik az érintett szervezetekkel.
            </p>
            <p className='text-gray-600'>
              Magánszemély felhasználók számára jelenleg nincs regisztráció vagy bejelentkezési lehetőség.
            </p>
          </div>

          {/* Felelősség */}
          <div className='flex flex-col gap-3'>
            <div className='flex items-center gap-2 text-foreground'>
              <ShieldCheckIcon className='h-5 w-5 shrink-0' />
              <h2 className='text-xl font-semibold'>Felelősség</h2>
            </div>
            <p className='text-gray-600'>
              A platformon közzétett tartalmakért, információkért és külső szervezetek által megadott adatokért az üzemeltető nem vállal teljes körű felelősséget.
            </p>
            <p className='text-gray-600'>
              Fenntartjuk a jogot a jogsértő, megtévesztő vagy nem megfelelő tartalmak eltávolítására.
            </p>
            <p className='text-gray-600'>
              Amennyiben problémás vagy visszaélésre utaló tartalmat észlelsz, kérjük jelezd a{' '}
              <Link href='mailto:hello@givego.hu' className='text-blue-500 hover:underline'>
                hello@givego.hu
              </Link>{' '}
              e-mail címen.
            </p>
          </div>

          {/* Közösségi média */}
          <div className='flex flex-col gap-3'>
            <div className='flex items-center gap-2 text-foreground'>
              <GlobeAltIcon className='h-5 w-5 shrink-0' />
              <h2 className='text-xl font-semibold'>Közösségi média</h2>
            </div>
            <div className='flex flex-col divide-y divide-gray-200 overflow-hidden rounded-xl bg-gray-50'>
              <div className='flex items-center gap-3 px-4 py-3'>
                <svg className='h-5 w-5 shrink-0 text-gray-500' viewBox='0 0 24 24' fill='currentColor'>
                  <path d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' />
                </svg>
                <span className='text-sm font-medium'>Instagram</span>
                <span className='ml-auto rounded-md bg-sky-300 px-2 py-0.5 text-xs select-none'>hamarosan</span>
              </div>
              <div className='flex items-center gap-3 px-4 py-3'>
                <svg className='h-5 w-5 shrink-0 text-gray-500' viewBox='0 0 24 24' fill='currentColor'>
                  <path d='M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' />
                </svg>
                <span className='text-sm font-medium'>Facebook</span>
                <span className='ml-auto rounded-md bg-sky-300 px-2 py-0.5 text-xs select-none'>hamarosan</span>
              </div>
              <Link
                href='https://linkedin.com/company/givegohu'
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center gap-3 px-4 py-3 transition-colors hover:bg-gray-100'
              >
                <svg className='h-5 w-5 shrink-0 text-gray-500' viewBox='0 0 24 24' fill='currentColor'>
                  <path d='M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' />
                </svg>
                <span className='text-sm font-medium text-blue-500'>linkedin.com/company/givegohu</span>
              </Link>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
