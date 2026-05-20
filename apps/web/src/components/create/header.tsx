import { productName } from '@/lib/constants';
import Link from 'next/link';

export default function Header({ text }: { text: string }) {
  return (
    <header className='main-gradient h-76 w-full'>
      <section className='mx-auto flex max-w-416 flex-col gap-4 px-3 py-4 md:gap-6 md:px-28 md:py-5'>
        <Link
          href='/'
          className='text-xl font-medium md:text-lg md:font-bold'
        >
          {productName}
        </Link>
        <h1 className='w-[90%] text-3xl font-bold tracking-wider md:text-4xl'>{text}</h1>
        <div className='hidden w-fit select-none rounded-md bg-sky-300 px-3 text-lg md:block'>
          Béta
        </div>
      </section>
    </header>
  );
}
