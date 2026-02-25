export function AuthCard({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex max-w-xl min-w-sm flex-col gap-8 rounded-3xl bg-white px-6 pt-12 pb-6 shadow-2xl shadow-gray-900/50'>
      {children}
    </div>
  );
}

export function AuthPage({ children }: { children: React.ReactNode }) {
  return (
    <div className='main-gradient flex min-h-screen items-center justify-center overflow-hidden p-3'>
      {children}
    </div>
  );
}
