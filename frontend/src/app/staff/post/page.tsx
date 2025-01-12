import { SidebarWithHeader } from '@/components/SidebarWIthHeader';
import { PostList } from '@/features/post/PostList';
import { GetPostsSummaryRequest } from '@/gen/api';

export type OptionalQuery = GetPostsSummaryRequest;

export default function Home() {
  return (
    <>
      <SidebarWithHeader>
        <PostList />
      </SidebarWithHeader>
    </>
  );
}
