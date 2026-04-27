'use client';
import { subscribeToNewsletterAction } from '@/features/newsletter/lib/actions';
import Button from '@repo/ui/button';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect } from 'react';

const initialState = {
  email: '',
  errors: {},
  message: null,
};
export default function NewsLetterSubscribeForm() {
  const [state, subscribeAction, isPending] = useActionState(
    subscribeToNewsletterAction,
    initialState,
  );
  const router = useRouter();

  useEffect(() => {
    if (state.message?.toLowerCase().includes('sikeres')) {
      router.replace('/coming-soon?success=true');
    }
  }, [state.message, router]);

  return (
    <form
      action={subscribeAction}
      className='flex flex-col justify-center gap-4 md:flex-row md:items-center'
    >
      <div className='flex w-full flex-col gap-1'>
        <label
          htmlFor='email'
          className={`text-lg font-medium ${state.errors.email ? 'text-red-600' : 'text-foreground'}`}
        >
          Email cím
        </label>
        <div className='flex w-full flex-col items-center gap-4 md:flex-row'>
          <input
            type='email'
            name='email'
            id='email'
            className={`w-full rounded-lg border px-4 py-2 text-lg ${state.errors.email ? 'border-red-600 text-red-600 outline-red-600' : 'border-foreground text-foreground outline-foreground'}`}
            placeholder='valaki@givego.hu'
            defaultValue={state.email}
          />
          <div className='w-full pb-1 md:max-w-sm'>
            <Button
              styleType='primary'
              styleVariant='filled'
              fill
              big
              type='submit'
              disabled={isPending}
            >
              Feliratkozom
            </Button>
          </div>
        </div>
        {state.errors.email && <span className='p-1 text-red-600'>{state.errors.email[0]}</span>}
      </div>
    </form>
  );
}
