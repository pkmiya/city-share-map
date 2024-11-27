import { SidebarWithHeader } from '@/components/SidebarWIthHeader';
import { PostList } from '@/features/post/PostList';

export default function Home() {
  return (
    <>
      <SidebarWithHeader>
        <PostList />
      </SidebarWithHeader>
    </>
  );
}
