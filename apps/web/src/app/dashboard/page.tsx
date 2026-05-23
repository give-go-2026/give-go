import Header from '@/components/create/header';
import Dashboard from '@/components/dashboard/dashboard';

export default function DashboardPage() {
  return (
    <div className='min-h-screen'>
      <Header text='Irányítópult' />
      <Dashboard />
    </div>
  );
}
