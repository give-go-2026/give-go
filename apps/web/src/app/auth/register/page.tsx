import { AuthCard, AuthPage } from '@/components/auth/ui';
import { registrationtypes } from '@/lib/constants';
import { RegistrationType } from '@/lib/definitions';
import Button from '@repo/ui/button';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Fragment } from 'react';
import { notFound } from 'next/navigation';

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // Keep this file in the repo but make the route inaccessible by
  // returning a 404 for all requests. Remove this guard to restore the route.
  notFound();

  const type = (await searchParams).type as RegistrationType | undefined;
  const success = (await searchParams).success === 'true';

  if (type && !registrationtypes.includes(type)) {
    return redirect('/auth/register');
  }

  if (success && type) {
    return (
      <AuthPage>
        <AuthCard>
          <RegistrationSuccess type={type} />
        </AuthCard>
      </AuthPage>
    );
  }

  return (
    <AuthPage>
      <AuthCard>
        <h1 className='text-3xl font-bold text-gray-800'>Regisztráció</h1>
        {!type ? <NoTypeSelected /> : <RegistrationForm type={type} />}
        <span className='text-center text-gray-600'>
          Már van fiókod?{' '}
          <Link
            href='/auth/login'
            className='font-medium text-blue-600 underline hover:text-blue-500'
          >
            Jelentkezz be!
          </Link>
        </span>
      </AuthCard>
    </AuthPage>
  );
}

function NoTypeSelected() {
  return (
    <Fragment>
      <Link href='/auth/register?type=volunteer'>
        <Button
          styleVariant='filled'
          styleType='primary'
          fill
          big
        >
          Önkéntes regisztráció
        </Button>
      </Link>
      <Link href='/auth/register?type=organization'>
        <Button
          styleVariant='outlined'
          styleType='primary'
          fill
          big
        >
          Szervezeti regisztráció
        </Button>
      </Link>
    </Fragment>
  );
}

function RegistrationForm({ type }: { type: RegistrationType }) {
  return redirect(`/auth/register/?type=${type}&success=true`);
}

function RegistrationSuccess({ type }: { type: RegistrationType }) {
  return (
    <Fragment>
      <h1 className='text-3xl font-bold'>Sikeres regisztráció!</h1>
      {type === 'volunteer' ? (
        <Fragment>
          <span>De jó, hogy itt vagy!</span>
          <span>Most jelentkezz be és találkozz a közösség tagjaival!</span>
        </Fragment>
      ) : (
        <Fragment>
          <span>Köszönjük, hogy csatlakoztál a közösségünkhöz!</span>
          <span>Most jelentkezz be és hozd létre az első önkéntes eseményed!</span>
        </Fragment>
      )}
      <Link href='/auth/login'>
        <Button
          styleVariant='filled'
          styleType='primary'
          fill
          big
        >
          Bejelentkezés
        </Button>
      </Link>
    </Fragment>
  );
}
