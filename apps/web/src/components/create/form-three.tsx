import { LongField, UploadField } from './fields';

export default function FormThree({ errors }: { errors: Record<string, string> }) {
  return (
    <section className='mx-auto mt-10 flex w-full flex-row gap-4 px-3 py-4 md:gap-6'>
      <div className='w-full gap-10'>
        <LongField
          label='Esemény leírása'
          placeholder='Maximum 1000 karakterben írd meg mi lenne a feladat amiben segítséget kérsz. Érdemes lehet itt leírni, hogyan készüljenek az önkéntesek, mit hozzanak magukkal, mire számíthatnak. Van-e valamilyen különleges helyezet, amire készüljenek az önkéntesek stb.'
          name='desc'
          undertext={null}
          error={errors['desc']}
        />
        <UploadField
          label=''
          placeholder='Képek feltöltése'
          name='eventImages'
          undertext='Max 10 kép, max 600 MB, PNG, JPG'
          multiple={true}
          maxFiles={10}
          maxSizeMB={600}
          error={errors['eventImages']}
        />
      </div>
    </section>
  );
}
