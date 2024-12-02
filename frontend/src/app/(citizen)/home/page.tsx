import { SidebarWithHeader } from '@/components/SidebarWIthHeader';
import { AuthGuard } from '@/features/auth/AuthGuard';
import { UserRole } from '@/features/auth/constants/role';
import { UserHome } from '@/features/home/UserHome';

export default function Home() {
  return (
    <>
      <AuthGuard allowedRoles={[UserRole.Staff]}>
        <SidebarWithHeader>
          <UserHome />
        </SidebarWithHeader>
      </AuthGuard>
    </>
  );
}
