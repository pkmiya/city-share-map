import { SidebarWithHeader } from '@/components/SidebarWIthHeader';
import { CitizenMap } from '@/features/map/CitizenMap';

export default function Home() {
  return (
    <>
      <SidebarWithHeader>
        <CitizenMap h="70vh" p={4} w="80vw" />
      </SidebarWithHeader>
    </>
  );
}
