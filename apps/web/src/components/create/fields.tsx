'use client';

import { useEffect, useRef, useState } from 'react';
import { fileToDataUrl } from '@/lib/images';
import { TagAutocomplete } from '@/components/ui/tag-autocomplete';

const MONTH_NAMES = [
  'Január',
  'Február',
  'Március',
  'Április',
  'Május',
  'Június',
  'Július',
  'Augusztus',
  'Szeptember',
  'Október',
  'November',
  'December',
];
const DAY_NAMES = ['H', 'K', 'Sz', 'Cs', 'P', 'Sz', 'V'];
const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const MINUTES = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, '0'));

function CalendarIcon() {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      className='h-4 w-4 shrink-0 text-gray-400'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <rect
        x='3'
        y='4'
        width='18'
        height='18'
        rx='2'
        ry='2'
      />
      <line
        x1='16'
        y1='2'
        x2='16'
        y2='6'
      />
      <line
        x1='8'
        y1='2'
        x2='8'
        y2='6'
      />
      <line
        x1='3'
        y1='10'
        x2='21'
        y2='10'
      />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      className='h-4 w-4 shrink-0 text-gray-400'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <circle
        cx='12'
        cy='12'
        r='10'
      />
      <polyline points='12 6 12 12 16 14' />
    </svg>
  );
}

type FormFieldType = 'number' | 'string' | 'time' | 'date';

export function FormField({
  label,
  placeholder,
  type,
  name,
  undertext,
  error,
}: {
  label: string;
  placeholder: string;
  type: FormFieldType;
  name: string;
  undertext: string | null;
  error?: string;
}) {
  const [item, setItem] = useState('');
  const isFirstRun = useRef(true);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      const saved = sessionStorage.getItem(name) ?? '';
      if (saved) setItem(saved);
      return;
    }
    sessionStorage.setItem(name, item);
  }, [item, name]);

  return (
    <div className='flex flex-col'>
      <label className='pb-1'>{label}</label>
      <input
        className={`rounded-md border px-3 py-2 ${error ? 'border-red-400' : 'border-gray-300'}`}
        name={name}
        type={type}
        placeholder={placeholder}
        value={item}
        onChange={(event) => setItem(event.target.value)}
      />
      {undertext && <span className='pt-1 text-sm text-gray-400'>{undertext}</span>}
      {error && <span className='pt-0.5 text-sm text-red-500'>{error}</span>}
    </div>
  );
}

const ADDRESS_PARTS = ['Irányítószám', 'Település', 'Utca', 'Házszám'];

