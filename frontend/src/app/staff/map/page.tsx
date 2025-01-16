import { Suspense } from 'react';

import { LoadingText } from '@/components/LoadingText';
import { SidebarWithHeader } from '@/components/SidebarWIthHeader';
import { AdminMap } from '@/features/map/AdminMap';
import { GetPostsMapRequest } from '@/gen/api';

type OptionalQueryBase = GetPostsMapRequest;
export type OptionalQuery = Partial<Record<keyof OptionalQueryBase, string>>;

export default function Home() {
  return (
    <>
      <SidebarWithHeader>
        <Suspense fallback={<LoadingText />}>
          <AdminMap />
        </Suspense>
      </SidebarWithHeader>
    </>
  );
}
