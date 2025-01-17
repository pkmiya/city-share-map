import {
  Box,
  Button,
  Center,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Select,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { usePostContext } from '@/context/postProvider';
import { useGetProblemById } from '@/features/problem/hooks/useGetProblemById';
import { useGetProblems } from '@/features/problem/hooks/useGetProblems';

type Props = {
  onNext: () => void;
};

export const ProblemSelect = ({ onNext }: Props) => {
  const problemIdDefaultValue = 0;

  const [problemId, setProblemId] = useState<number | null>(null);
  const { formData, setFormData } = usePostContext();
  const { refetch } = useGetProblemById(problemId ?? problemIdDefaultValue);
  const { data } = useGetProblems({});
  // NOTE: BackendがisOpenによらず全ての課題を返すため、isOpenでフィルタリングしている
  const problems = data ? data.filter((p) => p.isOpen) : [];

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<{ problem: string }>({
    defaultValues: {
      problem: formData.selectedProblemDetail?.name || '',
    },
  });

  const fetchProblemDetail = async () => {
    if (problemId === null) return;
    try {
      const { data: selectedProblemDetail } = await refetch();
      setFormData({
        ...formData,
        selectedProblemDetail,
      });
      onNext();
    } catch (error) {
      console.error('Failed to fetch problem details:', error);
    }
  };

  useEffect(() => {
    fetchProblemDetail();
  }, [problemId, refetch, formData, setFormData, onNext]);

  const onSubmit = async (data: { problem: string }) => {
    const selectedProblem =
      problems && problems.find((p) => p.name === data.problem);
    if (!selectedProblem) {
      return;
    }
    setProblemId(selectedProblem.id);
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setValue('problem', value);
    clearErrors('problem');
  };

  return (
    <Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl isInvalid={!!errors.problem}>
          <FormLabel>どのテーマに対してレポートしますか？</FormLabel>
          <Select
            placeholder="テーマを選択"
            w="80vw"
            {...register('problem', {
              required: 'テーマを選択してください',
            })}
            onChange={handleChange}
          >
            {problems &&
              problems.length > 0 &&
              problems.map((p) => (
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
