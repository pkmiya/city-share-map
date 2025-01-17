import { Suspense } from 'react';

import { LoadingText } from '@/components/LoadingText';
import { SidebarWithHeader } from '@/components/SidebarWIthHeader';
import { CitizenMap } from '@/features/map/CitizenMap';
import { GetPostsMapRequest } from '@/gen/api';

type OptionalQueryBase = GetPostsMapRequest;
export type OptionalQuery = Partial<Record<keyof OptionalQueryBase, string>>;

export default function Home() {
  return (
    <>
      <SidebarWithHeader>
        <Suspense fallback={<LoadingText />}>
          <CitizenMap />
        </Suspense>
      </SidebarWithHeader>
    </>
  );
}
