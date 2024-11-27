import {
  Box,
  Button,
  Center,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Select,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';

import { usePostContext } from '@/context/postProvider';

import { problems } from '../data';

type Props = {
  onNext: () => void;
};

export const ProblemSelect = ({ onNext }: Props) => {
  const { formData, setFormData } = usePostContext();

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<{ problem: string }>({
    defaultValues: {
      problem: formData.problem?.name || '',
    },
  });

  const onSubmit = (data: { problem: string }) => {
    const selectedProblem = problems.find((p) => p.name === data.problem);
    if (!selectedProblem) {
      return;
    }

    const fields = selectedProblem.fields || [];
    setFormData({ fields: fields, problem: selectedProblem });
    onNext();
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setValue('problem', value);
    clearErrors('problem');

    const selectedProblem = problems.find((p) => p.name === e.target.value);
    if (selectedProblem) {
      setFormData({ problem: selectedProblem });
    }
  };

  return (
    <Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl isInvalid={!!errors.problem}>
          <FormLabel>どのテーマに対してレポートしますか？</FormLabel>
          <Select
            placeholder="テーマを選択"
            {...register('problem', {
              required: 'テーマを選択してください',
            })}
            onChange={handleChange}
          >
            {problems.map((p) => (
              <option key={p.id} value={p.name}>
                {p.name}
              </option>
            ))}
          </Select>
          <FormErrorMessage>
            {errors.problem && errors.problem.message}
          </FormErrorMessage>
        </FormControl>
        <Center>
          <Button colorScheme="teal" mt="4" type="submit">
            次へ
          </Button>
        </Center>
      </form>
    </Box>
  );
};
