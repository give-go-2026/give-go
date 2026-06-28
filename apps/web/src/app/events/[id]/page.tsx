import { Apply } from '@/components/landing/card-buttons';
import Header from '@/components/create/header';
import { fetchCardById, fetchWebsiteById, formatDuration } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function EventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!id || Number.isNaN(Number(id))) {
    return notFound();
  }

  const card = await fetchCardById(Number(id));
  if (!card) {
    return notFound();
  }
  const website = await fetchWebsiteById(Number(id));

  return (
    <div className='min-h-screen overflow-hidden'>
      <Header text='Részletes információk' />
      <header className='h-auto w-full'>
        <section className='mx-auto -mt-37 w-full max-w-416 px-3 py-6 md:px-30 md:py-8'>
          <div className='bg-background w-full rounded-3xl shadow-2xl'>
            <div className='flex flex-1 flex-col justify-center gap-3 p-6'>
              <div>
                <h1 className='m-0 text-3xl font-bold tracking-wide'>{card.title}</h1>
                <h2 className='text-foreground/90 text-lg'>{card.organizer.name}</h2>
              </div>
              <div className='max-h-fit w-full snap-x snap-mandatory overflow-auto'>
                <div className='grid h-full min-w-fit grid-flow-col place-content-baseline gap-2 pb-1'>
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
              <span className='text-lg font-bold'>
                {formatDuration(new Date(card.start_date), new Date(card.end_date))}
              </span>
              <span className='text-foreground/80 font-bold'>{card.address}</span>
              <span>{card.description_long || card.description}</span>
              <div className='mt-2 ml-auto flex w-1/2 justify-between gap-2 md:w-1/4'>
                <Apply id={card.id} />
              </div>
            </div>
          </div>
        </section>
      </header>
      <main className='mx-auto w-full max-w-416 px-3 py-4 md:px-30 md:py-2'>
        <section className='flex w-full flex-col gap-4'>
          <h2 className='text-2xl font-bold tracking-wide'>Galéria</h2>
          <div className='snap-x snap-mandatory overflow-auto'>
            <div className='grid min-h-fit min-w-fit grid-flow-col place-content-between gap-4 pb-2'>
              {card.gallery_images.map((image, index) => (
                <div
                  key={index}
                  className='h-full w-70 shrink-0 snap-center rounded-2xl bg-gray-300'
                >
                  <Image
                    src={image}
                    alt={`Gallery image ${index + 1}`}
                    width={280}
                    height={184}
                    className='rounded-2xl object-cover'
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className='flex flex-col gap-6 px-4 py-9'>
          <h2 className='text-2xl font-bold tracking-wide'>Mi történik, ha jelentkezel?</h2>
          <p>
            A részvételhez először regisztrálnod kell a platformon &ndash; így tudjuk biztosítani,
            hogy minden jelentkezés könnyen követhető és átlátható legyen. Ha megtetszik egy
            esemény, az oldalán egy kattintással jelezheted, hogy szeretnél csatlakozni. A
            jelentkezésedről értesítést kap a szervezet, és rövid időn belül visszajelzést küldenek:
            elfogadják vagy elutasítják a részvételt. Elfogadás esetén e-mailben egyeztetitek a
            részleteket, időpontot és teendőket. Az eseményt pedig egy kattintással hozzá is adhatod
            a saját naptáradhoz &ndash; így biztosan nem maradsz le róla. Ha pedig közben úgy
            alakul, hogy mégsem tudsz részt venni az alkalmon, kérlek jelezd minél előbb a
            szervezetnek, hogy biztosan ne számoljanak veled &ndash; ezzel nagyban segíted a
            szervezést és mások részvételét is.
          </p>
          <div className='flex flex-col gap-4 px-2'>
            <div className='flex items-center gap-2'>
              <div className='flex h-13 w-13 items-center text-2xl'>1.</div>
              <span className='grow tracking-wide'>Jelentkezés elküldése</span>
            </div>
            <div className='flex items-center gap-2'>
              <div className='flex h-13 w-13 items-center text-2xl'>2.</div>
              <span className='tracking-wide'>
                Visszaigazolás a jelentkezésre a szervezet által
              </span>
            </div>
            <div className='flex items-center gap-2'>
              <div className='flex h-13 w-13 items-center text-2xl'>3.</div>
              <span className='tracking-wide'>Kapcsolatfelvétel e-mailen keresztül</span>
            </div>
            <div className='flex items-center gap-2'>
              <div className='flex h-13 w-13 items-center text-2xl'>4.</div>
              <span className='tracking-wide'>Részvétel az eseményen</span>
            </div>
          </div>
        </section>
        <section className='bg-background mb-50 flex w-full flex-col justify-between gap-4 rounded-3xl p-6 shadow-2xl'>
          <h3 className='text-2xl font-bold tracking-wide'>Szervezeti információk</h3>
          {card.organizer.description && (
            <p className='grow whitespace-pre-line'>{card.organizer.description}</p>
          )}
          <Link
            href={website ? `${website}` : '#'}
            className='mx-auto block cursor-default text-center text-lg text-blue-500 hover:underline'
          >
            További információk a szervezetről
          </Link>
        </section>
      </main>
    </div>
  );
}
