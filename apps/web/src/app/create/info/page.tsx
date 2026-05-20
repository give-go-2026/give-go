import Header from '@/components/create/header';
import Info from '@/components/create/info';

export default function CreateInfoPage() {
  return (
    <div className='min-h-screen overflow-y-auto'>
      <Header text='Tudnivalók esemény hirdetéshez' />
      <Info />
    </div>
  );
}
