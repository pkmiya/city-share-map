import {
  Box,
  Button,
  Center,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Image,
  Input,
  Switch,
  Text,
} from '@chakra-ui/react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { usePostContext } from '@/context/postProvider';
import { ItemType, ItemTypeName } from '@/features/problem/new/data';
import { resizeImage } from '@/utils/image';

import { usePostPost } from '../../hooks/usePostPost';
import { item } from '../types';

type Props = {
  onBack: () => void;
};

const imageResizeHeight = 500;
const imageResizeWidth = 500;

export const DetailsForm = ({ onBack }: Props) => {
  const { formData } = usePostContext();
  const { mutate: createPost, isPending } = usePostPost();
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const problem = formData.selectedProblemDetail?.name;
  const description = formData.selectedProblemDetail?.description;
  const address = formData.location?.address;
  const fields = formData.selectedProblemDetail?.items ?? [];

  const isAndroid = localStorage.getItem('device') === 'android';

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    control,
    formState: { errors },
  } = useForm<{ [key: string]: string }>({
    defaultValues: formData.fieldValues,
  });

  // ファイルをBase64にエンコードする関数
  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: string,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const resizedImage = await resizeImage({
          file,
          maxHeight: imageResizeHeight,
          maxWidth: imageResizeWidth,
        });
        console.log('Resized Image:', resizedImage);
        setPreviewImage(resizedImage);
        setValue(fieldName, resizedImage, { shouldValidate: true });
      } catch (error) {
        console.error('Failed to process image:', error);
        setPreviewImage(null);
        setValue(fieldName, '', { shouldValidate: true });
      }
    } else {
      // NOTE: ファイルが選択されていないとき
      setPreviewImage(null);
      setValue(fieldName, '');
    }
  };

  const onSubmit = async () => {
    const fieldValues = getValues();

    const items = fields.reduce((acc: Record<string, any>, field) => {
      acc[field.name] = parseValue(field.typeId ?? 0, fieldValues[field.name]);
      return acc;
    }, {});

    createPost({
      postCreate: {
        items,
        latitude: formData.location?.coordinates?.lat ?? 0,
        longitude: formData.location?.coordinates?.lng ?? 0,
      },
      problemId: formData.selectedProblemDetail?.id ?? 0,
    });
  };

  // NOTE: ItemTypeName に基づくマッピングを事前生成
  const typeIdMap = ItemType.reduce(
    (acc, item) => {
      acc[item.name] = item.id;
      return acc;
    },
    {} as Record<string, number>,
  );

  const parseValue = (typeId: number, value: any) => {
    if (value === undefined || value === null || value === '') {
      if (typeId === typeIdMap[ItemTypeName.Number]) {
        return 0; // 数値の場合は0を返す
      }
      if (typeId === typeIdMap[ItemTypeName.Text]) {
        return ''; // テキストの場合は空文字列を返す
      }
      if (typeId === typeIdMap[ItemTypeName.Photo]) {
        return ''; // 写真の場合は空文字列を返す
      }
      if (typeId === typeIdMap[ItemTypeName.Boolean]) {
        return false; // 真偽値の場合はfalseを返す
      }
      if (typeId === typeIdMap[ItemTypeName.DateTime]) {
        return new Date().toISOString().replace('T', ' ').split('.')[0]; // 日時の場合は現在の日時を返す
      }
      return null;
    }
    switch (typeId) {
      case typeIdMap[ItemTypeName.Text]:
        return String(value); // テキスト
      case typeIdMap[ItemTypeName.Number]:
        return !isNaN(Number(value)) ? Number(value) : 0; // 数値
      case typeIdMap[ItemTypeName.DateTime]:
        return new Date(value).toISOString().replace('T', ' ').split('.')[0]; // 日時
      case typeIdMap[ItemTypeName.Boolean]:
        return Boolean(value); // 真偽値
      case typeIdMap[ItemTypeName.Photo]:
        return typeof value === 'string' && value.startsWith('data:image/')
          ? value
          : ''; // Base64画像データ
      default:
        return null;
    }
  };

  return (
    <Box>
      <Box fontSize="sm" mt={4}>
        <Text>テーマ: {problem}</Text>
        <Text>テーマ詳細: {description}</Text>
        <Text>住所: {address}</Text>
      </Box>

      <form onSubmit={handleSubmit(onSubmit)}>
        {fields.map((field: item) => {
          const value =
            formData.fieldValues && formData.fieldValues[field.name];
          const isInvalid = !!errors[field.name];
          const isRequired = field.required;

          return (
            <FormControl key={field.name} isInvalid={isInvalid} mt="4">
              <FormLabel>
                {field.name}
                {isRequired && (
                  <Text as="span" color="red.500">
                    *
                  </Text>
                )}
              </FormLabel>
              {field.typeId === typeIdMap[ItemTypeName.Text] && (
                <Input
                  placeholder={field.name}
                  value={value}
                  {...register(field.name, {
                    required: isRequired
                      ? `${field.name}を入力してください`
                      : false,
                  })}
                />
              )}
              {field.typeId === typeIdMap[ItemTypeName.Photo] && (
                <>
                  <Controller
                    control={control}
                    name={field.name}
                    render={({ field }) => (
                      <Input
                        // NOTE: Androidにおいて、カメラを起動できるようにする
                        // c.f. https://developer.mozilla.org/ja/docs/Web/HTML/Element/Input/file#capture
                        accept={
                          isAndroid ? 'image/*;capture=camera' : 'image/*'
                        }
                        capture={isAndroid ? true : undefined}
                        type="file"
                        onChange={(e) => handleFileChange(e, field.name)}
                      />
                    )}
                    rules={{
                      required: isRequired
                        ? `${field.name}をアップロードしてください`
                        : false,
                    }}
                  />
                  {previewImage && (
                    <Box>
                      <Text my={2}>{field.name}のプレビュー</Text>
                      <Box w="full">
                        <Image
                          alt="preview image"
                          aspectRatio={1}
                          borderRadius="md"
                          boxShadow="sm"
                          src={previewImage}
                        />
                      </Box>
                    </Box>
                  )}
                </>
              )}
              {field.typeId === typeIdMap[ItemTypeName.DateTime] && (
                <Input
                  type="datetime-local"
                  {...register(field.name, {
                    required: isRequired
                      ? `${field.name}を選択してください`
                      : false,
                    validate: isRequired
                      ? (value) => {
                          const selectedDate = new Date(value);
                          const currentDate = new Date();
                          return (
                            selectedDate < currentDate ||
                            `${field.name}には過去の日付を選択してください`
                          );
                        }
                      : undefined,
                  })}
                />
              )}
              {field.typeId === typeIdMap[ItemTypeName.Number] && (
                <Input
                  placeholder={field.name}
                  type="number"
                  value={value}
                  {...register(field.name, {
                    required: isRequired
                      ? `${field.name}を入力してください`
                      : false,
                  })}
                />
              )}
              {field.typeId === typeIdMap[ItemTypeName.Boolean] && (
                // NOTE: isRequired == trueだとcheckedでないとリクエスト時にエラーになるため、readOnlyで常にcheckedにして対応
                <Switch defaultChecked={isRequired} {...register(field.name)} />
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
          <Button colorScheme="teal" isLoading={isPending} mt="4" type="submit">
            送信
          </Button>
        </Center>
      </form>
    </Box>
  );
};
