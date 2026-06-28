import ApplyButton from '@/components/ui/apply-button';
import ShareButton from '@/components/ui/share-button';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Button from '@repo/ui/button';
import { fetchCardById, formatDuration } from '@/lib/utils';

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
  const cc = encodeURIComponent('hello@givego.hu');
  const email = `mailto:${card.organizer.email}?cc=${cc}&subject=${subject}&body=${body}`;

  return (
    <div className='flex min-h-screen flex-col items-center overflow-hidden'>
      <header className='main-gradient h-28 w-full px-3 py-6 text-center'>
        <h1 className='text-3xl font-black tracking-wide md:hidden'>Választott programod</h1>
      </header>
      <main className='-mt-6 w-full px-3'>
        <div className='mx-auto grid h-107.5 w-full max-w-257.5 grid-cols-1 rounded-3xl bg-white shadow-2xl md:grid-cols-5'>
          <div className='col-span-full flex h-full w-full flex-col items-center justify-center p-10 md:col-span-2 md:rounded-l-3xl md:p-6'>
            <div className='h-max max-h-133.75 w-full snap-center rounded-3xl shadow-xl'>
              <div className='flex h-full flex-col gap-2 overflow-clip rounded-3xl'>
                <Image
                  src={card.image_url}
                  alt='Card placeholder'
                  width={400}
                  height={175}
                  className='h-35 object-cover'
                />
                <div className='flex flex-1 flex-col justify-center gap-1 p-4'>
                  <div className='h-full w-full'>
                    <div className='grid h-full min-w-fit grid-flow-col place-content-start gap-2 pb-1'>
                      {card.tags.map((tag) => (
                        <span
                          key={tag.name}
                          className='inline-block rounded-full px-5 py-1 text-xs font-medium text-pretty text-white md:text-sm'
                          style={{ backgroundColor: tag.color }}
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  </div>
                  <h4 className='text-xl tracking-wide text-pretty'>{card.title}</h4>
                  <span className='font-bold text-gray-500'>{card.address}</span>
                  <span className='text-lg font-bold text-black'>
                    {formatDuration(new Date(card.start_date), new Date(card.end_date))}
                  </span>
                  <span className='text-sm text-gray-600'>{card.organizer.name}</span>
                  <span className='h-full max-h-18.75 overflow-hidden text-sm text-gray-500'>
                    {card.description}
                  </span>
                </div>
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
          href={`/events/${card.id}`}
          className='hidden md:block'
        >
          <div className='mx-auto w-1/4'>
            <Button
              styleType='secondary'
              styleVariant='outlined'
              fill
              big
            >
              Vissza az eseményhez
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
