import {
  Box,
  Flex,
  Input,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Text,
} from '@chakra-ui/react';

import { GetPostsSummaryRequest } from '@/gen/api';

import { useGetProblems } from '../problem/hooks/useGetProblems';

type FilterOptionsProps = {
  filters: GetPostsSummaryRequest;
  onFilterChange: <K extends keyof GetPostsSummaryRequest>(
    key: K,
    value: GetPostsSummaryRequest[K],
  ) => void;
};

export const FilterOptions = ({
  onFilterChange,
  filters,
}: FilterOptionsProps) => {
  const { data: problems } = useGetProblems({ limit: 100 });

  return (
    <Box mb={4}>
      <Text fontSize="lg" fontWeight="bold" my={4}>
        検索オプション
      </Text>
      <Stack
        direction={{
          base: 'column',
          xl: 'row',
        }}
        wrap="wrap"
      >
        <Flex
          align="start"
          direction={{
            base: 'column',
            lg: 'row',
          }}
          justify="start"
        >
          <Flex
            align="start"
            direction={{
              base: 'column',
              lg: 'row',
            }}
            justify="start"
          >
            <RadioGroup
              mr={12}
              mt={2}
              value={
                filters.isSolved === null ? '1' : filters.isSolved ? '2' : '3'
              }
              onChange={(value) =>
                onFilterChange('isSolved', value === '1' ? null : value === '2')
              }
            >
              <Stack
                direction={{
                  base: 'column',
                  sm: 'row',
                }}
                spacing={4}
              >
                <Text fontWeight="bold">対応状況</Text>
                <Radio value="1">すべて表示</Radio>
                <Radio value="2">解決済</Radio>
                <Radio value="3">未解決</Radio>
              </Stack>
            </RadioGroup>

            <RadioGroup
              mr={12}
              mt={2}
              value={filters.isOpen === null ? '1' : filters.isOpen ? '2' : '3'}
              onChange={(value) =>
                onFilterChange('isOpen', value === '1' ? null : value === '2')
              }
            >
              <Stack
                direction={{
                  base: 'column',
                  sm: 'row',
                }}
                spacing={4}
              >
                <Text fontWeight="bold">公開状態</Text>
                <Radio value="1">公開/非公開 全て</Radio>
                <Radio value="2">公開中</Radio>
                <Radio value="3">非公開</Radio>
              </Stack>
            </RadioGroup>
          </Flex>
        </Flex>
        <Flex
          align="start"
          direction={{
            base: 'column',
            lg: 'row',
          }}
          gap={4}
          justify="start"
        >
          <Select
            placeholder="課題を選択"
            value={filters.problemId || ''}
            w={{
              base: 'full',
              xl: 'fit-content',
            }}
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

          <Input
            placeholder="投稿ユーザーID"
            value={filters.userId || ''}
            w={{
              base: 'full',
              xl: 'fit-content',
            }}
            onChange={(e) => onFilterChange('userId', e.target.value || null)}
          />
        </Flex>
      </Stack>
    </Box>
  );
};
