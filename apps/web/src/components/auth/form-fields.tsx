export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className='mt-1 text-xs text-red-500'>{message}</p>;
}

export function inputClass(hasError?: string) {
  return `focus:border-foreground w-full rounded-md border px-3 py-2 focus:outline-none ${
    hasError ? 'border-red-400 bg-red-50' : 'border-gray-300'
  }`;
}
