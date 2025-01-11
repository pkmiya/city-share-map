import { useToast } from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { postProblemApi } from '@/api/client';
import { postKeys } from '@/features/auth/constants/queryKey';
import { pagesPath } from '@/gen/$path';
import { DeletePostRequest } from '@/gen/api';
import queryClient from '@/lib/react-query';
import { getErrorStatus } from '@/utils/error';

export const useDeletePost = () => {
  const toast = useToast();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async (req: DeletePostRequest) => {
      const res = await postProblemApi.deletePost(req);
      return res.id;
    },
    onError: (error) => {
      console.error(error);
      toast({
        description: `${getErrorStatus(error)}エラー; ${error.message}`,
        duration: 2000,
        position: 'bottom-right',
        status: 'error',
        title: 'レポートの削除に失敗しました',
      });
    },
    onSuccess: async (res: string) => {
      queryClient.invalidateQueries({
        queryKey: [postKeys.posts],
      });
      queryClient.invalidateQueries({
        queryKey: [postKeys.post, res],
      });
      await router.push(pagesPath.map.$url().pathname);
      toast({
        duration: 2000,
        position: 'bottom-right',
        status: 'success',
        title: 'レポートの削除に成功しました',
      });
    },
  });

  return mutation;
};
