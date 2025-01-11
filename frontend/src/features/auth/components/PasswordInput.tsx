import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import { useState } from 'react';
import { FieldValues, Path, UseFormRegister } from 'react-hook-form';
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';

type PasswordInputProps<T extends FieldValues> = {
  error?: string;
  minLength?: number;
  name: Path<T>;
  register: UseFormRegister<T>;
};

export const PasswordInput = <T extends FieldValues>({
  error,
  register,
  minLength,
  name,
}: PasswordInputProps<T>) => {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);

  const validationRules = {
    required: 'パスワードは必須項目です。',
    ...(minLength && {
      minLength: {
        message: `パスワードは${minLength}文字以上である必要があります。`,
        value: minLength,
      },
    }),
  };

  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor="password">パスワード</FormLabel>
      <InputGroup>
        <Input
          id="password"
          placeholder="パスワードを入力"
          pr="4.5rem"
          type={show ? 'text' : 'password'}
          {...register(name, validationRules)}
        />
        <InputRightElement width="4.5rem">
          <IconButton
            aria-label="toggle password visibility"
            bg="transparent"
            icon={show ? <IoMdEyeOff /> : <IoMdEye />}
            onClick={handleClick}
          />
        </InputRightElement>
      </InputGroup>
      <FormErrorMessage>{error}</FormErrorMessage>
    </FormControl>
  );
};
