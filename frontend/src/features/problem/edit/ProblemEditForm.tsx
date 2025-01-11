'use client';

import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Link,
  Select,
  Stack,
  Switch,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';

import { pagesPath } from '@/gen/$path';
import { ProblemReadByID, ProblemUpdate } from '@/gen/api';

import { useDeleteProblem } from '../hooks/useDeleteProblem';
import { usePutProblem } from '../hooks/usePutProblem';

export const EditProblemForm = ({
  initialData,
}: {
  initialData: ProblemReadByID;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProblemReadByID>({
    defaultValues: initialData,
  });

  const { mutate: putProblem } = usePutProblem();
  const { mutate: deleteProblem } = useDeleteProblem();

  const onSubmit = async (data: ProblemUpdate) => {
    putProblem({
      id: initialData.id,
      problemUpdate: {
        description: data.description,
        isOpen: data.isOpen,
        name: data.name,
      },
    });
  };

  const onDelete = async () => {
    if (!confirm('課題を削除しますか？課題に対する全ての投稿も削除されます。'))
      return;
    deleteProblem({ id: initialData.id });
  };

  return (
    <Box>
      <Link href={pagesPath.staff.problem.$url().pathname}>
        ＜ 課題一覧画面へ
      </Link>
      <VStack p={4} w="full">
        <Text fontSize="x-large" fontWeight="bold" mb={4}>
          課題の編集
        </Text>
        <form
          onSubmit={handleSubmit((data) =>
            onSubmit({
              ...data,
              description: data.description ?? null,
              isOpen: data.isOpen ?? false,
            }),
          )}
        >
          <VStack align="stretch" spacing={4}>
            <FormControl isInvalid={!!errors.name}>
              <FormLabel fontWeight="bold">
                課題の名前
                {
                  <Text as="span" color="red.500">
                    *
                  </Text>
                }
              </FormLabel>
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

            <FormControl isInvalid={!!errors.description}>
              <FormLabel fontWeight="bold">
                課題の説明
                {
                  <Text as="span" color="red.500">
                    *
                  </Text>
                }
              </FormLabel>
              <Input
                placeholder="例：ごみの不法投棄など"
                {...register('description', {
                  required: '課題の説明は必須です',
                })}
              />
              <FormErrorMessage>
                {errors.description && errors.description.message}
              </FormErrorMessage>
            </FormControl>

            <Box>
              <Text fontWeight="bold" mb={2}>
                記入項目（編集不可）
              </Text>
              <HStack color="gray.600" fontSize="sm" mb={2} spacing={4}>
                <Text w="200px">項目名</Text>
                <Text w="200px">データ種別</Text>
                <Text w="50px">必須</Text>
              </HStack>
              <Stack spacing={4}>
                {initialData.items.map((field, index) => (
                  <HStack key={index}>
                    <Input
                      isReadOnly
                      placeholder="項目名"
                      value={field.name}
                      w="200px"
                    />
                    <Select
                      isReadOnly
                      placeholder={field.typeId?.toString()}
                      pointerEvents="none"
                      value={field.typeId}
                      w="200px"
                    />
                    <Switch
                      isDisabled
                      isReadOnly
                      id="required"
                      {...register(`items.${index}.required`)}
                    />
                  </HStack>
                ))}
              </Stack>
            </Box>

            <HStack alignSelf="center" mt={8}>
              <Button
                colorScheme="red"
                variant="outline"
                w="fit-content"
                onClick={onDelete}
              >
                削除する
              </Button>
              <Button colorScheme="blue" type="submit" w="fit-content">
                更新する
              </Button>
            </HStack>
          </VStack>
        </form>
      </VStack>
    </Box>
  );
};
