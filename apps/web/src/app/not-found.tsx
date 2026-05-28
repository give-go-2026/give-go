import Button from '@repo/ui/button';
import Link from 'next/link';

export default function NotFound() {
  return (
    <main className='main-gradient flex min-h-dvh'>
      <section className='container mx-auto flex max-w-5xl flex-col items-center gap-6 px-4 py-18 text-center'>
        <h1 className='text-6xl font-black'>404</h1>
        <p className='text-2xl font-bold'>Az oldal nem található.</p>
        <Link
          href='/'
          className='w-full max-w-xs'
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
