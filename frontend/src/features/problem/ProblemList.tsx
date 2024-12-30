'use client';

import {
  Box,
  Button,
  HStack,
  Spacer,
  Stack,
  Table,
  TableContainer,
  Tag,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { FaList } from 'react-icons/fa';
import { FiMap } from 'react-icons/fi';
import { MdEdit } from 'react-icons/md';

import { pagesPath } from '@/gen/$path';

import { useGetProblems } from './hooks/useGetProblems';

export const ProblemList = () => {
  const router = useRouter();

  const { data } = useGetProblems({});

  return (
    <Box w="full">
      <Text fontSize="x-large" fontWeight="bold">
        課題一覧
      </Text>
      <Box m="auto" w="80vw">
        <HStack my={4}>
          <Spacer />
          <Text mr={4}>合計課題件数：{data ? data.length : 0}件</Text>
          <Button
            colorScheme="teal"
            onClick={() => {
              router.push(pagesPath.staff.problem.new.$url().pathname);
            }}
          >
            新規課題
          </Button>
        </HStack>

        {data && data.length > 0 && (
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>操作</Th>
                  <Th>課題名</Th>
                  <Th>公開状態</Th>
                  {/* NOTE: updatedAt型が追加されたら対応 */}
                  {/* <Th w="1%">更新日時</Th> */}
                  <Th>投稿数</Th>
                  <Th>課題ID</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data.map((problem) => {
                  const { id, name, isOpen, postCount } = problem;
                  return (
                    <Tr key={id}>
                      <Td>
                        <Stack direction="row" spacing={4}>
                          <Button
                            colorScheme="teal"
                            leftIcon={<MdEdit />}
                            size="sm"
                            variant="solid"
                            onClick={() => {
                              router.push(
                                pagesPath.staff.problem
                                  ._problemId(id)
                                  .edit.$url().path,
                              );
                            }}
                          >
                            編集
                          </Button>
                          <Button
                            colorScheme="teal"
                            leftIcon={<FaList />}
                            size="sm"
                            variant="outline"
                          >
                            投稿
                          </Button>
                          <Button
                            colorScheme="teal"
                            leftIcon={<FiMap />}
                            size="sm"
                            variant="outline"
                          >
                            マップ
                          </Button>
                        </Stack>
                      </Td>
                      <Td>{name}</Td>
                      <Td>
                        <Tag colorScheme={isOpen ? 'blue' : 'red'}>
                          {isOpen ? '公開' : '非公開'}
                        </Tag>
                      </Td>
                      {/* NOTE: updatedAt型が追加されたら対応 */}
                      {/* <Td>{updatedAt.toLocaleDateString()}</Td> */}
                      <Td isNumeric>{postCount}</Td>
                      <Td isNumeric>{id}</Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Box>
  );
};
