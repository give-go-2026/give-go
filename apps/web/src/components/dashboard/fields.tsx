'use client';

export function Field({
  label,
  value,
  onChange,
  placeholder,
  undertext,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  undertext?: string;
}) {
  return (
    <div className='flex flex-col'>
      <label className='pb-1 text-sm'>{label}</label>
      <input
        className='rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-900/20'
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {undertext && <span className='pt-1 text-xs text-gray-400'>{undertext}</span>}
    </div>
  );
}

export function TextareaField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div className='flex flex-col'>
      <label className='pb-1 text-sm'>{label}</label>
      <textarea
        className='min-h-36 w-full resize-y rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-900/20'
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={6}
        maxLength={1000}
      />
    </div>
  );
}

export function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div className='flex flex-col'>
      <label className='pb-1 text-sm'>{label}</label>
      <select
        className='rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-900/20'
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((o) => (
          <option
            key={o}
            value={o}
          >
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

export function SwitchInput(
  props:
    | { options: string[]; value: string; onChange: (v: string) => void; multiSelect?: false }
    | { options: string[]; value: string[]; onChange: (v: string[]) => void; multiSelect: true },
) {
  const { options, multiSelect } = props;

  function isActive(option: string) {
    return multiSelect
      ? (props.value as string[]).includes(option)
      : props.value === option;
  }

  function handleClick(option: string) {
    if (multiSelect) {
      const current = props.value as string[];
      const next = current.includes(option)
        ? current.filter((v) => v !== option)
        : [...current, option];
      (props.onChange as (v: string[]) => void)(next);
    } else {
      (props.onChange as (v: string) => void)(option);
    }
  }

  return (
    <div className='flex overflow-hidden rounded-full border border-gray-300'>
      {options.map((option) => (
        <button
          key={option}
          type='button'
          onClick={() => handleClick(option)}
          className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
            isActive(option) ? 'bg-cyan-900 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export function TagInput({
  tags,
  value,
  onChange,
}: {
  tags: string[];
  value: string[];
  onChange: (v: string[]) => void;
}) {
  function toggle(tag: string) {
    onChange(value.includes(tag) ? value.filter((t) => t !== tag) : [...value, tag]);
  }

  return (
    <div className='flex flex-wrap gap-2'>
      {tags.map((tag) => (
        <button
          key={tag}
          type='button'
          onClick={() => toggle(tag)}
          className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
            value.includes(tag)
              ? 'border-cyan-900 bg-cyan-900 text-white'
              : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}
