import { SidebarWithHeader } from '@/components/SidebarWIthHeader';
import { AdminList } from '@/features/admin/AdminList';

export default function Home() {
  return (
    <>
      <SidebarWithHeader>
        <AdminList />
      </SidebarWithHeader>
    </>
  );
}
