import { env } from '@/lib/env';
import { Tailwind, pixelBasedPreset } from 'react-email';

interface NewsletterTemplateProps {
  id: string;
  email: string;
}

export default function NewsletterEmail({ id, email }: NewsletterTemplateProps) {
  const unsubscribeLink = `https://givego.hu/newsletter/unsubscribe?id=${encodeURIComponent(id)}&email=${encodeURIComponent(email)}`;
  return (
    <Tailwind
      config={{
        presets: [pixelBasedPreset],
        theme: {
          extend: {
            colors: {
              foreground: '#284b63',
              background: '#ffffff',
            },
          },
        },
      }}
    >
      <table
        align='center'
        border={0}
        cellPadding='0'
        cellSpacing='0'
        role='presentation'
        className='mx-auto w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-lg'
      >
        <tbody>
          {/* Header / Gradient */}
          <tr>
            <td
              className='px-10 py-12 text-center'
              style={{
                background: 'linear-gradient(0, #60fcd2, #98deec)',
              }}
            >
              <h1 className='text-foreground m-0 text-4xl font-extrabold tracking-tight'>
                {env.NEXT_PUBLIC_PRODUCT_NAME}
              </h1>
            </td>
          </tr>

          {/* Tartalom */}
          <tr>
            <td className='text-foreground p-10'>
              <h2 className='mb-4 text-2xl font-bold'>Szia! 👋</h2>

              <p className='mb-4 text-lg leading-relaxed'>
                Örömmel látunk! Sikeresen feliratkoztál a{' '}
                <strong>{env.NEXT_PUBLIC_PRODUCT_NAME}</strong> hírlevelére. Nagyon várjuk már, hogy
                megmutathassuk, min dolgozunk.
              </p>

              <p className='mb-8 text-lg leading-relaxed'>
                Hamarosan értesítünk az indulásról, és arról, hogyan tudsz te is egyszerűen
                bekapcsolódni a közösségi segítő programokba.
              </p>

              {/* CTA Gomb */}
              <a
                href='https://givego.hu'
                className='mx-auto block max-w-xs'
              >
                <button className='bg-foreground w-full rounded-full px-5 py-3 text-white transition-transform'>
                  Vissza a weboldalra
                </button>
              </a>

              {/* Elválasztó */}
              <hr className='my-10 border-gray-200' />

              <p className='text-center text-sm text-gray-400 italic'>
                Ezt a levelet azért kaptad, mert feliratkoztál a {env.NEXT_PUBLIC_PRODUCT_NAME}{' '}
                oldalán a(z) {email} címmel
              </p>
            </td>
          </tr>

          {/* Footer */}
          <tr>
            <td className='bg-gray-50 p-6 text-center'>
              <p className='m-0 text-xs text-gray-500'>
                &copy; 2026 {env.NEXT_PUBLIC_PRODUCT_NAME}
              </p>
              <div className='mt-2'>
                <a
                  href={unsubscribeLink}
                  className='text-foreground mx-2 text-xs underline'
                >
                  Leiratkozás
                </a>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </Tailwind>
  );
}
