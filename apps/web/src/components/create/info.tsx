'use client';

import { ExclamationTriangleIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import Button from '@repo/ui/button';
import { useRouter } from 'next/navigation';

export default function Info() {
  const router = useRouter();

  return (
    <section className='mx-auto flex w-full max-w-416 flex-col gap-4 px-3 py-4 md:gap-6 md:px-28 md:py-5'>
      <div className='bg-background -mt-34 mb-5 flex w-full flex-col justify-between gap-4 rounded-3xl px-4 py-6 shadow-xl shadow-black/15 md:-mb-11.5'>
        <div className='flex w-full items-center gap-3 rounded-3xl bg-orange-50 px-4 py-6'>
          <ExclamationTriangleIcon className='h-8 w-8 shrink-0' />
          <p>
            Ez a felület csak akkor hasznos, ha szervezet vagy. Magánszemélyként egyenlőre nincs
            regisztrációs lehetőség.
          </p>
        </div>
        <h2 className='mb-2 text-xl font-bold'>Mi a hirdetés menete?</h2>
        <p>
          Ha elbizonytalanodtál vagy segítségre van szükséged akkor{' '}
          <Link
            href='#'
            className='font-bold underline'
          >
            itt találsz
          </Link>{' '}
          videókat és tananyagokat a folytatáshoz.
        </p>
        <div className='grid grid-cols-1 gap-10 md:grid-cols-2'>
          <div className='flex items-center gap-5'>
            <span className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#00c8b3] font-bold text-white shadow-xl shadow-black/15'>
              1.
            </span>
            <p className='font-bold'>
              Ha még nem regisztráltál add meg a szervezet adatait és tölts fel egy képet a
              logótokról.
            </p>
          </div>
          <div className='flex items-center gap-5'>
            <span className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#00c8b3] font-bold text-white shadow-xl shadow-black/15'>
              3.
            </span>
            <p className='font-bold'>
              A publikálásig van lehetőséged módosítani az eseményen és ellenőrizni a hirdetés
              előnézetét.
            </p>
          </div>
          <div className='flex items-center gap-5'>
            <span className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#00c8b3] font-bold text-white shadow-xl shadow-black/15'>
              2.
            </span>
            <p className='font-bold'>
              Töltsd ki a mezőket az esemény részleteivel és tölts fel legalább 1 képet a
              hirdetéshez. Küldd be, hogy publikálhassuk.
            </p>
          </div>
          <div className='flex items-center gap-5'>
            <span className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#00c8b3] font-bold text-white shadow-xl shadow-black/15'>
              4.
            </span>
            <p className='font-bold'>
              Publikálás után oszd meg a hirdetést minél több felületen és várd a jelentkezőket!
            </p>
          </div>
        </div>
        <div className='flex items-center justify-center'>
          <div className='w-max'>
            <Button
              styleType='primary'
              styleVariant='filled'
              fill={true}
              onClick={() => router.push('/create')}
            >
              Oké, kezdjük!
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
