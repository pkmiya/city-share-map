import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Switch,
  VStack,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';

import { DeleteUserRequest, User, UserUpdate } from '@/gen/api';

type AdminEditModalProps = {
  defaultValues: User;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (userId: DeleteUserRequest) => void;
  onSubmit: (data: UserUpdate) => void;
};

export const AdminEditModal = ({
  isOpen,
  onClose,
  onDelete,
  onSubmit,
  defaultValues,
}: AdminEditModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<User>({
    defaultValues,
  });

  const handleFormSubmit = (data: UserUpdate) => {
    console.log(data);
    onSubmit(data);
    reset();
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm('本当に削除しますか？')) {
      onDelete({ userId: defaultValues.id ?? 0 });
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>管理者ユーザを編集</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form id="admin-edit-form" onSubmit={handleSubmit(handleFormSubmit)}>
            <VStack align="stretch" spacing={4}>
              <FormControl
                isDisabled
                isReadOnly
                isInvalid={!!errors.department}
              >
                <FormLabel>部署</FormLabel>
                <Input
                  placeholder="営業部"
                  {...register('department', {
                    required: '部署は必須項目です。',
                  })}
                />
                <FormErrorMessage>
                  {errors.department?.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl isDisabled isReadOnly isInvalid={!!errors.fullName}>
                <FormLabel>氏名</FormLabel>
                <Input
                  placeholder="山田 太郎"
                  {...register('fullName', {
                    required: '氏名は必須項目です。',
                  })}
                />
                <FormErrorMessage>{errors.fullName?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isDisabled isReadOnly isInvalid={!!errors.email}>
                <FormLabel>メールアドレス</FormLabel>
                <Input
                  placeholder="test@example.com"
                  type="email"
                  {...register('email', {
                    pattern: {
                      message: '正しいメールアドレスを入力してください。',
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    },
                    required: 'メールアドレスは必須項目です。',
                  })}
                />
                <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
              </FormControl>
              <FormControl>
                <Switch
                  isChecked={defaultValues.isActive ?? false}
                  {...register('isActive')}
                >
                  利用可能にする
                </Switch>
              </FormControl>
              <FormControl>
                <Switch
                  isChecked={defaultValues.isSuperuser ?? false}
                  {...register('isSuperuser')}
                >
                  高度な管理者権限
                </Switch>
              </FormControl>
            </VStack>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="red" onClick={handleDelete}>
            削除
          </Button>
          <Spacer />
          <Button
            colorScheme="teal"
            form="admin-edit-form"
            isLoading={isSubmitting}
            mr={3}
            type="submit"
          >
            保存
          </Button>
          <Button onClick={onClose}>キャンセル</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
