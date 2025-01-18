import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  VStack,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';

import { User, UserUpdateMe } from '@/gen/api';

type UserUpdateMeForm = UserUpdateMe & {
  confirmPassword: string;
};

type AdminSelfEditModalProps = {
  defaultValues: User;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UserUpdateMe) => void;
};

export const AdminSelfEditModal = ({
  isOpen,
  onClose,
  onSubmit,
  defaultValues,
}: AdminSelfEditModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<UserUpdateMeForm>({
    defaultValues: { ...defaultValues, confirmPassword: '' },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const handleClickPassword = () => setShowPassword(!showPassword);
  const handleClickConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  const handleFormSubmit = (data: UserUpdateMe) => {
    const hasChanges = (
      Object.keys(defaultValues) as (keyof UserUpdateMe)[]
    ).some((key) => defaultValues[key as keyof User] !== data[key]);

    if (!hasChanges) {
      reset();
      onClose();
      return;
    }

    onSubmit(data);
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>登録情報を編集</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form id="admin-edit-form" onSubmit={handleSubmit(handleFormSubmit)}>
            <VStack align="stretch" spacing={4}>
              <FormControl isInvalid={!!errors.department}>
                <FormLabel>部署</FormLabel>
                <Input
                  placeholder="営業部"
                  {...register('department', {
                    required: '部署は必須項目です。',
                  })}
                  onChange={(e) => setValue('department', e.target.value)}
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
                  onChange={(e) => setValue('fullName', e.target.value)}
                />
                <FormErrorMessage>{errors.fullName?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.email}>
                <FormLabel htmlFor="email">メールアドレス</FormLabel>
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
                  onChange={(e) => setValue('email', e.target.value)}
                />
                <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!errors.password}>
                <FormLabel htmlFor="password">パスワード</FormLabel>
                <InputGroup>
                  <Input
                    placeholder="パスワード"
                    type={showPassword ? 'text' : 'password'}
                    {...register('password', {
                      minLength: {
                        message: 'パスワードは8文字以上である必要があります。',
                        value: 8,
                      },
                      required: 'パスワードは必須項目です。',
                    })}
                    onChange={(e) => setValue('password', e.target.value)}
                  />
                  <InputRightElement width="4.5rem">
                    <IconButton
                      aria-label="toggle password visibility"
                      bg="transparent"
                      icon={showPassword ? <IoMdEyeOff /> : <IoMdEye />}
                      onClick={handleClickPassword}
                    />
                  </InputRightElement>
                </InputGroup>

                <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!errors.confirmPassword}>
                <FormLabel htmlFor="password">パスワード（再入力）</FormLabel>
                <InputGroup>
                  <Input
                    placeholder="パスワードを再入力してください"
                    type={showConfirmPassword ? 'text' : 'password'}
                    {...register('confirmPassword', {
                      required: 'パスワードの再入力は必須項目です。',
                      validate: (value) =>
                        value === watch('password') ||
                        'パスワードが一致しません。',
                    })}
                    onChange={(e) =>
                      setValue('confirmPassword', e.target.value)
                    }
                  />
                  <InputRightElement width="4.5rem">
                    <IconButton
                      aria-label="toggle password confirm visibility"
                      bg="transparent"
                      icon={showConfirmPassword ? <IoMdEyeOff /> : <IoMdEye />}
                      onClick={handleClickConfirmPassword}
                    />
                  </InputRightElement>
                </InputGroup>

                <FormErrorMessage>
                  {errors.confirmPassword?.message}
                </FormErrorMessage>
              </FormControl>
            </VStack>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="teal"
            form="admin-edit-form"
            isLoading={isSubmitting}
            mr={3}
            type="submit"
          >
            更新
          </Button>
          <Button onClick={onClose}>キャンセル</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
