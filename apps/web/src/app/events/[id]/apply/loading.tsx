export default function Loading() {
  return (
    <div className='flex min-h-screen flex-col items-center overflow-hidden'>
      <header className='main-gradient h-28 w-full px-3 py-6 text-center'></header>
      <main className='-mt-6 w-full px-3'>
        <div className='mx-auto h-107.5 w-full max-w-257.5 animate-pulse rounded-3xl bg-slate-600 shadow-2xl'></div>
      </main>
    </div>
  );
}
