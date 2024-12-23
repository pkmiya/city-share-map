import { SidebarWithHeader } from '@/components/SidebarWIthHeader';
import { AuthGuard } from '@/features/auth/AuthGuard';
import { UserRole } from '@/features/auth/constants/role';
import { UserHome } from '@/features/home/UserHome';

export default function Home() {
  return (
    <>
      {/* 一時的に全体公開に設定 */}
      <AuthGuard
        isPublic
        allowedRoles={[UserRole.Admin, UserRole.Staff, UserRole.Citizen]}
      >
        <SidebarWithHeader>
          <UserHome />
        </SidebarWithHeader>
      </AuthGuard>
    </>
  );
}
