'use client';

import { useEffect, useRef, useState } from 'react';

type FormFieldType = 'number' | 'string';

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
  const [item, setItem] = useState(() =>
    typeof window !== 'undefined' ? (localStorage.getItem(name) ?? '') : '',
  );

  useEffect(() => {
    localStorage.setItem(name, item);
  }, [item, name]);

  return (
    <div className='flex flex-col'>
      <label className='pb-1'>{label}</label>
      <input
        className={`rounded-md border px-3 py-2 ${error ? 'border-red-400' : 'border-gray-300'}`}
        name={name}
        type={type === 'number' ? 'number' : 'text'}
        placeholder={placeholder}
        value={item}
        onChange={(event) => setItem(event.target.value)}
      />
      {undertext && <span className='pt-1 text-sm text-gray-400'>{undertext}</span>}
      {error && <span className='pt-0.5 text-sm text-red-500'>{error}</span>}
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
  const [item, setItem] = useState(() =>
    typeof window !== 'undefined' ? (localStorage.getItem(name) ?? '') : '',
  );

  useEffect(() => {
    localStorage.setItem(name, item);
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
  const [item, setItem] = useState(() =>
    typeof window !== 'undefined' ? (localStorage.getItem(name) ?? '') : '',
  );

  useEffect(() => {
    localStorage.setItem(name, item);
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

type UploadedFile = { name: string; size: number };

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
  error,
}: {
  label: string;
  placeholder: string;
  name: string;
  undertext: string | null;
  multiple?: boolean;
  maxFiles?: number;
  maxSizeMB?: number;
  error?: string;
}) {
  const [files, setFiles] = useState<UploadedFile[]>(() => {
    if (typeof window === 'undefined') return [];
    if (multiple) {
      try {
        const saved: string[] = JSON.parse(localStorage.getItem(name) ?? '[]');
        return saved.map((n) => ({ name: n, size: 0 }));
      } catch {
        return [];
      }
    } else {
      const saved = localStorage.getItem(name) ?? '';
      return saved ? [{ name: saved, size: 0 }] : [];
    }
  });
  const [fileError, setFileError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    localStorage.setItem(
      name,
      multiple ? JSON.stringify(files.map((f) => f.name)) : (files[0]?.name ?? ''),
    );
  }, [files, name, multiple]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(event.target.files ?? []);
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

    setFileError(null);

    if (multiple) {
      setFiles((prev) => {
        const merged = [...prev, ...selected.map((f) => ({ name: f.name, size: f.size }))];
        if (maxFiles && merged.length > maxFiles) {
          setFileError(`Maximum ${maxFiles} kép tölthető fel.`);
          return prev;
        }
        return merged;
      });
    } else {
      setFiles([{ name: selected[0]!.name, size: selected[0]!.size }]);
    }

    event.target.value = '';
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
          {files.length > 0 && (
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

export function TagField({
  label,
  tags,
  name,
  undertext,
  error,
}: {
  label: string;
  tags: string[];
  name: string;
  undertext?: string | null;
  error?: string;
}) {
  const [selected, setSelected] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      return JSON.parse(localStorage.getItem(name) ?? '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(name, JSON.stringify(selected));
  }, [selected, name]);

  function toggle(tag: string) {
    setSelected((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  }

  return (
    <div className='flex flex-col gap-2'>
      <label>{label}</label>
      <div className='flex flex-row flex-wrap gap-2'>
        {tags.map((tag) => (
          <button
            key={tag}
            type='button'
            onClick={() => toggle(tag)}
            className={`rounded-full border px-5 py-2.5 text-base font-medium transition-colors ${
              selected.includes(tag)
                ? 'border-cyan-900 bg-cyan-900 text-white'
                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
      {undertext && <span className='text-sm text-gray-400'>{undertext}</span>}
      {error && <span className='text-sm text-red-500'>{error}</span>}
      <input type='hidden' name={name} value={JSON.stringify(selected)} />
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
}: {
  label?: string;
  options: string[];
  name: string;
  defaultIndex?: number;
  onChange?: (value: string, index: number) => void;
  error?: string;
}) {
  const [selected, setSelected] = useState(() => {
    if (typeof window === 'undefined') return defaultIndex;
    const saved = localStorage.getItem(name);
    if (saved) {
      const idx = options.indexOf(saved);
      return idx >= 0 ? idx : defaultIndex;
    }
    return defaultIndex;
  });

  useEffect(() => {
    localStorage.setItem(name, options[selected] ?? '');
  }, [selected, name, options]);

  function handleSelect(index: number) {
    setSelected(index);
    onChange?.(options[index]!, index);
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
              selected === index
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
