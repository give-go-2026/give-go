'use client';

import { useState } from 'react';
import { Field } from './fields';
import type { OrgData } from './types';

export function OrgSection({ org, onSave }: { org: OrgData; onSave: (o: OrgData) => void }) {
  const [form, setForm] = useState(org);
  const [saved, setSaved] = useState(false);

  function update(key: keyof OrgData, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  function handleSave() {
    onSave(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className='flex flex-col gap-5'>
      <div className='flex items-center justify-between'>
        <h2 className='text-xl font-bold'>Szervezet adatai</h2>
        <button
          onClick={handleSave}
          className='rounded-full bg-cyan-900 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-cyan-800'
        >
          {saved ? 'Mentve ✓' : 'Mentés'}
        </button>
      </div>
      <div className='grid grid-cols-1 gap-5 md:grid-cols-3'>
        <Field
          label='Szervezet neve'
          value={form.orgName}
          onChange={(v) => update('orgName', v)}
          placeholder='pl.: Máltai szeretet szolgálat'
        />
        <Field
          label='Kapcsolattartó neve'
          value={form.userName}
          onChange={(v) => update('userName', v)}
          placeholder='pl.: Kiss József'
        />
        <Field
          label='Kapcsolattartói email'
          value={form.userEmail}
          onChange={(v) => update('userEmail', v)}
          placeholder='pl.: onkentes@email.com'
        />
        <Field
          label='Telefonszám'
          value={form.userPhone}
          onChange={(v) => update('userPhone', v)}
          placeholder='pl.: 06301234567'
          undertext='Ezen a számon csak mi fogunk keresni'
        />
        <Field
          label='Weboldal'
          value={form.orgWeb}
          onChange={(v) => update('orgWeb', v)}
          placeholder='pl.: www.onkentes.com'
        />
        <Field
          label='Nyilvántartási szám'
          value={form.orgNum}
          onChange={(v) => update('orgNum', v)}
          placeholder='pl.: 01-01-0001234'
        />
      </div>
    </div>
  );
}
