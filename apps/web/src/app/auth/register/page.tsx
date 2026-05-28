import { AuthCard, AuthPage } from '@/components/auth/ui';
import { RegisterForm } from '@/components/auth/register-form';

export default function RegisterPage() {
  return (
    <AuthPage>
      <AuthCard>
        <RegisterForm />
      </AuthCard>
    </AuthPage>
  );
}
