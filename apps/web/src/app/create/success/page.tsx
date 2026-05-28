import Header from '@/components/create/header';
import Success from '@/components/create/success';

export default function CreateSuccessPage() {
  return (
    <div className='min-h-screen overflow-y-auto'>
      <Header text='Hirdetést létrehoztad!' />
      <Success />
    </div>
  );
}
