import { SidebarWithHeader } from '@/components/SidebarWIthHeader';
import { MyMap } from '@/features/map/MyMap';

export default function Home() {
  return (
    <>
      <SidebarWithHeader>
        <MyMap h="80vh" p={4} w="80vw" />
      </SidebarWithHeader>
    </>
  );
}
