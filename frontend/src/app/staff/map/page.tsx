import { SidebarWithHeader } from '@/components/SidebarWIthHeader';
import { AdminMap } from '@/features/map/AdminMap';

export default function Home() {
  return (
    <>
      <SidebarWithHeader>
        <AdminMap h="80vh" p={4} w="80vw" />
      </SidebarWithHeader>
    </>
  );
}
