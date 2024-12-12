import { AuthGuard } from '@/features/auth/AuthGuard';
import { LoginForm } from '@/features/auth/components/LoginForm';

export default function Home() {
  return (
    <AuthGuard allowedRoles={[]}>
      <LoginForm />
    </AuthGuard>
  );
}
