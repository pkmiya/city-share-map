import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Switch,
  Text,
} from '@chakra-ui/react';
import { useState } from 'react';

import { ItemType } from '@/features/problem/new/data';

type Field = {
  name: string;
  type: ItemType;
};

export const DetailsForm = ({
  onSubmit,
  onBack,
  fields,
  problem,
  location,
}: {
  fields: Field[];
  location: { lat: number; lng: number };
  onBack: () => void;
  onSubmit: (data: Record<string, any>) => void;
  problem: string;
}) => {
  const [formData, setFormData] = useState<Record<string, any>>(
    fields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {}),
  );

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const hasEmptyFields = fields.some(
      (field) =>
        formData[field.name] === null || // initially null for photo
        (field.type === ItemType.Text && formData[field.name].trim() === ''), // empty string for text
    );

    if (hasEmptyFields) {
      alert('すべての項目を入力してください');
      return;
    }

    onSubmit(formData);
  };

  return (
    <Box>
      {fields.map((field) => (
        <FormControl key={field.name} mt="4">
          <FormLabel>{field.name}</FormLabel>
          {field.type === ItemType.Text && (
            <Input
              placeholder={field.name}
              value={formData[field.name]}
              onChange={(e) => handleChange(field.name, e.target.value)}
            />
          )}
          {field.type === ItemType.DateTime && (
            <Input
              type="datetime-local"
              value={formData[field.name]}
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
              isChecked={!!formData[field.name]}
              onChange={(e) => handleChange(field.name, e.target.checked)}
            />
          )}
        </FormControl>
      ))}

      <Box fontSize="sm" mt={4}>
        <Text>テーマ: {problem}</Text>
        <Text>
          選択した位置: 緯度 {parseFloat(location.lat.toFixed(5))}, 経度{' '}
          {parseFloat(location.lng.toFixed(5))}
        </Text>
      </Box>

      <Button mr="2" mt="4" onClick={onBack}>
        戻る
      </Button>
      <Button colorScheme="teal" mt="4" onClick={handleSubmit}>
        送信
      </Button>
    </Box>
  );
};
