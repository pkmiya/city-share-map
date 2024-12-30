'use client';

import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  IconButton,
  Input,
  Link,
  Select,
  Stack,
  Switch,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useFieldArray, useForm } from 'react-hook-form';
import { FiTrash2 } from 'react-icons/fi';
import { IoAddCircleOutline } from 'react-icons/io5';

import { pagesPath } from '@/gen/$path';
import { ProblemCreate } from '@/gen/api';

import { useGetItemType } from '../hooks/useGetItemType';
import { usePostProblem } from '../hooks/usePostProblem';

export const NewProblemForm = () => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProblemCreate>({
    defaultValues: {
      description: '',
      isOpen: false,
      items: [{ name: '', required: false, typeId: undefined }],
      name: '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const { mutate } = usePostProblem();
  const { data: ItemType } = useGetItemType();

  const onSubmit = async (data: ProblemCreate) => {
    mutate({
      problemCreate: {
        description: data.description,
        isOpen: data.isOpen,
        items: data.items.map((field) => ({
          name: field.name,
          required: field.required,
          typeId: field.typeId,
        })),
        name: data.name,
      },
    });
  };

  return (
    <Box>
      <Link href={pagesPath.staff.problem.$url().pathname}>
        ＜ 課題一覧画面へ
      </Link>
      <VStack p={4} w="full">
        <Text fontSize="x-large" fontWeight="bold" mb={4}>
          課題の新規作成
        </Text>
        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack align="stretch" spacing={4}>
            <FormControl isInvalid={!!errors.name}>
              <FormLabel fontWeight="bold">課題の名前</FormLabel>
              <Input
                placeholder="例：ごみ"
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
                募集中
              </FormLabel>
              <Switch id="isOpen" {...register('isOpen')} />
              <FormErrorMessage>
                {errors.isOpen && errors.isOpen.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.description}>
              <FormLabel fontWeight="bold">課題の説明</FormLabel>
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
                記入項目
              </Text>
              <HStack color="gray.600" fontSize="sm" mb={2} spacing={4}>
                <Text w="200px">項目名</Text>
                <Text w="200px">データ種別</Text>
                <Text w="50px">必須</Text>
              </HStack>
              <Stack spacing={4}>
                {fields.map((field, index) => (
                  <FormControl
                    key={field.id}
                    isInvalid={!!errors.items?.[index]}
                  >
                    <HStack key={field.id}>
                      <Input
                        placeholder="項目名"
                        {...register(`items.${index}.name`, { required: true })}
                        w="200px"
                      />
                      <Select
                        {...register(`items.${index}.typeId`, {
                          required: true,
                        })}
                        w="200px"
                      >
                        <option disabled hidden selected value="">
                          項目を選択
                        </option>
                        {ItemType &&
                          ItemType.length > 0 &&
                          ItemType.map((item) => {
                            return (
                              <option key={item.id} value={item.id}>
                                {item.name}
                              </option>
                            );
                          })}
                      </Select>
                      <Switch
                        id="required"
                        {...register(`items.${index}.required`)}
                      />
                      {index > 0 && (
                        <IconButton
                          aria-label="削除"
                          icon={<FiTrash2 />}
                          onClick={() => remove(index)}
                        />
                      )}
                    </HStack>
                    <FormErrorMessage>
                      <Box w="200px">
                        {errors.items?.[index]?.name && '項目名は必須です'}
                      </Box>
                      <Box w="200px">
                        {errors.items?.[index]?.typeId &&
                          'データ種別を選択してください'}
                      </Box>
                    </FormErrorMessage>
                  </FormControl>
                ))}

                <Button
                  alignSelf="center"
                  leftIcon={<IoAddCircleOutline />}
                  w="fit-content"
                  onClick={() =>
                    append({ name: '', required: false, typeId: undefined })
                  }
                >
                  項目を追加
                </Button>
              </Stack>
            </Box>

            <Button
              alignSelf="center"
              colorScheme="blue"
              mt={8}
              type="submit"
              w="fit-content"
            >
              新規作成
            </Button>
          </VStack>
        </form>
      </VStack>
    </Box>
  );
};
