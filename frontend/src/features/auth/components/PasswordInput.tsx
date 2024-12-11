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
import { UseFormRegister } from 'react-hook-form';
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';

import { LoginRequest } from '@/gen/api';

type PasswordInputProps = {
  error?: string;
  register: UseFormRegister<LoginRequest>;
};

export const PasswordInput = ({ error, register }: PasswordInputProps) => {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);

  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor="password">パスワード</FormLabel>
      <InputGroup>
        <Input
          id="password"
          placeholder="パスワードを入力"
          pr="4.5rem"
          type={show ? 'text' : 'password'}
          {...register('password', {
            required: 'パスワードは必須項目です',
          })}
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
