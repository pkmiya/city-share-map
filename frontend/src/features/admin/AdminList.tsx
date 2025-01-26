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
  Tooltip,
  Tr,
  useDisclosure,
} from '@chakra-ui/react';
import { useState } from 'react';
import { MdEdit } from 'react-icons/md';

import { LoadingScreen } from '@/components/LoadingScreen';
import { DeleteUserRequest, User, UserCreate, UserUpdate } from '@/gen/api';

import { AdminAddModal } from './components/AdminAddModal';
import { AdminEditModal } from './components/AdminEditModal';
import { useDeleteAdmin } from './hooks/useDeleteAdmin';
import { useGetAdmins } from './hooks/useGetAdmins';
import { usePostAdmin } from './hooks/usePostAdmin';
import { usePutAdminById } from './hooks/usePutAdminById';

export const AdminList = () => {
  const {
    isOpen: isAddOpen,
    onClose: onAddClose,
    onOpen: onAddOpen,
  } = useDisclosure();
  const {
    isOpen: isEditOpen,
    onClose: onEditClose,
    onOpen: onEditOpen,
  } = useDisclosure();
  const [selectedAdmin, setSelectedAdmin] = useState<User | null>(null);

  const { data, isLoading } = useGetAdmins();
  const { mutate: addAdmin, isPending: isPendingPost } = usePostAdmin();
  const { mutate: editAdmin, isPending: isPendingPut } = usePutAdminById();
  const { mutate: deleteAdmin, isPending: isPendingDelete } = useDeleteAdmin();

  const handleAddAdmin = (newAdmin: UserCreate) => {
    addAdmin({ userCreate: newAdmin });
  };

  const handleEditAdmin = (updatedAdmin: UserUpdate) => {
    editAdmin({ userId: selectedAdmin?.id ?? 0, userUpdate: updatedAdmin });
  };

  const handleOpenEditModal = (admin: User) => {
    setSelectedAdmin(admin);
    onEditOpen();
  };

  const handleDeleteAdmin = (data: DeleteUserRequest) => {
    deleteAdmin({ userId: data.userId });
  };

  return (
    <Box w="full">
      <Text fontSize="x-large" fontWeight="bold">
        管理者ユーザ一覧
      </Text>

      <Box m="auto" w="80vw">
        <HStack my={4}>
          <Spacer />
          <Text mr={4}>合計管理者ユーザ数：{data ? data.length : 0}人</Text>
          <Button colorScheme="teal" onClick={onAddOpen}>
            新規管理者ユーザ
          </Button>
        </HStack>

        <AdminAddModal
          isOpen={isAddOpen}
          onClose={onAddClose}
          onSubmit={handleAddAdmin}
        />

        {selectedAdmin && (
          <AdminEditModal
            defaultValues={selectedAdmin}
            isOpen={isEditOpen}
            isPendingDelete={isPendingDelete}
            isPendingPut={isPendingPut}
            onClose={onEditClose}
            onDelete={handleDeleteAdmin}
            onSubmit={handleEditAdmin}
          />
        )}

        {isLoading && <LoadingScreen />}
        {data?.length == 0 && (
          <Text fontSize="large" textAlign="center">
            管理者ユーザが見つかりませんでした
          </Text>
        )}
        {data && data.length > 0 && (
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>操作</Th>
                  <Th>ID</Th>
                  <Th>メールアドレス</Th>
                  <Th>名前</Th>
                  <Th>所属部署</Th>
                  <Th>利用状況</Th>
                  <Th>権限レベル</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data.map((admin) => {
                  const {
                    id,
                    email,
                    department,
                    fullName,
                    isActive,
                    isSuperuser,
                  } = admin;
                  return (
                    <Tr key={id}>
                      <Td>
                        <Stack direction="row" spacing={4}>
                          <Tooltip label="この管理者ユーザの情報を編集します">
                            <Button
                              colorScheme="teal"
                              leftIcon={<MdEdit />}
                              size="sm"
                              variant="solid"
                              onClick={() => handleOpenEditModal(admin)}
                            >
                              編集
                            </Button>
                          </Tooltip>
                        </Stack>
                      </Td>
                      <Td>{id}</Td>
                      <Td>{email}</Td>
                      <Td>{fullName}</Td>
                      <Td>{department}</Td>
                      <Td>
                        {isActive}
                        <Tag colorScheme={isActive ? 'blue' : 'gray'}>
                          {isActive ? '利用可能' : '利用停止'}
                        </Tag>
                      </Td>
                      <Td>
                        {isSuperuser}
                        <Tag colorScheme={isSuperuser ? 'red' : 'gray'}>
                          {isSuperuser ? '管理者' : '一般ユーザ'}
                        </Tag>
                      </Td>
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
