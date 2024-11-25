import { SidebarWithHeader } from '@/components/SidebarWIthHeader';
import { EditProblemForm } from '@/features/problem/edit/ProblemEditForm';
import { problem } from '@/features/problem/edit/data';

export default function ProblemEdit() {
  return (
    <>
      <SidebarWithHeader>
        <EditProblemForm initialData={problem} />
      </SidebarWithHeader>
    </>
  );
}
