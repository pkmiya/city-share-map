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
  Switch,
  VStack,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';

import { PasswordInput } from '@/features/auth/components/PasswordInput';
import { UserCreate } from '@/gen/api';

type AdminAddModalProps = {
  isOpen: boolean;
  isPending?: boolean;
  onClose: () => void;
  onSubmit: (data: UserCreate) => void;
};

export const AdminAddModal = ({
  isOpen,
  onClose,
  onSubmit,
  isPending,
}: AdminAddModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UserCreate>();

  const handleFormSubmit = (data: UserCreate) => {
    onSubmit(data);
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>新規管理者ユーザを追加</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form id="admin-form" onSubmit={handleSubmit(handleFormSubmit)}>
            <VStack align="stretch" spacing={4}>
              <FormControl isInvalid={!!errors.department}>
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

              <FormControl isInvalid={!!errors.fullName}>
                <FormLabel>氏名</FormLabel>
                <Input
                  placeholder="山田 太郎"
                  {...register('fullName', {
                    required: '氏名は必須項目です。',
                  })}
                />
                <FormErrorMessage>{errors.fullName?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.email}>
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

              <PasswordInput<UserCreate>
                error={errors.password?.message}
                minLength={8}
                name="password"
                register={register}
              />

              {/* TODO: BUG: isActiveをFalseにしても、Trueでデータが送信されてしまう */}
              <FormControl>
                <Switch {...register('isActive')}>利用可能にする</Switch>
              </FormControl>

              <FormControl>
                <Switch {...register('isSuperuser')}>高度な管理者権限</Switch>
              </FormControl>
            </VStack>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="teal"
            form="admin-form"
            isLoading={isPending}
            mr={3}
            type="submit"
          >
            追加
          </Button>
          <Button onClick={onClose}>キャンセル</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
