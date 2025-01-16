import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Checkbox,
  Flex,
  Radio,
  RadioGroup,
  Select,
  Spacer,
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
      <Accordion allowToggle>
        <AccordionItem>
          <AccordionButton>
            <Text>検索オプション</Text>
            <Spacer />
            <AccordionIcon />
          </AccordionButton>

          <AccordionPanel>
            <Stack
              direction={{
                base: 'column',
                xl: 'row',
              }}
              wrap="wrap"
            >
              <Flex align="center" justify="flex-start">
                <RadioGroup
                  alignItems="flex-start"
                  alignSelf="center"
                  value={
                    filters.isSolved === null
                      ? '1'
                      : filters.isSolved
                        ? '2'
                        : '3'
                  }
                  w="340px"
                  onChange={(value) =>
                    onFilterChange(
                      'isSolved',
                      value === '1' ? null : value === '2',
                    )
                  }
                >
                  <Stack
                    direction={{
                      base: 'column',
                      sm: 'row',
                    }}
                  >
                    <Text fontWeight="bold">対応状況</Text>
                    <Stack direction="row">
                      <Radio value="1">すべて</Radio>
                      <Radio value="2">解決済</Radio>
                      <Radio value="3">未解決</Radio>
                    </Stack>
                  </Stack>
                </RadioGroup>
              </Flex>

              <Spacer />
              <Checkbox
                isChecked={filters.userId !== null}
                w="240px"
                onChange={(e) =>
                  onFilterChange('userId', e.target.checked ? myUserId : null)
                }
              >
                自分の投稿のみ
              </Checkbox>
              <Spacer />
              <Select
                maxW={{
                  base: 'full',
                  md: '400px',
                }}
                minW="160px"
                placeholder="課題を選択"
                value={filters.problemId || ''}
                w={{
                  base: 'full',
                  md: '30vw',
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
            </Stack>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Box>
  );
};
