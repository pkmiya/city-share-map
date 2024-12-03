import { SidebarWithHeader } from '@/components/SidebarWIthHeader';
import { AdminHome } from '@/features/admin-home/AdminHome';
import { AuthGuard } from '@/features/auth/AuthGuard';
import { UserRole } from '@/features/auth/constants/role';

export default function Home() {
  return (
    <>
      <AuthGuard allowedRoles={[UserRole.Admin]}>
        <SidebarWithHeader>
          <AdminHome />
        </SidebarWithHeader>
      </AuthGuard>
    </>
  );
}
