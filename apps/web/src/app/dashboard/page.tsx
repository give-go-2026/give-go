import { Suspense } from 'react';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import Header from '@/components/create/header';
import Dashboard from '@/components/dashboard/dashboard';
import { EMPTY_ORG } from '@/components/dashboard/types';
import { auth } from '@/lib/auth';
import { getEventsByOrganizer, getOrgProfile } from '@/features/dashboard/lib/queries';
import { getUsedTags } from '@/features/events/lib/queries';

async function DashboardContent() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user || session.user.role !== 'org') redirect('/');

  const [org, events, usedTags] = await Promise.all([
    getOrgProfile(session.user.id),
    getEventsByOrganizer(session.user.id),
    getUsedTags(),
  ]);

  return (
    <Dashboard
      initialOrg={org ?? EMPTY_ORG}
      initialEvents={events}
      usedTags={usedTags}
    />
  );
}

export default function DashboardPage() {
  return (
    <div className='min-h-screen'>
      <Header text='Irányítópult' />
      <Suspense>
        <DashboardContent />
      </Suspense>
    </div>
  );
}
