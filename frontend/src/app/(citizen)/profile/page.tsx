import { SidebarWithHeader } from '@/components/SidebarWIthHeader';
import { PostListBySelf } from '@/features/profile/PostListBySelf';

export default function Home() {
  return (
    <>
      <SidebarWithHeader>
        <PostListBySelf />
      </SidebarWithHeader>
    </>
  );
}
