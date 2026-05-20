'use client';

import { z } from 'zod';
import Button from '@repo/ui/button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import FormOne from './form-one';
import FormTwo from './form-two';
import FormThree from './form-three';

type FieldErrors = Record<string, string>;

const firstSchema = z.object({
  orgName: z.string().min(1, 'Szervezet neve kötelező!'),
  userName: z.string().min(1, 'Kapcsolattartó neve kötelező!'),
  userEmail: z.string().email('Helytelen email cím!'),
  userPhone: z.string().min(7, 'Helytelen telefonszám!'),
  orgWeb: z.string().min(4, 'Weboldal cím kötelező!'),
  password: z.string().min(8, 'Minimum 8 karakter legyen a jelszó!'),
  orgNum: z.string().min(1, 'Nyilvántartási szám kötelező!'),
});

const thirdSchema = z.object({
  desc: z.string().min(1, 'Leírás kötelező!').max(1000, 'Leírás maximum 1000 karakter lehet!'),
});

export default function Forms() {
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [summaryErrors, setSummaryErrors] = useState<string[]>([]);

  function get(key: string) {
    return localStorage.getItem(key) ?? '';
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
    const errs: FieldErrors = {};

    const base = z
      .object({
        eventName: z.string().min(1, 'Esemény neve kötelező!'),
        eventAddress: z.string().min(1, 'Esemény helyszíne kötelező!'),
      })
      .safeParse({
        eventName: get('eventName'),
        eventAddress: get('eventAddress'),
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
        const anyMissing = selectedDays.some(
          (i) => !get(`startTime_${i}`) || !get(`endTime_${i}`),
        );
        if (anyMissing)
          errs['perDayTimes'] = 'Minden kiválasztott napra add meg az időpontokat!';
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

    return errs;
  }

  function validateThird(): FieldErrors {
    const errs: FieldErrors = {};

    const result = thirdSchema.safeParse({ desc: get('desc') });
    if (!result.success) Object.assign(errs, zodToRecord(result.error));

    if (JSON.parse(get('eventImages') || '[]').length === 0)
      errs['eventImages'] = 'Legalább egy kép feltöltése kötelező!';

    return errs;
  }

  function Next() {
    setFieldErrors({});
    setSummaryErrors([]);

    if (page === 2) {
      const errs1 = validateFirst();
      const errs2 = validateSecond();
      const errs3 = validateThird();

      const summary = [
        ...Object.values(errs1).map((e) => `[Szervezet adatai] ${e}`),
        ...Object.values(errs2).map((e) => `[Esemény adatai] ${e}`),
      ];

      setFieldErrors(errs3);
      setSummaryErrors(summary);

      if (Object.keys(errs3).length === 0 && summary.length === 0) {
        router.push('/create/success');
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
    <section className='mx-auto flex w-full max-w-416 flex-col gap-4 px-3 py-4 md:gap-6 md:px-28 md:py-5'>
      <div className='bg-background mb-5 -mt-34 flex w-full flex-col justify-between rounded-3xl px-4 py-6 shadow-xl shadow-black/15 md:-mb-11.5'>
        <div className='grid grid-cols-3 gap-5 text-center'>
          <div>
            <p className={`mb-2 ${page === 0 ? 'text-cyan-800' : undefined}`}>Szervezet adatai</p>
            <div
              className={`h-1 w-full rounded-3xl border ${page === 0 ? 'border-cyan-300 bg-cyan-300' : 'border-gray-300 bg-gray-300'}`}
            ></div>
          </div>
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

        {page === 0 ? (
          <FormOne errors={fieldErrors} />
        ) : page === 1 ? (
          <FormTwo errors={fieldErrors} />
        ) : (
          <FormThree errors={fieldErrors} />
        )}

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
                if (page === 0) router.push('/create/info');
                else setPage(page - 1);
              }}
              className='border-0 bg-transparent p-0'
            >
              Vissza
            </button>
          </div>
          <div className='w-max'>
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
