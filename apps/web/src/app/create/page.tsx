import Header from '@/components/create/header';
import Forms from '@/components/create/forms';

export default function CreateFormPage() {
  return (
    <div className='min-h-screen'>
      <Header text='Esemény hirdetés létrehozása' />
      <Forms />
    </div>
  );
}
