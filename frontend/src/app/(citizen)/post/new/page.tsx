import { SidebarWithHeader } from '@/components/SidebarWIthHeader';
import { NewPostForm } from '@/features/post/new/NewPostForm';

export default function Home() {
  return (
    <>
      <SidebarWithHeader>
        <NewPostForm />
      </SidebarWithHeader>
    </>
  );
}
