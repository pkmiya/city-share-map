'use client';

import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Select,
  Stack,
  Switch,
  Text,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { pagesPath } from '@/gen/$path';

type FormData = {
  fields: { name: string; type: string }[];
  isOpen: boolean;
  name: string;
};

export const EditProblemForm = ({ initialData }: { initialData: FormData }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: initialData,
  });

  const router = useRouter();
  const toast = useToast();

  const onSubmit = async (data: FormData) => {
    // TODO: APIつなぎこみ
    console.log('Updated Data:', data);
    await router.push(pagesPath.staff.problem.$url().pathname);
    toast({
      duration: 2000,
      isClosable: true,
      position: 'bottom-right',
      status: 'success',
      title: '課題を更新しました',
    });
  };

  return (
    <VStack p={4} w="full">
      <Text fontSize="x-large" fontWeight="bold" mb={4}>
        課題の編集
      </Text>
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack align="stretch" spacing={4}>
          <FormControl isInvalid={!!errors.name}>
            <FormLabel fontWeight="bold">課題の名前</FormLabel>
            <Input
              placeholder="課題名を入力"
              {...register('name', { required: '課題の名前は必須です' })}
            />
            <FormErrorMessage>
              {errors.name && errors.name.message}
            </FormErrorMessage>
          </FormControl>

          <FormControl
            alignItems="center"
            display="flex"
            isInvalid={!!errors.isOpen}
          >
            <FormLabel htmlFor="isOpen" mb="0">
              公開中
            </FormLabel>
            <Switch id="isOpen" {...register('isOpen')} />
            <FormErrorMessage>
              {errors.isOpen && errors.isOpen.message}
            </FormErrorMessage>
          </FormControl>

          <Box>
            <Text fontWeight="bold" mb={2}>
              記入項目（編集不可）
            </Text>
            <HStack color="gray.600" fontSize="sm" mb={2} spacing={4}>
              <Text w="200px">項目名</Text>
              <Text w="200px">データ種別</Text>
            </HStack>
            <Stack spacing={4}>
              {initialData.fields.map((field, index) => (
                <HStack key={index}>
                  <Input
                    isReadOnly
                    placeholder="項目名"
                    value={field.name}
                    w="200px"
                  />
                  <Select
                    isReadOnly
                    placeholder={field.type}
                    pointerEvents="none"
                    value={field.type}
                    w="200px"
                  />
                </HStack>
              ))}
            </Stack>
          </Box>

          <Button
            alignSelf="center"
            colorScheme="blue"
            mt={8}
            type="submit"
            w="fit-content"
          >
            更新する
          </Button>
        </VStack>
      </form>
    </VStack>
  );
};
