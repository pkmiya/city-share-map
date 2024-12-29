'use client';

import { useParams } from 'next/navigation';

import { SidebarWithHeader } from '@/components/SidebarWIthHeader';
import { EditProblemForm } from '@/features/problem/edit/ProblemEditForm';
import { useGetProblemById } from '@/features/problem/hooks/useGetProblemById';

export default function ProblemEdit() {
  const searchParams = useParams();
  const problemId = Number(searchParams.problemId);
  const { data } = useGetProblemById(problemId);

  return (
    <>
      <SidebarWithHeader>
        {data && <EditProblemForm initialData={data} />}
      </SidebarWithHeader>
    </>
  );
}
