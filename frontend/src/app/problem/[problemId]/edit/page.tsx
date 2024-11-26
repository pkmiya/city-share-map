import { SidebarWithHeader } from '@/components/SidebarWIthHeader';
import { EditProblemForm } from '@/features/problem/edit/ProblemEditForm';
import { problem } from '@/features/problem/edit/data';

export default function ProblemEdit() {
  // TODO: APIつなぎこみ。例えば、以下
  // const problemId = router.query.problemId ?? '';
  // const problem = useGetProblemById(problemId);

  return (
    <>
      <SidebarWithHeader>
        <EditProblemForm initialData={problem} />
      </SidebarWithHeader>
    </>
  );
}
