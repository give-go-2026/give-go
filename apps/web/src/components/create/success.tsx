'use client';

import Button from '@repo/ui/button';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Success() {
  const router = useRouter();

  return (
    <section className='mx-auto flex w-full max-w-416 flex-col gap-4 px-3 py-4 md:gap-6 md:px-28 md:py-5'>
      <div className='bg-background mb-5 -mt-34 flex w-full flex-col justify-between rounded-3xl px-4 py-6 shadow-xl shadow-black/15 md:-mb-11.5'>
        <h2 className='text-xl font-bold'>Gratulálok, létre hoztad az esemény hirdetést!</h2>
        <p className='mb-5'>
          Küldtünk neked egy emailt, az alábbi linkekkel. Az első linkkel a hirdetésedet tudod
          módosítani, amit a publikásig tudsz megtenni (utána már csak törölni tudod az eseményt).
          A második linkkel a hirdetésed előnézetét tudod megnézni.
        </p>
        <h2 className='text-xl font-bold'>Szerkesztő link:</h2>
        <p className='mb-5'>
          https://www.figma.com/design/befbgD5TigejjJIC5kHMAb/J%C3%B3t%C3%A9konys%C3%A1gi-app?node-id=433-7098&t=LKMiVE7zqSPMz2Ug-0
        </p>
        <h2 className='text-xl font-bold'>Előnézet link:</h2>
        <p className='mb-10'>
          https://www.figma.com/design/befbgD5TigejjJIC5kHMAb/J%C3%B3t%C3%A9konys%C3%A1gi-app?node-id=433-7098&t=LKMiVE7zqSPMz2Ug-0
        </p>
        <div className='flex items-center justify-between'>
          <div className='w-20 text-center font-bold'>
            <Link href='/'>vissza</Link>
          </div>
          <div className='w-max'>
            <Button
              styleType='primary'
              styleVariant='filled'
              fill={true}
              onClick={() => router.push('/')}
            >
              Vissza a főoldalra
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
