'use client';

import {
  Box,
  Button,
  Divider,
  Stack,
  Table,
  TableContainer,
  Tag,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  useDisclosure,
} from '@chakra-ui/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaCheck } from 'react-icons/fa';
import { FiMap } from 'react-icons/fi';
import { MdOpenInNew } from 'react-icons/md';

import {
  DeletePostRequest,
  GetPostByIdRequest,
  GetPostsSummaryRequest,
  MarkAsSolvedRequest,
  MarkAsUnsolvedRequest,
  PostResponseBase,
} from '@/gen/api';

import { pagesPath } from '@/gen/$path';
import { FilterOptions } from './FilterOptions';
import { PostDetailModal } from './components/PostDetailModal';
import { useDeletePost } from './hooks/useDeletePost';
import { useGetPostById } from './hooks/useGetPostById';
import { useGetPosts } from './hooks/useGetPosts';
import { usePutPostAsResolved } from './hooks/usePutPostAsResolved';
import { usePutPostAsUnsolved } from './hooks/usePutPostAsUnsolved';

export const PostList = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [filters, setFilters] = useState<GetPostsSummaryRequest>({
    isOpen: searchParams.get('isOpen')
      ? searchParams.get('isOpen') === 'true'
      : null,
    isSolved: searchParams.get('isSolved')
      ? searchParams.get('isSolved') === 'true'
      : null,
    problemId: searchParams.get('problemId')
      ? Number(searchParams.get('problemId'))
      : null,
    userId: searchParams.get('userId') || null,
  });
  const { data, refetch: getPosts } = useGetPosts(filters);

  const handleFilterChange = <K extends keyof GetPostsSummaryRequest>(
    key: K,
    value: GetPostsSummaryRequest[K],
  ) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    // NOTE: クエリパラメータを更新
    const params = new URLSearchParams(searchParams.toString());
    if (value === null || value === undefined) {
      params.delete(key);
    } else {
      params.set(key, value.toString());
    }
    router.replace(`?${params.toString()}`);

    getPosts();
  };

  useEffect(() => {
    // NOTE: クエリ変更時にフィルタを同期
    const newFilters = {
      isOpen: searchParams.get('isOpen')
        ? searchParams.get('isOpen') === 'true'
        : null,
      isSolved: searchParams.get('isSolved')
        ? searchParams.get('isSolved') === 'true'
        : null,
      problemId: searchParams.get('problemId')
        ? Number(searchParams.get('problemId'))
        : null,
      userId: searchParams.get('userId') || null,
    };
    setFilters(newFilters);
  }, [searchParams]);

  const { mutate: markAsReSolved } = usePutPostAsResolved();
  const { mutate: markAsUnsolved } = usePutPostAsUnsolved();

  const handleMarkAsResolved = ({ problemId, postId }: MarkAsSolvedRequest) => {
    if (!confirm('この投稿を解決済にしますか？')) return;
    markAsReSolved({ postId, problemId });
  };

  const handleMarkAsUnsolved = ({
    problemId,
    postId,
  }: MarkAsUnsolvedRequest) => {
    if (!confirm('この投稿を未解決にしますか？')) return;
    markAsUnsolved({ postId, problemId });
  };

  const { isOpen, onClose, onOpen } = useDisclosure();
  const [selectedPost, setSelectedPost] = useState<GetPostByIdRequest | null>(
    null,
  );
  const { data: postDetails, refetch: getPostDetail } = useGetPostById({
    postId: selectedPost?.postId ?? '',
    problemId: selectedPost?.problemId ?? 0,
  });
  const { mutate: deletePost } = useDeletePost();

  const handleOpenModal = async (post: GetPostByIdRequest) => {
    setSelectedPost(post);
    await getPostDetail();
    onOpen();
  };

  const handleDeleteAdmin = (req: DeletePostRequest) => {
    if (!confirm('この投稿を削除しますか？')) return;
    deletePost({ postId: req.postId, problemId: req.problemId });
  };

  return (
    <Box w="full">
      <Text fontSize="x-large" fontWeight="bold">
        投稿一覧
      </Text>

      <FilterOptions filters={filters} onFilterChange={handleFilterChange} />

      <PostDetailModal
        data={postDetails ?? null}
        isOpen={isOpen}
        onClose={onClose}
        onDelete={handleDeleteAdmin}
      />

      <Divider />

      <Box>
        <Text fontSize="lg" fontWeight="bold" my={4}>
          検索結果
        </Text>
        <TableContainer>
          <Table maxW="40%" variant="simple">
            <Thead>
              <Tr>
                <Th w="1%">操作</Th>
                <Th minW="10%" width="auto">
                  課題名
                </Th>
                <Th>課題ID</Th>
                {/* TODO: 今後対応 */}
                {/* <Th w="1%">公開状態</Th> */}
                <Th w="1%">対応状況</Th>
                <Th w="1%">投稿ユーザ</Th>
                <Th w="1%">投稿ユーザID</Th>
                <Th w="1%">投稿日時</Th>
                <Th isNumeric w="1%">
                  投稿ID
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {data &&
                data.length > 0 &&
                data.map((post: PostResponseBase) => {
                  const { id, problem, user, isSolved, createdAt } = post;
                  return (
                    <Tr key={id}>
                      <Td>
                        <Stack direction="row" spacing={4}>
                          <Tooltip label="対応状況を編集できます">
                            <Button
                              colorScheme="blue"
                              leftIcon={<FaCheck />}
                              size="sm"
                              variant={isSolved ? 'solid' : 'outline'}
                              onClick={() =>
                                isSolved
                                  ? handleMarkAsUnsolved({
                                      postId: id,
                                      problemId: problem.id,
                                    })
                                  : handleMarkAsResolved({
                                      postId: id,
                                      problemId: problem.id,
                                    })
                              }
                            >
                              {isSolved ? '未解決にする' : '解決済にする'}
                            </Button>
                          </Tooltip>

                          <Tooltip label="投稿の詳細を表示します">
                            <Button
                              colorScheme="teal"
                              leftIcon={<MdOpenInNew />}
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleOpenModal({
                                  postId: id,
                                  problemId: problem.id,
                                })
                              }
                            >
                              詳細
                            </Button>
                          </Tooltip>

                          <Tooltip label="対応する課題の可視化マップを表示します">
                            <Button
                              colorScheme="teal"
                              leftIcon={<FiMap />}
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                router.push(
                                  pagesPath.staff.map.$url({
                                    query: { problemId: problem.id },
                                  }).path,
                                )
                              }
                            >
                              マップ
                            </Button>
                          </Tooltip>
                        </Stack>
                      </Td>
                      <Td>{problem.name}</Td>
                      <Td>{problem.id}</Td>
                      {/* TODO: 今後対応 */}
                      {/* <Td>
                        <Tag colorScheme={isOpen ? 'blue' : 'red'}>
                          {isOpen ? '公開' : '非公開'}
                        </Tag>
                      </Td> */}
                      <Td>
                        <Tag colorScheme={isSolved ? 'green' : 'red'}>
                          {isSolved ? '解決済' : '未解決'}
                        </Tag>
                      </Td>
                      <Td>{user?.name}</Td>
                      <Td>{user?.id}</Td>
                      <Td>{new Date(createdAt).toLocaleDateString()}</Td>
                      <Td>{id}</Td>
                    </Tr>
                  );
                })}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};
