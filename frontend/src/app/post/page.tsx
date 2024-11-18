import { SidebarWithHeader } from '@/components/SidebarWIthHeader';
import { PostList } from '@/features/posts/PostList';

export default function Home() {
  return (
    <>
      <SidebarWithHeader>
        <PostList />
      </SidebarWithHeader>
    </>
  );
}
