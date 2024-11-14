import { SidebarWithHeader } from '@/components/SidebarWIthHeader';
import { ProblemList } from '@/features/problem/ProblemList';

export default function Home() {
  return (
    <>
      <SidebarWithHeader>
        <ProblemList />
      </SidebarWithHeader>
    </>
  );
}
