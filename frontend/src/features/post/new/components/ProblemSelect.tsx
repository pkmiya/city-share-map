import { Box, Button, FormControl, FormLabel, Select } from '@chakra-ui/react';

import { usePostContext } from '@/context/postProvider';

import { problems } from '../data';

export const ProblemSelect = ({ onNext }: { onNext: () => void }) => {
  const { formData, setFormData } = usePostContext();

  const selectedProblem = formData.problem;

  const handleNext = () => {
    if (selectedProblem === '') {
      alert('テーマを選択してください');
      return;
    }

    const fields =
      problems.find((p) => p.name === selectedProblem)?.fields || [];

    setFormData({ fields: fields, problem: selectedProblem });
    onNext();
  };

  return (
    <Box>
      <FormControl>
        <FormLabel>どのテーマに対してレポートしますか？</FormLabel>
        <Select
          placeholder="テーマを選択"
          value={selectedProblem}
          onChange={(e) => setFormData({ problem: e.target.value })}
        >
          {problems.map((p) => (
            <option key={p.id} value={p.name}>
              {p.name}
            </option>
          ))}
        </Select>
      </FormControl>
      <Button colorScheme="teal" mt="4" onClick={handleNext}>
        次へ
      </Button>
    </Box>
  );
};
