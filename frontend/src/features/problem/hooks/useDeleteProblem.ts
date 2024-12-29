import { useToast } from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { problemsApi } from '@/api/client';
import { problemKeys } from '@/features/auth/constants/queryKey';
import { pagesPath } from '@/gen/$path';
import { DeleteProblemRequest, Problem } from '@/gen/api';
import queryClient from '@/lib/react-query';
import { getErrorStatus } from '@/utils/error';

export const useDeleteProblem = () => {
  const toast = useToast();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async (req: DeleteProblemRequest) => {
      const res = await problemsApi.deleteProblem(req);
      return res;
    },
    onError: (error) => {
      console.error(error);
      toast({
        description: `${getErrorStatus(error)}エラー; ${error.message}`,
        duration: 2000,
        position: 'bottom-right',
        status: 'error',
        title: '課題の削除に失敗しました',
      });
    },
    onSuccess: async (res: Problem) => {
      queryClient.invalidateQueries({
        queryKey: problemKeys.problems,
      });
      queryClient.invalidateQueries({
        queryKey: [problemKeys.problem, res.id],
      });
      await router.push(pagesPath.staff.problem.$url().pathname);
      toast({
        duration: 2000,
        position: 'bottom-right',
        status: 'success',
        title: '課題の削除に成功しました',
      });
    },
  });

  return mutation;
};
