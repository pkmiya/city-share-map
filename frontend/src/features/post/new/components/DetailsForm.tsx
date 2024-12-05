import {
  Box,
  Button,
  Center,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Switch,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { usePostContext } from '@/context/postProvider';
import { ItemType } from '@/features/problem/new/data';

import { Field } from '../types';

type Props = {
  onBack: () => void;
};

export const DetailsForm = ({ onBack }: Props) => {
  const router = useRouter();
  const toast = useToast();
  const { formData } = usePostContext();

  const problem = formData.problem.name || '';
  const address = formData.address || '';
  const fields = formData.fields || [];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ [key: string]: string }>({
    defaultValues: formData.fieldValues,
  });

  const onSubmit = async () => {
    // TODO: APIつなぎこみ
    toast({
      duration: 2000,
      isClosable: true,
      status: 'success',
      title: 'レポートを投稿しました',
    });
    console.log(formData);
    await router.push('/map');
  };

  return (
    <Box>
      <Box fontSize="sm" mt={4}>
        <Text>テーマ: {problem}</Text>
        <Text>住所: {address}</Text>
      </Box>

      <form onSubmit={handleSubmit(onSubmit)}>
        {fields.map((field: Field) => {
          const value = formData.fieldValues[field.name];
          const isInvalid = !!errors[field.name];
          return (
            <FormControl key={field.name} isInvalid={isInvalid} mt="4">
              <FormLabel>{field.name}</FormLabel>
              {field.type === ItemType.Text && (
                <Input
                  placeholder={field.name}
                  value={value}
                  {...register(field.name, {
                    required: `${field.name}を入力してください`,
                  })}
                />
              )}
              {field.type === ItemType.DateTime && (
                <Input
                  type="datetime-local"
                  {...register(field.name, {
                    required: `${field.name}を選択してください`,
                    validate: (value) => {
                      const selectedDate = new Date(value);
                      const currentDate = new Date();
                      return (
                        selectedDate < currentDate ||
                        `${field.name}には過去の日付を選択してください`
                      );
                    },
                  })}
                />
              )}
              {field.type === ItemType.Photo && (
                <Input
                  accept="image/*"
                  type="file"
                  {...register(field.name, {
                    required: `${field.name}をアップロードしてください`,
                  })}
                />
              )}
              {field.type === ItemType.OnOff && (
                <Switch
                  defaultChecked={formData.fieldValues[field.name] || false}
                  {...register(field.name)}
                />
              )}
              <FormErrorMessage>
                {errors[field.name] && errors[field.name]?.message}
              </FormErrorMessage>
            </FormControl>
          );
        })}
        <Center gap={4} mt={4}>
          <Button mt="4" onClick={onBack}>
            戻る
          </Button>
          <Button colorScheme="teal" mt="4" type="submit">
            送信
          </Button>
        </Center>
      </form>
    </Box>
  );
};
