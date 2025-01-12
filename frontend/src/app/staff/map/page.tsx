import { Suspense } from 'react';

import { SidebarWithHeader } from '@/components/SidebarWIthHeader';
import { AdminMap } from '@/features/map/AdminMap';
import { GetPostsMapRequest } from '@/gen/api';

type OptionalQueryBase = GetPostsMapRequest;
export type OptionalQuery = Partial<Record<keyof OptionalQueryBase, string>>;

export default function Home() {
  return (
    <>
      <SidebarWithHeader>
        <Suspense fallback={<div>Loading...</div>}>
          <AdminMap h="65vh" p={4} />
        </Suspense>
      </SidebarWithHeader>
    </>
  );
}
