import { SidebarWithHeader } from '@/components/SidebarWIthHeader';
import { AdminMap } from '@/features/map/AdminMap';
import { GetPostsMapRequest } from '@/gen/api';

export type OptionalQuery = GetPostsMapRequest;

export default function Home() {
  return (
    <>
      <SidebarWithHeader>
        <AdminMap h="65vh" p={4} />
      </SidebarWithHeader>
    </>
  );
}
