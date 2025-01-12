import {
  Box,
  Checkbox,
  HStack,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Text,
} from '@chakra-ui/react';

import { GetPostsSummaryRequest } from '@/gen/api';

import { useAuth } from '../auth/hooks/useAuth';
import { useGetProblems } from '../problem/hooks/useGetProblems';

type FilterOptionsForCitizenProps = {
  filters: GetPostsSummaryRequest;
  onFilterChange: <K extends keyof GetPostsSummaryRequest>(
    key: K,
    value: GetPostsSummaryRequest[K],
  ) => void;
};

export const FilterOptionsForCitizen = ({
  onFilterChange,
  filters,
}: FilterOptionsForCitizenProps) => {
  const { accessToken: authAccessToken } = useAuth();
  const myUserId = authAccessToken?.user_id;

  const { data: problems } = useGetProblems({ limit: 100 });

  return (
    <Box mb={4}>
      <Text fontSize="lg" fontWeight="bold" my={4}>
        検索オプション
      </Text>
      <Box ml={4}>
        <HStack>
          <RadioGroup
            value={
              filters.isSolved === null ? '1' : filters.isSolved ? '2' : '3'
            }
            w="38%"
            onChange={(value) =>
              onFilterChange('isSolved', value === '1' ? null : value === '2')
            }
          >
            <Stack direction="row" spacing={4}>
              <Text fontWeight="bold">対応状況</Text>
              <Radio value="1">すべて</Radio>
              <Radio value="2">解決済</Radio>
              <Radio value="3">未解決</Radio>
            </Stack>
          </RadioGroup>
          <Checkbox
            w="18%"
            isChecked={filters.userId !== null}
            onChange={(e) =>
              onFilterChange('userId', e.target.checked ? myUserId : null)
            }
          >
            自分の投稿のみ
          </Checkbox>
          <Select
            placeholder="課題を選択"
            w="40%"
            value={filters.problemId || ''}
            onChange={(e) =>
              onFilterChange(
                'problemId',
                e.target.value ? Number(e.target.value) : null,
              )
            }
          >
            {problems?.map((problem) => (
              <option key={problem.id} value={problem.id}>
                {problem.name}
              </option>
            ))}
          </Select>
        </HStack>
      </Box>
    </Box>
  );
};
