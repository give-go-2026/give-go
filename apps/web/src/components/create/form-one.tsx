import { FormField, UploadField } from './fields';

export default function FormOne({ errors }: { errors: Record<string, string> }) {
  return (
    <section className='mx-auto mt-10 flex w-full flex-col gap-4 px-3 py-4 md:gap-6'>
      <div className='grid grid-cols-1 gap-10 md:grid-cols-3'>
        <FormField
          label='Melyik szervezetet képviseled:'
          placeholder='pl.: Máltai szeretet szolgálat'
          type='string'
          name='orgName'
          undertext={null}
          error={errors['orgName']}
        />
        <FormField
          label='Ki a kapcsolattartó:'
          placeholder='pl.: Kiss József'
          type='string'
          name='userName'
          undertext={null}
          error={errors['userName']}
        />
        <UploadField
          label=''
          placeholder='Logó feltöltése'
          name='logo'
          undertext='Max 1 kép, PNG, SVG, JPG, max 40 MB'
          error={errors['logo']}
        />
        <FormField
          label='Kapcsolattartói email cím:'
          placeholder='pl.: onkentes@email.com'
          type='string'
          name='userEmail'
          undertext={null}
          error={errors['userEmail']}
        />
        <FormField
          label='Kapcsolattartói telefonszám:'
          placeholder='pl.: 06301234567'
          type='string'
          name='userPhone'
          undertext='Ezen a számon csak mi fogunk keresni, hogy hitelesítsük az eseményt'
          error={errors['userPhone']}
        />
        <FormField
          label='Szervezet publikus weboldala:'
          placeholder='pl.: www.onkentes.com'
          type='string'
          name='orgWeb'
          undertext={null}
          error={errors['orgWeb']}
        />
        <FormField
          label='Jelszó'
          placeholder='Jelszó'
          type='string'
          name='password'
          undertext={null}
          error={errors['password']}
        />
        <FormField
          label='Szervezet nyilvántartási száma'
          placeholder='pl.: 01-01-0001234'
          type='string'
          name='orgNum'
          undertext={null}
          error={errors['orgNum']}
        />
      </div>
    </section>
  );
}
