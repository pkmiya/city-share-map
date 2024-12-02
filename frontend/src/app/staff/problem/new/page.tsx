import { SidebarWithHeader } from '@/components/SidebarWIthHeader';
import { NewProblemForm } from '@/features/problem/new/NewProblemForm';

export default function NewProblem() {
  return (
    <>
      <SidebarWithHeader>
        <NewProblemForm />
      </SidebarWithHeader>
    </>
  );
}
