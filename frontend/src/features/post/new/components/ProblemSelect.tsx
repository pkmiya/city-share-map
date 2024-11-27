import { Box, Button, FormControl, FormLabel, Select } from '@chakra-ui/react';
import { useState } from 'react';

import { problems } from '../data';

export const ProblemSelect = ({
  onNext,
}: {
  onNext: (data: { problem: string }) => void;
}) => {
  const [problem, setProblem] = useState('');

  const handleNext = () => {
    if (!problem) {
      alert('テーマを選択してください');
      return;
    }
    onNext({ problem });
  };

  return (
    <Box>
      <FormControl>
        <FormLabel>投稿のテーマを選択してください</FormLabel>
        <Select
          placeholder="テーマを選択"
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
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
