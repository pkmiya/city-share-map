import { useToast } from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';

import { postProblemApi } from '@/api/client';
import { postKeys } from '@/features/auth/constants/queryKey';
import { MarkAsSolvedRequest } from '@/gen/api';
import queryClient from '@/lib/react-query';
import { getErrorStatus } from '@/utils/error';

export const usePutPostAsResolved = () => {
  const toast = useToast();

  const mutation = useMutation({
    mutationFn: async (req: MarkAsSolvedRequest) => {
      const res = await postProblemApi.markAsSolved(req);
      return res.id;
    },
    onError: (error) => {
      console.error(error);
      toast({
        description: `${getErrorStatus(error)}エラー; ${error.message}`,
        duration: 2000,
        position: 'bottom-right',
        status: 'error',
        title: '対応状況の更新に失敗しました',
      });
    },
    onSuccess: async (res: string) => {
      queryClient.invalidateQueries({
        queryKey: [postKeys.posts],
      });
      queryClient.invalidateQueries({
        queryKey: [postKeys.post, res],
      });
      toast({
        duration: 2000,
        position: 'bottom-right',
        status: 'success',
        title: '対応状況の更新に成功しました',
      });
    },
  });

  return mutation;
};
