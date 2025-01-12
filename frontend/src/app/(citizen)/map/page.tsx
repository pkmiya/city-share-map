import { SidebarWithHeader } from '@/components/SidebarWIthHeader';
import { CitizenMap } from '@/features/map/CitizenMap';
import { GetPostsMapRequest } from '@/gen/api';

export type OptionalQuery = GetPostsMapRequest;

export default function Home() {
  return (
    <>
      <SidebarWithHeader>
        <CitizenMap h="65vh" p={4} />
      </SidebarWithHeader>
    </>
  );
}
