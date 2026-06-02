'use client';

import { z } from 'zod';
import Button from '@repo/ui/button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createEventAction, type CreateEventInput } from '@/features/events/lib/actions';

const isDev = process.env.NODE_ENV === 'development';
import FormOne from './form-one';
import FormTwo from './form-two';
import FormThree from './form-three';
import Link from 'next/link';

type FieldErrors = Record<string, string>;

const firstSchema = z.object({
  orgName: z.string().min(1, 'Szervezet neve kötelező!'),
  userName: z.string().min(1, 'Kapcsolattartó neve kötelező!'),
  userEmail: z.email('Helytelen email cím!'),
  userPhone: z.string().min(7, 'Helytelen telefonszám!'),
  orgWeb: z.string().min(4, 'Weboldal cím kötelező!'),
  password: z.string().min(8, 'Minimum 8 karakter legyen a jelszó!'),
  orgNum: z.string().min(1, 'Nyilvántartási szám kötelező!'),
});

const thirdSchema = z.object({
  desc: z.string().min(1, 'Leírás kötelező!').max(1000, 'Leírás maximum 1000 karakter lehet!'),
});

export default function Forms({ startAtEventDetails = false }: { startAtEventDetails?: boolean }) {
  const router = useRouter();
  const [page, setPage] = useState(startAtEventDetails ? 1 : 0);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [summaryErrors, setSummaryErrors] = useState<string[]>([]);
  const [resetKey, setResetKey] = useState(0);

  function get(key: string) {
    return sessionStorage.getItem(key) ?? '';
  }

  function zodToRecord(error: z.ZodError): FieldErrors {
    const map: FieldErrors = {};
    for (const e of error.issues) {
      const key = String(e.path[0] ?? '_');
      if (!map[key]) map[key] = e.message;
    }
    return map;
  }

  function validateFirst(): FieldErrors {
    if (isDev) return {};
    const errs: FieldErrors = {};

    const result = firstSchema.safeParse({
      orgName: get('orgName'),
      userName: get('userName'),
      userEmail: get('userEmail'),
      userPhone: get('userPhone'),
      orgWeb: get('orgWeb'),
      password: get('password'),
      orgNum: get('orgNum'),
    });
    if (!result.success) Object.assign(errs, zodToRecord(result.error));

    if (!get('logo')) errs['logo'] = 'Szervezet logójának feltöltése kötelező!';

    return errs;
  }

  function validateSecond(): FieldErrors {
    if (isDev) return {};
    const errs: FieldErrors = {};

    const base = z
      .object({
        eventName: z.string().min(1, 'Esemény neve kötelező!'),
        eventAddress: z
          .string()
          .min(1, 'Esemény helyszíne kötelező!')
          .refine(
            (v) =>
              v
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean).length >= 4,
            'Add meg mind a 4 részt vesszővel elválasztva: Irányítószám, Település, Utca, Házszám!',
          ),
        eventTheme: z.string().min(1, 'Támogatott téma kötelező!'),
        eventType: z.string().min(1, 'Munka típusa kötelező!'),
      })
      .safeParse({
        eventName: get('eventName'),
        eventAddress: get('eventAddress'),
        eventTheme: get('eventTheme'),
        eventType: get('eventType'),
      });
    if (!base.success) Object.assign(errs, zodToRecord(base.error));

    const frequency = get('helpFrequency') || 'Rendszeres';

    if (frequency === 'Egyszeri') {
      const dates = z
        .object({
          eventStartDate: z.string().min(1, 'Esemény kezdő dátuma kötelező!'),
          eventStartTime: z.string().min(1, 'Kezdés időpontja kötelező!'),
          eventEndTime: z.string().min(1, 'Záró időpontja kötelező!'),
          eventEndDate: z.string().min(1, 'Esemény záró dátuma kötelező!'),
          eventCloseTime: z.string().min(1, 'Zárás időpontja kötelező!'),
        })
        .safeParse({
          eventStartDate: get('eventStartDate'),
          eventStartTime: get('eventStartTime'),
          eventEndTime: get('eventEndTime'),
          eventEndDate: get('eventEndDate'),
          eventCloseTime: get('eventCloseTime'),
        });
      if (!dates.success) Object.assign(errs, zodToRecord(dates.error));
    } else {
      const series = z
        .object({
          seriesStartDate: z.string().min(1, 'Sorozat kezdő dátuma kötelező!'),
          seriesEndDate: z.string().min(1, 'Sorozat záró dátuma kötelező!'),
        })
        .safeParse({
          seriesStartDate: get('seriesStartDate'),
          seriesEndDate: get('seriesEndDate'),
        });
      if (!series.success) Object.assign(errs, zodToRecord(series.error));

      const selectedDays: number[] = JSON.parse(get('selectedDays') || '[]');
      const differentTimes = get('differentTimes') === 'true';

      if (selectedDays.length === 0) {
        errs['selectedDays'] = 'Válasszon legalább egy ismétlődési napot!';
      } else if (differentTimes) {
        const anyMissing = selectedDays.some((i) => !get(`startTime_${i}`) || !get(`endTime_${i}`));
        if (anyMissing) errs['perDayTimes'] = 'Minden kiválasztott napra add meg az időpontokat!';
      } else {
        const times = z
          .object({
            startTime: z.string().min(1, 'Kezdés időpontja kötelező!'),
            endTime: z.string().min(1, 'Zárás időpontja kötelező!'),
          })
          .safeParse({
            startTime: get('startTime'),
            endTime: get('endTime'),
          });
        if (!times.success) Object.assign(errs, zodToRecord(times.error));
      }
    }

    const eventTags: string[] = JSON.parse(get('eventTags') || '[]');
    if (eventTags.length === 0) errs['eventTags'] = 'Válassz legalább egy célcsoportot!';

    return errs;
  }

  function validateThird(): FieldErrors {
    if (isDev) return {};
    const errs: FieldErrors = {};

    const result = thirdSchema.safeParse({ desc: get('desc') });
    if (!result.success) Object.assign(errs, zodToRecord(result.error));

    const eventImages: string[] = JSON.parse(get('eventImages') || '[]');
    if (eventImages.length === 0) errs['eventImages'] = 'Legalább egy kép feltöltése kötelező!';

    return errs;
  }

  async function Next() {
    setFieldErrors({});
    setSummaryErrors([]);

    if (page === 2) {
      const errs1 = startAtEventDetails ? {} : validateFirst();
      const errs2 = validateSecond();
      const errs3 = validateThird();

      const summary = [
        ...Object.values(errs1).map((e) => `[Szervezet adatai] ${e}`),
        ...Object.values(errs2).map((e) => `[Esemény adatai] ${e}`),
      ];

      setFieldErrors(errs3);
      setSummaryErrors(summary);

      if (Object.keys(errs3).length === 0 && summary.length === 0) {
        const frequency = get('helpFrequency') || 'Rendszeres';
        const isRecurring = frequency === 'Rendszeres';
        const selectedDays: number[] = JSON.parse(get('selectedDays') || '[]');
        const differentTimes = get('differentTimes') === 'true';

        const perDayTimes: Record<string, { start: string; end: string }> = {};
        if (isRecurring && differentTimes) {
          for (const day of selectedDays) {
            perDayTimes[String(day)] = {
              start: get(`startTime_${day}`),
              end: get(`endTime_${day}`),
            };
          }
        }

        const result = await createEventAction({
          eventName: get('eventName'),
          eventAddress: get('eventAddress'),
          eventTheme: get('eventTheme'),
          eventType: (get('eventType') || 'fizikai') as CreateEventInput['eventType'],
          eventTags: JSON.parse(get('eventTags') || '[]'),
          helpFrequency: frequency,
          helpMode: (get('helpMode') || 'Személyes') as 'Online' | 'Személyes' | 'Hibrid',
          desc: get('desc'),
          eventImages: JSON.parse(get('eventImages') || '[]'),
          eventStartDate: get('eventStartDate') || undefined,
          eventStartTime: get('eventStartTime') || undefined,
          eventEndDate: get('eventEndDate') || undefined,
          eventEndTime: get('eventEndTime') || undefined,
          seriesStartDate: get('seriesStartDate') || undefined,
          seriesEndDate: get('seriesEndDate') || undefined,
          selectedDays: isRecurring ? selectedDays : undefined,
          startTime: get('startTime') || undefined,
          endTime: get('endTime') || undefined,
          perDayTimes: Object.keys(perDayTimes).length > 0 ? perDayTimes : undefined,
        });

        if (result?.error) {
          setSummaryErrors([result.error]);
        }
      }
    } else if (page === 1) {
      const errs = validateSecond();
      if (Object.keys(errs).length > 0) {
        setFieldErrors(errs);
      } else {
        setPage((prev) => prev + 1);
      }
    } else {
      const errs = validateFirst();
      if (Object.keys(errs).length > 0) {
        setFieldErrors(errs);
      } else {
        setPage((prev) => prev + 1);
      }
    }
  }

  return (
    <section className='mx-auto mb-30 flex w-full max-w-416 flex-col gap-4 px-3 py-4 md:gap-6 md:px-28 md:py-5'>
      <div className='bg-background -mt-34 mb-5 flex w-full flex-col justify-between rounded-3xl px-4 py-6 shadow-xl shadow-black/15 md:-mb-11.5'>
        <div className='grid grid-cols-2 gap-5 text-center'>
          {/* <div>
            <p className={`mb-2 ${page === 0 ? 'text-cyan-800' : undefined}`}>Szervezet adatai</p>
            <div
              className={`h-1 w-full rounded-3xl border ${page === 0 ? 'border-cyan-300 bg-cyan-300' : 'border-gray-300 bg-gray-300'}`}
            ></div>
          </div> */}
          <div>
            <p className={`mb-2 ${page === 1 ? 'text-cyan-800' : undefined}`}>Esemény Adatai</p>
            <div
              className={`h-1 w-full rounded-3xl border ${page === 1 ? 'border-cyan-300 bg-cyan-300' : 'border-gray-300 bg-gray-300'}`}
            ></div>
          </div>
          <div>
            <p className={`mb-2 ${page === 2 ? 'text-cyan-800' : undefined}`}>Esemény leírása</p>
            <div
              className={`h-1 w-full rounded-3xl border ${page === 2 ? 'border-cyan-300 bg-cyan-300' : 'border-gray-300 bg-gray-300'}`}
            ></div>
          </div>
        </div>

        <div key={resetKey}>
          {page === 0 ? (
            <FormOne errors={fieldErrors} />
          ) : page === 1 ? (
            <FormTwo errors={fieldErrors} />
          ) : (
            <FormThree errors={fieldErrors} />
          )}
        </div>

        {summaryErrors.length > 0 && (
          <ul className='mt-4 flex flex-col gap-1 text-sm text-red-500'>
            {summaryErrors.map((err, i) => (
              <li key={i}>&bull; {err}</li>
            ))}
          </ul>
        )}

        <div className='mt-6 flex items-center justify-between'>
          <div className='w-20 text-center font-bold'>
            <button
              type='button'
              onClick={() => {
                setFieldErrors({});
                setSummaryErrors([]);
                if (page === 0 || (page === 1 && startAtEventDetails)) router.push('/create/info');
                else setPage(page - 1);
              }}
              className='border-0 bg-transparent p-0'
            >
              Vissza
            </button>
          </div>
          <div className='flex w-max items-center justify-center gap-5'>
            {!startAtEventDetails && page === 0 ? (
              <Link
                href='/auth/login'
                className='font-bold'
              >
                Bejelentkezés
              </Link>
            ) : undefined}
            <Button
              styleType='primary'
              styleVariant='filled'
              fill={true}
              onClick={() => {
                sessionStorage.clear();
                setFieldErrors({});
                setSummaryErrors([]);
                setResetKey((k) => k + 1);
              }}
            >
              Törlés
            </Button>
            <Button
              styleType='primary'
              styleVariant='filled'
              fill={true}
              onClick={Next}
            >
              Tovább
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
