export default function Loading() {
  return (
    <div className='flex min-h-screen flex-col items-center overflow-hidden'>
      <header className='main-gradient h-28 w-full px-3 py-6 text-center'></header>
      <main className='-mt-6 w-full px-3'>
        <div className='mx-auto h-[430px] w-full max-w-[1030px] animate-pulse rounded-3xl bg-slate-600 shadow-2xl'></div>
      </main>
    </div>
  );
}
