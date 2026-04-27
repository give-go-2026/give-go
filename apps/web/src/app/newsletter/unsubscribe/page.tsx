import { unsubscribeFromNewsletter } from '@/features/newsletter/lib/actions';
import Button from '@repo/ui/button';
import Link from 'next/link';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;

  const email = decodeURIComponent(String(params.email || ''));
  const id = decodeURIComponent(String(params.id || ''));

  let error: string | null = null;
  try {
    await unsubscribeFromNewsletter({ email, id });
  } catch (err) {
    error = err instanceof Error ? err.message : 'Ismeretlen hiba történt.';
  }

  return (
    <main className='main-gradient flex min-h-dvh'>
      <section className='container mx-auto flex max-w-5xl flex-col gap-6 px-4 py-18 text-center md:gap-12'>
        <h1 className='text-3xl font-black md:text-6xl md:font-bold'>
          {error ? 'Hiba történt' : 'Sikeres leiratkozás'}
        </h1>
        <p className='text-2xl font-medium'>{error || 'Sikeresen leiratkozott a hírlevélről.'}</p>
        <Link
          href={'/'}
          className='mx-auto w-full max-w-md'
        >
          <Button
            styleType='primary'
            styleVariant='filled'
            fill
            big
          >
            Vissza a főoldalra
          </Button>
        </Link>
      </section>
    </main>
  );
}
