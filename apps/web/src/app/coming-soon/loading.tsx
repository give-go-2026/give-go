export default function Loading() {
  return (
    <main className='main-gradient flex min-h-dvh'>
      <section className='container mx-auto flex max-w-5xl flex-col gap-6 px-4 py-18'>
        <h1 className='text-4xl font-black md:mb-6 md:text-6xl md:font-bold'>Give&Go</h1>
        <p className='text-4xl font-black md:font-bold'>Segíteni könnyebb, mint gondolnád.</p>
        <p className='text-lg font-bold md:text-2xl md:font-medium'>
          Izgalmas dolog készül! Hamarosan könnyedén felfedezheted azokat a civil szervezeteket,
          amelyek önkénteseket keresnek, és megtalálhatod a hozzád legjobban illő programokat.
          Iratkozz fel, hogy elsőként értesülj az indulásról - alig várjuk, hogy csatlakozz!
        </p>
      </section>
    </main>
  );
}
