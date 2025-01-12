import { Suspense } from 'react';

import { SidebarWithHeader } from '@/components/SidebarWIthHeader';
import { PostList } from '@/features/post/PostList';
import { GetPostsSummaryRequest } from '@/gen/api';

type OptionalQueryBase = GetPostsSummaryRequest;
export type OptionalQuery = Partial<Record<keyof OptionalQueryBase, string>>;

export default function Home() {
  return (
    <>
      <SidebarWithHeader>
        <Suspense fallback={<div>Loading...</div>}>
          <PostList />
        </Suspense>
      </SidebarWithHeader>
    </>
  );
}
