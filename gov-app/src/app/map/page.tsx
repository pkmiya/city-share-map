import { MyMap } from '@/components/MyMap';
import { SidebarWithHeader } from '@/components/SidebarWIthHeader';

export default function Home() {
  return (
    <>
      <SidebarWithHeader>
        <MyMap h="80vh" p={4} w="80vw" />
      </SidebarWithHeader>
    </>
  );
}
