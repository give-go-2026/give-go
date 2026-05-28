import ApplyButton from '@/components/ui/apply-button';
import ShareButton from '@/components/ui/share-button';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Button from '@repo/ui/button';
import { fetchCardById } from '@/lib/utils';

export default async function ApplyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!id || Number.isNaN(Number(id))) {
    return notFound();
  }

  const card = await fetchCardById(Number(id));
  if (!card) {
    return notFound();
  }

  const subject = encodeURIComponent(`Jelentkezés a "${card.title}" eseményre`);
  const body = encodeURIComponent(
    `Kedves "${card.organizer.name}" Szervezet!\n\nEzúton szeretnék jelentkezni a "${card.title}" eseményre önkéntesként. Jelentkezésemmel kapcsolatban várom mielőbbi visszajelzésüket.\n\nKöszönöm!`,
  );
  const email = `mailto:${card.organizer.email}?subject=${subject}&body=${body}`;

  return (
    <div className='flex min-h-screen flex-col items-center overflow-hidden'>
      <header className='main-gradient h-28 w-full px-3 py-6 text-center'>
        <h1 className='text-3xl font-black tracking-wide md:hidden'>Választott programod</h1>
      </header>
      <main className='-mt-6 w-full px-3'>
        <div className='mx-auto grid h-107.5 w-full max-w-257.5 grid-cols-1 rounded-3xl bg-white shadow-2xl md:grid-cols-5'>
          <div className='col-span-full flex h-full w-full flex-col items-center justify-center p-0 md:col-span-2 md:rounded-l-3xl md:p-6'>
            <div className='h-full w-full overflow-clip rounded-3xl border border-slate-200 shadow-lg'>
              <Image
                src={card.image_url}
                alt='Card placeholder'
                width={360}
                height={280}
                className='h-1/2 w-full object-cover'
              />
              <div className='flex h-1/2 w-full flex-col gap-2 p-3'>
                <h4 className='text-xl tracking-wide text-pretty'>{card.title}</h4>
                <span className='font-medium text-gray-500'>{card.address}</span>
                <span className='flex grow items-center text-wrap'>{card.description}</span>
              </div>
            </div>
          </div>
          <div className='hidden h-full w-full flex-col items-center justify-center p-6 text-center md:col-span-3 md:flex md:rounded-r-3xl'>
            <h1 className='mb-12 text-3xl font-black tracking-wide'>Választott programod</h1>
            <p className='mb-6 text-lg text-pretty'>
              A jelentkezésed emailben tudod elküldeni a kiválasztott civil szervezet
              képviselőjének.
            </p>
            <div className='flex w-full gap-6'>
              <Link
                href={email}
                target='_blank'
                className='w-full'
              >
                <ApplyButton
                  fill
                  big
                />
              </Link>
              <ShareButton fill />
            </div>
          </div>
        </div>
      </main>
      <footer className='mt-6 w-full px-3 text-center text-pretty md:mt-12'>
        <Link
          href='/events'
          className='hidden md:block'
        >
          <div className='mx-auto w-1/4'>
            <Button
              styleType='secondary'
              styleVariant='outlined'
              fill
              big
            >
              Vissza az eseményekhez
            </Button>
          </div>
        </Link>
        <div className='md:hidden'>
          <p className='mb-3 text-lg text-pretty'>
            A jelentkezésed emailben tudod elküldeni a kiválasztott civil szervezet képviselőjének.
          </p>
          <div className='mx-auto flex w-full flex-col gap-x-6 gap-y-3'>
            <Link
              href={email}
              target='_blank'
              rel='noreferrer'
            >
              <ApplyButton
                fill
                big
              />
            </Link>
            <ShareButton fill />
            <Link href='/events'>
              <Button
                styleType='secondary'
                styleVariant='outlined'
                fill
                big
              >
                Vissza az eseményekhez
              </Button>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
