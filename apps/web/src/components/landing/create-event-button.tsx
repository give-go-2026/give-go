'use client';

import { useRouter } from 'next/navigation';
import Button from '@repo/ui/button';

export default function CreateEventButton() {
  const router = useRouter();

  return (
    <Button
      styleType='primary'
      styleVariant='filled'
      fill={true}
      onClick={() => router.push('/create/info')}
    >
      + Új esemény
    </Button>
  );
}
