'use client';

import { Box, Flex, HStack, Text } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

import { pagesPath } from '@/gen/$path';

export const AdminHome = () => {
  const router = useRouter();

  type MenuListItem = {
    description: string;
    icon: string;
    name: string;
    url: string;
  };

  const AdminMenuList: MenuListItem[] = [
    {
      description: '市民からの投稿を地図上に可視化',
      icon: '🗾',
      name: 'マップ',
      url: pagesPath.staff.map.$url().path,
    },
    {
      description: '市民からの投稿を表形式で閲覧',
      icon: '📝',
      name: '投稿一覧',
      url: pagesPath.staff.post.$url().path,
    },
    {
      description: '市民に投稿してもらう課題の作成',
      icon: '📄',
      name: '新規課題',
      url: pagesPath.staff.problem.new.$url().path,
    },
    {
      description: '市民に投稿してもらう課題の一覧',
      icon: '📄',
      name: '課題一覧',
      url: pagesPath.staff.problem.$url().path,
    },
    {
      description: '市民ユーザの一覧',
      icon: '👤',
      name: '市民ユーザ一覧',
      url: pagesPath.staff.user.$url().path,
    },
    {
      description: '自治体職員ユーザの一覧',
      icon: '👤',
      name: '管理者ユーザ一覧',
      url: pagesPath.staff.admin.$url().path,
    },
  ];

  const CitizenMenuList: MenuListItem[] = [
    {
      description: '各機能にアクセスするためのホーム画面',
      icon: '🏠',
      name: 'ホーム',
      url: pagesPath.home.$url().path,
    },
    {
      description:
        '自分を含む市民の投稿を地図上に可視化（自治体職員版とは一部異なる）',
      icon: '🗾',
      name: 'マップ',
      url: pagesPath.map.$url().path,
    },
    {
      description: '市民として課題へのレポートを作成',
      icon: '📄',
      name: '新規投稿',
      url: pagesPath.post.new.$url().path,
    },
    {
      description: '自分が投稿したレポートの一覧',
      icon: '📄',
      name: 'マイレポート',
      url: pagesPath.profile.$url().path,
    },
  ];

  return (
    <Box w="full">
      <Text fontSize="2xl" fontWeight="bold" my={4}>
        ホーム画面
      </Text>

      <Box my={4}>
        <Text fontSize="lg" fontWeight="bold">
          自治体職員ユーザ向け機能
        </Text>
        <Text fontSize="sm">※市民ユーザは利用できない想定です。</Text>
      </Box>
      <Flex flexWrap="wrap" gap={4}>
        {AdminMenuList.map((menu) => (
          <Box
            key={menu.name}
            _hover={{ bg: 'gray.200', cursor: 'pointer' }}
            bg="gray.100"
            borderRadius="lg"
            h="120px"
            minW="200px"
            p={4}
            w="calc(50% - 20px)"
            onClick={() => {
              router.push(menu.url);
            }}
          >
            <HStack mb={2}>
              <Text fontSize="xl">{menu.icon}</Text>
              <Text fontSize="xl" fontWeight="bold">
                {menu.name}
              </Text>
            </HStack>
            <Text>{menu.description}</Text>
          </Box>
        ))}
      </Flex>

      <Box my={4}>
        <Text fontSize="lg" fontWeight="bold">
          市民ユーザ向け機能
        </Text>
        <Text fontSize="sm">※自治体職員ユーザは利用できない想定です。</Text>
      </Box>
      <Flex flexWrap="wrap" gap={4}>
        {CitizenMenuList.map((menu) => (
          <Box
            key={menu.name}
            _hover={{ bg: 'gray.200', cursor: 'pointer' }}
            bg="gray.100"
            borderRadius="lg"
            h="120px"
            minW="200px"
            p={4}
            w="calc(50% - 20px)"
            onClick={() => {
              router.push(menu.url);
            }}
          >
            <HStack mb={2}>
              <Text fontSize="xl">{menu.icon}</Text>
              <Text fontSize="xl" fontWeight="bold">
                {menu.name}
              </Text>
            </HStack>
            <Text>{menu.description}</Text>
          </Box>
        ))}
      </Flex>
    </Box>
  );
};
