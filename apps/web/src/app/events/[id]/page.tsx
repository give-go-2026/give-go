import Button from '@repo/ui/Button';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function EventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!id || Number.isNaN(Number(id))) {
    return notFound();
  }
  return (
    <div className='flex min-h-screen w-full flex-col items-center justify-center gap-6 overflow-hidden'>
      <h1 className='text-3xl font-black tracking-wide'>
        Esemény részletei - {id}
      </h1>
      <Link href='/events'>
        <div className='mx-auto w-64'>
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
    </div>
  );
}
