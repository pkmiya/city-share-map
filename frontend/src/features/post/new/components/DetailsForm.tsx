import {
  Box,
  Button,
  Center,
  FormControl,
  FormLabel,
  Input,
  Switch,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

import { usePostContext } from '@/context/postProvider';
import { ItemType } from '@/features/problem/new/data';

import { Field } from '../types';

export const DetailsForm = ({ onBack }: { onBack: () => void }) => {
  const router = useRouter();
  const toast = useToast();
  const { formData, setFormData } = usePostContext();

  const problem = formData.problem || '';
  const location = formData.location || { lat: 0, lng: 0 };
  const address = formData.address || '';
  const fields = formData.fields || [];

  const handleChange = (name: string, value: any) => {
    setFormData({
      fieldValues: {
        ...formData.fieldValues,
        [name]: value,
      },
    });
  };

  const handleSubmit = async () => {
    const hasEmptyFields = fields.some((field) => {
      const value = formData.fieldValues[field.name];
      return (
        value === null || // initially null for photo
        (field.type === ItemType.Text && (!value || value.trim() === '')) // empty string for text
      );
    });

    if (hasEmptyFields) {
      alert('すべての項目を入力してください');
      return;
    }

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
        <Text>
          座標: 緯度 {parseFloat(location.lat.toFixed(5))}, 経度{' '}
          {parseFloat(location.lng.toFixed(5))}
        </Text>
        <Text>住所: {address}</Text>
      </Box>

      {fields.map((field: Field) => {
        const value = formData.fieldValues[field.name];
        return (
          <FormControl key={field.name} mt="4">
            <FormLabel>{field.name}</FormLabel>
            {field.type === ItemType.Text && (
              <Input
                placeholder={field.name}
                value={value}
                onChange={(e) => handleChange(field.name, e.target.value)}
              />
            )}
            {field.type === ItemType.DateTime && (
              <Input
                type="datetime-local"
                value={value}
                onChange={(e) => handleChange(field.name, e.target.value)}
              />
            )}
            {field.type === ItemType.Photo && (
              <Input
                accept="image/*"
                type="file"
                onChange={(e) =>
                  handleChange(field.name, e.target.files?.[0] || null)
                }
              />
            )}
            {field.type === ItemType.OnOff && (
              <Switch
                isChecked={!!value}
                onChange={(e) => handleChange(field.name, e.target.checked)}
              />
            )}
          </FormControl>
        );
      })}
      <Center>
        <Button mr="2" mt="4" onClick={onBack}>
          戻る
        </Button>
        <Button colorScheme="teal" mt="4" onClick={handleSubmit}>
          送信
        </Button>
      </Center>
    </Box>
  );
};
