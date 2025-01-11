'use client';

import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Link,
  Text,
  VStack,
} from '@chakra-ui/react';
import React from 'react';
import { useForm } from 'react-hook-form';

import { appMetadata } from '@/config/metadata';
import { pagesPath } from '@/gen/$path';
import { LoginRequest } from '@/gen/api';

import { useLoginByAdmin } from '../hooks/useLoginByAdmin';

import { PasswordInput } from './PasswordInput';

export const LoginForm: React.FC = () => {
  const { mutate } = useLoginByAdmin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>();

  const onSubmit = (data: LoginRequest) => {
    mutate({
      loginRequest: data,
    });
  };

  return (
    <Box
      borderRadius="lg"
      borderWidth="1px"
      boxShadow="lg"
      maxW="400px"
      mt="50px"
      mx="auto"
      p="6"
      w="100%"
    >
      <Text mb={2} textAlign="center">
        {String(appMetadata.title)}
      </Text>
      <Text fontSize="lg" fontWeight="bold" mb="6" textAlign="center">
        自治体職員用ログイン
      </Text>
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack spacing="4">
          <FormControl isInvalid={!!errors.username}>
            <FormLabel htmlFor="id">メールアドレス</FormLabel>
            <Input
              id="username"
              placeholder="メールアドレスを入力"
              type="email"
              {...register('username', {
                required: 'メールアドレスは必須項目です',
              })}
            />
            <FormErrorMessage>
              {errors.username && errors.username.message}
            </FormErrorMessage>
          </FormControl>

          <PasswordInput<LoginRequest>
            error={errors.password?.message}
            name="password"
            register={register}
          />

          <Button colorScheme="teal" type="submit" width="full">
            ログイン
          </Button>
        </VStack>
      </form>
      <Link href={pagesPath.map.$url().pathname}>
        市民ユーザ向けホーム画面へ
      </Link>
    </Box>
  );
};
