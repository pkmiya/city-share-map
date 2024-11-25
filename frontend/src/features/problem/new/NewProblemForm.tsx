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
  Select,
  Stack,
  Switch,
  Text,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useFieldArray, useForm } from 'react-hook-form';
import { FiTrash2 } from 'react-icons/fi';
import { IoAddCircleOutline } from 'react-icons/io5';

import { itemTypes } from './data';

type FormData = {
  fields: { name: string; type: string }[];
  isOpen: boolean;
  name: string;
};

export const NewProblemForm = () => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      fields: [{ name: '', type: '' }],
      isOpen: false,
      name: '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'fields',
  });

  const router = useRouter();
  const toast = useToast();

  const onSubmit = async (data: FormData) => {
    // TODO: APIつなぎこみ
    console.log('Submitted Data:', data);
    await router.push('/problem');
    toast({
      duration: 2000,
      isClosable: true,
      position: 'bottom-right',
      status: 'success',
      title: '課題を作成しました',
    });
  };

  return (
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

          <Box>
            <Text fontWeight="bold" mb={2}>
              記入項目
            </Text>
            <HStack color="gray.600" fontSize="sm" mb={2} spacing={4}>
              <Text w="200px">項目名</Text>
              <Text w="200px">データ種別</Text>
            </HStack>
            <Stack spacing={4}>
              {fields.map((field, index) => (
                <FormControl
                  key={field.id}
                  isInvalid={!!errors.fields?.[index]}
                >
                  <HStack key={field.id}>
                    <Input
                      placeholder="項目名"
                      {...register(`fields.${index}.name`, { required: true })}
                      w="200px"
                    />
                    <Select
                      {...register(`fields.${index}.type`, { required: true })}
                      w="200px"
                    >
                      <option disabled hidden selected value="">
                        項目を選択
                      </option>
                      {itemTypes.map((item) => (
                        <option key={item.id} value={item.name}>
                          {item.name}
                        </option>
                      ))}
                    </Select>
                    {index > 0 && (
                      <IconButton
                        aria-label="削除"
                        icon={<FiTrash2 />}
                        onClick={() => remove(index)}
                      />
                    )}
                  </HStack>
                  <FormErrorMessage>
                    {errors.fields?.[index]?.name && '項目名は必須です'}
                    {errors.fields?.[index]?.type &&
                      'データ種別を選択してください'}
                  </FormErrorMessage>
                </FormControl>
              ))}

              <Button
                alignSelf="center"
                leftIcon={<IoAddCircleOutline />}
                w="fit-content"
                onClick={() => append({ name: '', type: '' })}
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
  );
};
