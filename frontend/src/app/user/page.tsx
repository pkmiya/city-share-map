import { SidebarWithHeader } from '@/components/SidebarWIthHeader';
import { UserList } from '@/features/user/UserList';

export default function Home() {
  return (
    <>
      <SidebarWithHeader>
        <UserList />
      </SidebarWithHeader>
    </>
  );
}