export function AddressField({
  label,
  name,
  error,
}: {
  label: string;
  name: string;
  error?: string;
}) {
  const [value, setValue] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [approximate, setApproximate] = useState(false);
  const isFirstRun = useRef(true);
  const approxFirstRun = useRef(true);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      const saved = sessionStorage.getItem(name) ?? '';
      if (saved) setValue(saved);
      setApproximate(sessionStorage.getItem(`${name}Approx`) === 'true');
      return;
    }
    sessionStorage.setItem(name, value);
  }, [value, name]);

  useEffect(() => {
    if (approxFirstRun.current) {
      approxFirstRun.current = false;
      return;
    }
    sessionStorage.setItem(`${name}Approx`, String(approximate));
  }, [approximate, name]);

  function syncActive(input: HTMLInputElement) {
    const caret = input.selectionStart ?? input.value.length;
    const commasBefore = (input.value.slice(0, caret).match(/,/g) ?? []).length;
    setActiveIndex(Math.min(commasBefore, ADDRESS_PARTS.length - 1));
  }

  return (
    <div className='flex flex-col'>
      <div className='flex items-center gap-5'>
        <label className='pb-1'>{label}</label>
        {!approximate && (
          <div className='mb-1.5 flex flex-wrap gap-1.5'>
            {ADDRESS_PARTS.map((part, i) => (
              <span
                key={part}
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors ${
                  i === activeIndex ? 'bg-cyan-900 text-white' : 'bg-gray-100 text-gray-500'
                }`}
              >
                {part}
              </span>
            ))}
          </div>
        )}
      </div>

      {approximate ? (
        <input
          className={`rounded-md border px-3 py-2 ${error ? 'border-red-400' : 'border-gray-300'}`}
          name={name}
          type='text'
          placeholder='pl.: Arad környéke / online'
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
      ) : (
        <input
          className={`rounded-md border px-3 py-2 ${error ? 'border-red-400' : 'border-gray-300'}`}
          name={name}
          type='text'
          placeholder='pl.: 310123, Arad, Pócsika utca, 12'
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
            syncActive(event.target);
          }}
          onSelect={(event) => syncActive(event.currentTarget)}
          onClick={(event) => syncActive(event.currentTarget)}
          onKeyUp={(event) => syncActive(event.currentTarget)}
        />
      )}
      <span className='pt-1 text-sm text-gray-400'>
        {approximate
          ? 'Add meg a helyszínt szabadon (pl. település vagy „online").'
          : `Add meg vesszővel elválasztva: ${ADDRESS_PARTS.join(', ')}.`}
      </span>
      {error && <span className='pt-0.5 text-sm text-red-500'>{error}</span>}
      <button
        type='button'
        onClick={() => setApproximate((prev) => !prev)}
        className='mt-1 w-fit text-left text-sm text-cyan-700 underline'
      >
        {approximate ? 'Pontos cím megadása' : 'Nem szükséges pontos cím megadása'}
      </button>
    </div>
  );
}

export function ListField({
  label,
  values,
  name,
  undertext,
  error,
}: {
  label: string;
  values: string[];
  name: string;
  undertext: string | null;
  error?: string;
}) {
  const [item, setItem] = useState('');
  const isFirstRun = useRef(true);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      const saved = sessionStorage.getItem(name) ?? '';
      if (saved) setItem(saved);
      return;
    }
    sessionStorage.setItem(name, item);
  }, [item, name]);

  return (
    <div className='flex flex-col'>
      <label className='pb-1'>{label}</label>
      <select
        className={`rounded-md border px-3 py-2 ${error ? 'border-red-400' : 'border-gray-300'}`}
        name={name}
        value={item}
        onChange={(event) => setItem(event.target.value)}
      >
        {values.map((e) => (
          <option
            key={e}
            value={e}
          >
            {e}
          </option>
        ))}
      </select>
      {undertext && <span className='pt-1 text-sm text-gray-400'>{undertext}</span>}
      {error && <span className='pt-0.5 text-sm text-red-500'>{error}</span>}
    </div>
  );
}

export function LongField({
  label,
  placeholder,
  name,
  undertext,
  error,
}: {
  label: string;
  placeholder: string;
  name: string;
  undertext: string | null;
  error?: string;
}) {
  const [item, setItem] = useState('');
  const isFirstRun = useRef(true);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      const saved = sessionStorage.getItem(name) ?? '';
      if (saved) setItem(saved);
      return;
    }
    sessionStorage.setItem(name, item);
  }, [item, name]);

  return (
    <div className='flex flex-col'>
      <label className='pb-1'>{label}</label>
      <textarea
        className={`min-h-40 w-full resize-y rounded-md border px-3 py-2 align-top ${error ? 'border-red-400' : 'border-gray-300'}`}
        name={name}
        placeholder={placeholder}
        value={item}
        rows={10}
        onChange={(event) => setItem(event.target.value)}
      />
      {undertext && <span className='pt-1 text-sm text-gray-400'>{undertext}</span>}
      {error && <span className='pt-0.5 text-sm text-red-500'>{error}</span>}
    </div>
  );
}

type UploadedFile = { name: string; size: number; url?: string };

const ARROW_ICON = (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    className='ml-2 h-4 w-4 shrink-0'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <path d='M5 12h14' />
    <path d='M12 5l7 7-7 7' />
  </svg>
);

function formatSize(bytes: number) {
  if (bytes === 0) return '–';
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(0)} MB`;
  return `${(bytes / 1024).toFixed(0)} KB`;
}

export function UploadField({
  label,
  placeholder,
  name,
  undertext,
  multiple = false,
  maxFiles,
  maxSizeMB = 40,
  asDataUrl = false,
  error,
}: {
  label: string;
  placeholder: string;
  name: string;
  undertext: string | null;
  multiple?: boolean;
  maxFiles?: number;
  maxSizeMB?: number;
  asDataUrl?: boolean;
  error?: string;
}) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const isFirstRun = useRef(true);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      if (multiple) {
        try {
          const saved: string[] = JSON.parse(sessionStorage.getItem(name) ?? '[]');
          if (saved.length > 0) {
            setFiles(
              saved.map((s, i) =>
                asDataUrl ? { name: `Kép ${i + 1}`, size: 0, url: s } : { name: s, size: 0 },
              ),
            );
          }
        } catch {}
      } else {
        const saved = sessionStorage.getItem(name) ?? '';
        if (saved) setFiles([asDataUrl ? { name: 'Kép', size: 0, url: saved } : { name: saved, size: 0 }]);
      }
      return;
    }
    const serialize = (f: UploadedFile) => (asDataUrl ? (f.url ?? '') : f.name);
    try {
      sessionStorage.setItem(
        name,
        multiple ? JSON.stringify(files.map(serialize)) : serialize(files[0] ?? { name: '', size: 0 }),
      );
    } catch {
      // Most likely the sessionStorage quota was exceeded by the encoded images.
      setFileError('A képek túl nagyok. Tölts fel kevesebb vagy kisebb képet.');
    }
  }, [files, name, multiple, asDataUrl]);

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(event.target.files ?? []);
    event.target.value = '';
    if (!selected.length) return;

    const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];
    const maxBytes = maxSizeMB * 1024 * 1024;

    for (const file of selected) {
      if (!allowed.includes(file.type)) {
        setFileError('Csak PNG, JPG vagy SVG fájlok engedélyezettek.');
        return;
      }
      if (file.size > maxBytes) {
        setFileError(`Egy fájl mérete legfeljebb ${maxSizeMB} MB lehet.`);
        return;
      }
    }

    if (maxFiles && multiple && files.length + selected.length > maxFiles) {
      setFileError(`Maximum ${maxFiles} kép tölthető fel.`);
      return;
    }

    setFileError(null);

    let entries: UploadedFile[];
    if (asDataUrl) {
      try {
        entries = await Promise.all(
          selected.map(async (f) => ({ name: f.name, size: f.size, url: await fileToDataUrl(f) })),
        );
      } catch {
        setFileError('A kép feldolgozása nem sikerült. Próbáld újra!');
        return;
      }
    } else {
      entries = selected.map((f) => ({ name: f.name, size: f.size }));
    }

    if (multiple) {
      setFiles((prev) => [...prev, ...entries]);
    } else {
      setFiles([entries[0]!]);
    }
  };

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  const displayError = fileError ?? error;

  const uploadButton = (
    <>
      <input
        id={name}
        ref={inputRef}
        className='hidden'
        name={name}
        type='file'
        accept='.png,.jpg,.jpeg,.svg'
        multiple={multiple}
        onChange={handleChange}
      />
      <label
        htmlFor={name}
        className={`flex w-full cursor-pointer items-center justify-between rounded-md bg-[#153C53] px-4 py-2 text-white ${displayError ? 'ring-2 ring-red-400' : ''}`}
      >
        <span className='truncate'>{placeholder || label}</span>
        {ARROW_ICON}
      </label>
      <span className='pt-1 text-sm'>
        {undertext && <span className='text-gray-400'>{undertext}</span>}
        {displayError && <span className='ml-1 text-red-500'>{displayError}</span>}
      </span>
    </>
  );

  if (multiple) {
    return (
      <div className='flex flex-col gap-1'>
        {label && <label className='pb-1'>{label}</label>}
        <div className='flex items-start gap-6'>
          <div className='flex w-44 shrink-0 flex-col'>{uploadButton}</div>
          {files.length > 0 && asDataUrl && (
            <div className='flex flex-1 flex-wrap gap-2 pt-1'>
              {files.map((file, i) => (
                <div
                  key={i}
                  className='group relative h-20 w-20 overflow-hidden rounded-md border border-gray-200'
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={file.url}
                    alt={`Kép ${i + 1}`}
                    className='h-full w-full object-cover'
                  />
                  <button
                    type='button'
                    onClick={() => removeFile(i)}
                    className='absolute top-0.5 right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-black/50 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100'
                    aria-label='Kép törlése'
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
          {files.length > 0 && !asDataUrl && (
            <div className='grid flex-1 grid-cols-2 gap-x-8 gap-y-1 pt-1'>
              {files.map((file, i) => (
                <div
                  key={i}
                  className='grid min-w-0 grid-cols-[1fr_auto_auto] items-center gap-2 text-sm'
                >
                  <span className='truncate'>{file.name}</span>
                  <span className='whitespace-nowrap text-gray-500'>{formatSize(file.size)}</span>
                  <button
                    type='button'
                    onClick={() => removeFile(i)}
                    className='whitespace-nowrap text-gray-400 underline hover:text-red-500'
                  >
                    törlés
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className='mt-6 flex flex-col'>
      {label && <label className='pb-1'>{label}</label>}
      {uploadButton}
    </div>
  );
}

export function TagAutocompleteField({
  label,
  name,
  suggestions,
  placeholder,
  undertext,
  error,
}: {
  label: string;
  name: string;
  suggestions: string[];
  placeholder?: string;
  undertext?: string | null;
  error?: string;
}) {
  const [selected, setSelected] = useState<string[]>([]);
  const isFirstRun = useRef(true);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      const saved = sessionStorage.getItem(name) ?? '';
      if (saved) {
        const parts = saved
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);
        if (parts.length > 0) setSelected(parts);
      }
      return;
    }
    sessionStorage.setItem(name, selected.join(', '));
  }, [selected, name]);

  return (
    <div className='flex flex-col gap-2'>
      <label>{label}</label>
      <TagAutocomplete
        value={selected}
        onChange={setSelected}
        suggestions={suggestions}
        placeholder={placeholder}
        error={Boolean(error)}
      />
      {undertext && <span className='text-sm text-gray-400'>{undertext}</span>}
      {error && <span className='text-sm text-red-500'>{error}</span>}
    </div>
  );
}

export function SwitchField({
  label,
  options,
  name,
  defaultIndex = 0,
  onChange,
  error,
  multiSelect = false,
}: {
  label?: string;
  options: string[];
  name: string;
  defaultIndex?: number;
  onChange?: (value: string, index: number) => void;
  error?: string;
  multiSelect?: boolean;
}) {
  const [selected, setSelected] = useState(defaultIndex);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([defaultIndex]);
  const isFirstRun = useRef(true);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      const saved = sessionStorage.getItem(name);
      if (saved) {
        if (multiSelect) {
          try {
            const vals: string[] = JSON.parse(saved);
            const indices = vals.map((v) => options.indexOf(v)).filter((i) => i >= 0);
            if (indices.length > 0) setSelectedIndices(indices);
          } catch {
            // ignore invalid sessionStorage value
          }
        } else {
          const idx = options.indexOf(saved);
          if (idx >= 0) setSelected(idx);
        }
      }
      return;
    }
    if (multiSelect) {
      const vals = selectedIndices.map((i) => options[i]).filter(Boolean) as string[];
      sessionStorage.setItem(name, JSON.stringify(vals));
    } else {
      sessionStorage.setItem(name, options[selected] ?? '');
    }
  }, [selected, selectedIndices, name, options, multiSelect]);

  function handleSelect(index: number) {
    if (multiSelect) {
      setSelectedIndices((prev) =>
        prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
      );
    } else {
      setSelected(index);
      onChange?.(options[index]!, index);
    }
  }

  return (
    <div className='flex flex-col gap-1'>
      {label && <label className='pb-1'>{label}</label>}
      <div className='flex w-full overflow-hidden rounded-full border border-gray-300'>
        {options.map((option, index) => (
          <button
            key={option}
            type='button'
            onClick={() => handleSelect(index)}
            className={`flex-1 px-6 py-2 text-base font-medium transition-colors ${
              (multiSelect ? selectedIndices.includes(index) : selected === index)
                ? 'bg-cyan-900 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
      {error && <span className='pt-0.5 text-sm text-red-500'>{error}</span>}
    </div>
  );
}

export function DatePickerField({
  label,
  name,
  undertext,
  error,
  minDate,
  onValueChange,
}: {
  label: string;
  name: string;
  undertext?: string | null;
  error?: string;
  minDate?: string;
  onValueChange?: (value: string) => void;
}) {
  const [value, setValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState<{ year: number; month: number }>(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const isFirstRun = useRef(true);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      const saved = sessionStorage.getItem(name) ?? '';
      if (saved) {
        setValue(saved);
        onValueChange?.(saved);
        const parts = saved.split('-').map(Number);
        if (parts.length === 3) setViewDate({ year: parts[0]!, month: parts[1]! - 1 });
      }
      return;
    }
    sessionStorage.setItem(name, value);
  }, [value, name]);

  useEffect(() => {
    if (minDate && value && value < minDate) {
      setValue('');
      onValueChange?.('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minDate]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function prevMonth() {
    setViewDate((v) => ({
      year: v.month === 0 ? v.year - 1 : v.year,
      month: v.month === 0 ? 11 : v.month - 1,
    }));
  }

  function nextMonth() {
    setViewDate((v) => ({
      year: v.month === 11 ? v.year + 1 : v.year,
      month: v.month === 11 ? 0 : v.month + 1,
    }));
  }

  function handleDayClick(day: number) {
    const m = String(viewDate.month + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    const newVal = `${viewDate.year}-${m}-${d}`;
    setValue(newVal);
    onValueChange?.(newVal);
    setIsOpen(false);
  }

  function isDayDisabled(day: number) {
    if (!minDate) return false;
    const m = String(viewDate.month + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${viewDate.year}-${m}-${d}` < minDate;
  }

  function isDaySelected(day: number) {
    const m = String(viewDate.month + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return value === `${viewDate.year}-${m}-${d}`;
  }

  const daysInMonth = new Date(viewDate.year, viewDate.month + 1, 0).getDate();
  const firstDayOfWeek = (() => {
    const day = new Date(viewDate.year, viewDate.month, 1).getDay();
    return day === 0 ? 6 : day - 1;
  })();
  const cells: (number | null)[] = [
    ...Array<null>(firstDayOfWeek).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  function formatDisplay(v: string) {
    const [year, month, day] = v.split('-');
    return `${year}.${month}.${day}.`;
  }

  return (
    <div
      className='relative flex flex-col'
      ref={containerRef}
    >
      <label className='pb-1'>{label}</label>
      <button
        type='button'
        onClick={() => setIsOpen((v) => !v)}
        className={`flex items-center justify-between rounded-md border bg-white px-3 py-2 text-left transition-colors hover:border-gray-400 ${
          error ? 'border-red-400' : 'border-gray-300'
        }`}
      >
        <span className={value ? 'text-gray-900' : 'text-gray-400'}>
          {value ? formatDisplay(value) : 'Válassz dátumot'}
        </span>
        <CalendarIcon />
      </button>
      <input
        type='hidden'
        name={name}
        value={value}
      />

      {isOpen && (
        <div className='absolute top-full left-0 z-50 mt-1 w-72 rounded-xl border border-gray-200 bg-white p-4 shadow-xl'>
          <div className='mb-3 flex items-center justify-between'>
            <button
              type='button'
              onClick={prevMonth}
              className='flex h-7 w-7 items-center justify-center rounded-full text-lg text-gray-600 hover:bg-gray-100'
            >
              ‹
            </button>
            <span className='text-sm font-semibold text-gray-800'>
              {MONTH_NAMES[viewDate.month]} {viewDate.year}
            </span>
            <button
              type='button'
              onClick={nextMonth}
              className='flex h-7 w-7 items-center justify-center rounded-full text-lg text-gray-600 hover:bg-gray-100'
            >
              ›
            </button>
          </div>

          <div className='mb-1 grid grid-cols-7 text-center'>
            {DAY_NAMES.map((d, i) => (
              <div
                key={i}
                className='py-1 text-xs font-medium text-gray-400'
              >
                {d}
              </div>
            ))}
          </div>

          <div className='grid grid-cols-7'>
            {cells.map((day, i) => (
              <div
                key={i}
                className='flex items-center justify-center p-0.5'
              >
                {day !== null && (
                  <button
                    type='button'
                    disabled={isDayDisabled(day)}
                    onClick={() => handleDayClick(day)}
                    className={`h-8 w-8 rounded-full text-sm font-medium transition-colors ${
                      isDaySelected(day)
                        ? 'bg-cyan-900 text-white'
                        : isDayDisabled(day)
                          ? 'cursor-not-allowed text-gray-300'
                          : 'text-gray-700 hover:bg-cyan-50'
                    }`}
                  >
                    {day}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {undertext && <span className='pt-1 text-sm text-gray-400'>{undertext}</span>}
      {error && <span className='pt-0.5 text-sm text-red-500'>{error}</span>}
    </div>
  );
}

export function TimePickerField({
  label,
  name,
  undertext,
  error,
  minTime,
  onValueChange,
}: {
  label: string;
  name: string;
  undertext?: string | null;
  error?: string;
  minTime?: string;
  onValueChange?: (value: string) => void;
}) {
  const [value, setValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const hourListRef = useRef<HTMLDivElement>(null);
  const minuteListRef = useRef<HTMLDivElement>(null);
  const isFirstRun = useRef(true);

  const [selectedHour, selectedMinute] = value ? value.split(':') : ['', ''];

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      const saved = sessionStorage.getItem(name) ?? '';
      if (saved) {
        setValue(saved);
        onValueChange?.(saved);
      }
      return;
    }
    sessionStorage.setItem(name, value);
  }, [value, name]);

  useEffect(() => {
    if (minTime && value && value < minTime) {
      setValue('');
      onValueChange?.('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minTime]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      if (selectedHour && hourListRef.current) {
        hourListRef.current
          .querySelector(`[data-value="${selectedHour}"]`)
          ?.scrollIntoView({ block: 'center' });
      }
      if (selectedMinute && minuteListRef.current) {
        minuteListRef.current
          .querySelector(`[data-value="${selectedMinute}"]`)
          ?.scrollIntoView({ block: 'center' });
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [isOpen, selectedHour, selectedMinute]);

  function isHourDisabled(h: string) {
    if (!minTime) return false;
    const [minH] = minTime.split(':');
    return h < minH!;
  }

  function isMinuteDisabled(h: string, m: string) {
    if (!minTime) return false;
    const [minH, minM] = minTime.split(':');
    if (h > minH!) return false;
    if (h < minH!) return true;
    return m < minM!;
  }

  function handleHourClick(h: string) {
    if (isHourDisabled(h)) return;
    let minute = selectedMinute || '00';
    if (isMinuteDisabled(h, minute)) {
      minute = MINUTES.find((m) => !isMinuteDisabled(h, m)) ?? '00';
    }
    const newVal = `${h}:${minute}`;
    setValue(newVal);
    onValueChange?.(newVal);
  }

  function handleMinuteClick(m: string) {
    const hour = selectedHour || '00';
    if (isMinuteDisabled(hour, m)) return;
    const newVal = `${hour}:${m}`;
    setValue(newVal);
    onValueChange?.(newVal);
  }

  return (
    <div
      className='relative flex flex-col'
      ref={containerRef}
    >
      <label className='pb-1'>{label}</label>
      <button
        type='button'
        onClick={() => setIsOpen((v) => !v)}
        className={`flex items-center justify-between rounded-md border bg-white px-3 py-2 text-left transition-colors hover:border-gray-400 ${
          error ? 'border-red-400' : 'border-gray-300'
        }`}
      >
        <span className={value ? 'text-gray-900' : 'text-gray-400'}>
          {value || 'Válassz időpontot'}
        </span>
        <ClockIcon />
      </button>
      <input
        type='hidden'
        name={name}
        value={value}
      />

      {isOpen && (
        <div className='absolute top-full left-0 z-50 mt-1 flex overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl'>
          <div
            ref={hourListRef}
            className='h-48 w-16 overflow-y-auto border-r border-gray-100 py-1'
          >
            {HOURS.map((h) => (
              <button
                key={h}
                data-value={h}
                type='button'
                disabled={isHourDisabled(h)}
                onClick={() => handleHourClick(h)}
                className={`flex h-9 w-full items-center justify-center text-sm font-medium transition-colors ${
                  selectedHour === h
                    ? 'bg-cyan-900 text-white'
                    : isHourDisabled(h)
                      ? 'cursor-not-allowed text-gray-300'
                      : 'text-gray-700 hover:bg-cyan-50'
                }`}
              >
                {h}
              </button>
            ))}
          </div>

          <div className='flex items-center px-1 text-base font-bold text-gray-400'>:</div>

          <div
            ref={minuteListRef}
            className='h-48 w-16 overflow-y-auto py-1'
          >
            {MINUTES.map((m) => (
              <button
                key={m}
                data-value={m}
                type='button'
                disabled={isMinuteDisabled(selectedHour || '00', m)}
                onClick={() => handleMinuteClick(m)}
                className={`flex h-9 w-full items-center justify-center text-sm font-medium transition-colors ${
                  selectedMinute === m
                    ? 'bg-cyan-900 text-white'
                    : isMinuteDisabled(selectedHour || '00', m)
                      ? 'cursor-not-allowed text-gray-300'
                      : 'text-gray-700 hover:bg-cyan-50'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      )}

      {undertext && <span className='pt-1 text-sm text-gray-400'>{undertext}</span>}
      {error && <span className='pt-0.5 text-sm text-red-500'>{error}</span>}
    </div>
  );
}
