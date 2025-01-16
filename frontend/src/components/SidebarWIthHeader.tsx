'use client';
import {
  Avatar,
  Box,
  BoxProps,
  CloseButton,
  Divider,
  Drawer,
  DrawerContent,
  Flex,
  FlexProps,
  HStack,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  useColorModeValue,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { IconType } from 'react-icons';
import { FaList } from 'react-icons/fa';
import {
  FiBell,
  FiChevronDown,
  FiHome,
  FiMap,
  FiMenu,
  FiPlusSquare,
  FiUsers,
} from 'react-icons/fi';
import { GoMegaphone } from 'react-icons/go';
import { GrUserAdmin } from 'react-icons/gr';

import { appMetadata } from '@/config/metadata';
import { useLiff } from '@/context/liffProvider';
import { UserRole } from '@/features/auth/constants/role';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useLogout } from '@/features/auth/hooks/useLogout';
import { pagesPath } from '@/gen/$path';
import { removeTrailingSlash } from '@/utils/url';

interface LinkItemProps {
  href?: string;
  icon: IconType;
  name: string;
}

interface NavItemProps extends FlexProps {
  children: React.ReactNode;
  href: string;
  icon: IconType;
  onClick: () => void;
}

interface MobileProps extends FlexProps {
  onOpen: () => void;
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

interface SidebarWithHeaderProps {
  children: React.ReactNode;
}

const LinkItems: Array<LinkItemProps> = [
  {
    href: pagesPath.staff.home.$url().pathname,
    icon: FiHome,
    name: 'ホーム',
  },
  {
    href: pagesPath.staff.map.$url().pathname,
    icon: FiMap,
    name: 'マップ',
  },
  {
    href: pagesPath.staff.post.$url().pathname,
    icon: FaList,
    name: '投稿一覧',
  },
  {
    href: pagesPath.staff.problem.new.$url().pathname,
    icon: FiPlusSquare,
    name: '新規課題',
  },
  {
    href: pagesPath.staff.problem.$url().pathname,
    icon: GoMegaphone,
    name: '課題一覧',
  },
  {
    href: pagesPath.staff.user.$url().pathname,
    icon: FiUsers,
    name: '市民ユーザ一覧',
  },
  {
    href: pagesPath.staff.admin.$url().pathname,
    icon: GrUserAdmin,
    name: '管理者ユーザ一覧',
  },
  {
    href: pagesPath.home.$url().pathname,
    icon: FiHome,
    name: 'ホーム',
  },
  {
    href: pagesPath.map.$url().pathname,
    icon: FiMap,
    name: 'マップ',
  },
  {
    href: pagesPath.post.new.$url().pathname,
    icon: FiPlusSquare,
    name: '新規投稿',
  },
  {
    href: pagesPath.profile.$url().pathname,
    icon: FaList,
    name: 'マイレポート',
  },
];

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  const { accessToken } = useAuth();
  const role = accessToken?.user_type ?? null;

  let redirectPath: string;
  switch (role) {
    case UserRole.Staff:
    case UserRole.Admin:
      redirectPath = pagesPath.staff.home.$url().pathname;
      break;
    case UserRole.Citizen:
      redirectPath = pagesPath.home.$url().pathname;
      break;
    default:
      redirectPath = pagesPath.$url().pathname;
      break;
  }

  return (
    <Box
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      h="full"
      overflowY="scroll"
      pos="fixed"
      transition="width 1s ease"
      w={{ base: 'full', xl: 60 }}
      {...rest}
    >
      <Flex alignItems="center" h="20" justifyContent="space-between" mx="8">
        {/* TODO: ロゴを配置 */}
        {/* <Image alt="app_logo" height="36px" src="/app_logo.png" /> */}
        {/* TODO:  */}
        <Link href={redirectPath}>
          <Text fontWeight="bold">{String(appMetadata.title)}</Text>
        </Link>
        <CloseButton display={{ base: 'flex', xl: 'none' }} onClick={onClose} />
      </Flex>

      {role === UserRole.Staff || role === UserRole.Admin ? (
        // NOTE: 管理者ユーザの場合
        <>
          {LinkItems.slice(0, 5).map((link) => (
            <NavItem
              key={link.name}
              href={link.href ?? ''}
              icon={link.icon}
              onClick={onClose}
            >
              <Text>{link.name}</Text>
            </NavItem>
          ))}
          <Divider my={6} />
          <Text fontSize="sm" fontWeight="bold" mb={2} ml={4}>
            ユーザ管理
          </Text>
          {LinkItems.slice(5, 7).map((link: LinkItemProps) => (
            <NavItem
              key={link.name}
              href={link.href ?? ''}
              icon={link.icon}
              onClick={onClose}
            >
              <Text>{link.name}</Text>
            </NavItem>
          ))}
        </>
      ) : (
        // NOTE: 市民ユーザの場合
        <>
          {LinkItems.slice(7).map((link: LinkItemProps) => (
            <NavItem
              key={link.name}
              href={link.href ?? ''}
              icon={link.icon}
              onClick={onClose}
            >
              <Text>{link.name}</Text>
            </NavItem>
          ))}
        </>
      )}
    </Box>
  );
};

const NavItem = ({ icon, href, onClick, children, ...rest }: NavItemProps) => {
  const pathname = usePathname();
  const isActive = removeTrailingSlash(pathname) === removeTrailingSlash(href);

  return (
    <Box
      _focus={{ boxShadow: 'none' }}
      as={Link}
      href={href}
      style={{ textDecoration: 'none' }}
      onClick={onClick}
    >
      <Flex
        align="center"
        bg={isActive ? 'blue.500' : undefined}
        borderRadius="lg"
        color={isActive ? 'white' : undefined}
        cursor="pointer"
        mx="4"
        p="4"
        role="group"
        {...rest}
      >
        {icon && (
          <Icon
            as={icon}
            color={isActive ? 'white' : undefined}
            fontSize="16"
            mr="4"
          />
        )}
        {children}
      </Flex>
    </Box>
  );
};

const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  const { userRole, liffLogout } = useLiff();

  let redirectPath: string;
  switch (userRole) {
    case UserRole.Staff:
    case UserRole.Admin:
      redirectPath = pagesPath.staff.home.$url().pathname;
      break;
    case UserRole.Citizen:
      redirectPath = pagesPath.home.$url().pathname;
      break;
    default:
      redirectPath = pagesPath.$url().pathname;
      break;
  }

  const { liffObject } = useLiff();
  const logout = useLogout();
  const [userName, setUserName] = useState<string | null>(null);
  const [department, setDepartment] = useState<string | null>(null);
  const { idToken } = useAuth();

  const fetchProfile = useCallback(() => {
    if (liffObject) {
      // 1. 市民ユーザ
      liffObject
        .getProfile()
        .then((profile) => {
          console.log('LIFF profile:', profile);
          setUserName(profile.displayName);
        })
        .catch((profileError) => {
          console.log('Failed to get profile:', profileError);
        });
    } else {
      // 2. 管理者ユーザ
      setUserName(idToken.name);
      setDepartment(idToken.department ?? '');
    }
  }, [liffObject, idToken]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return (
    <Flex
      alignItems="center"
      bg={useColorModeValue('white', 'gray.900')}
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      borderBottomWidth="1px"
      height="20"
      justifyContent={{ base: 'space-between', xl: 'flex-end' }}
      ml={{ base: 0, xl: 60 }}
      px={{ base: 4, xl: 4 }}
      {...rest}
    >
      <IconButton
        aria-label="open menu"
        display={{ base: 'flex', xl: 'none' }}
        icon={<FiMenu />}
        variant="outline"
        onClick={onOpen}
      />

      <Box display={{ base: 'flex', xl: 'none' }}>
        {/* TODO: ロゴを配置 */}
        {/* <Image alt="app_logo" height="36px" src="/app_logo.png" /> */}
        <Link href={redirectPath}>
          <Text fontWeight="bold">{String(appMetadata.title)}</Text>
        </Link>
      </Box>

      <HStack spacing={{ base: '0', xl: '6' }}>
        <IconButton
          aria-label="open menu"
          icon={<FiBell />}
          size="lg"
          variant="ghost"
        />
        <Flex alignItems={'center'}>
          <Menu>
            <MenuButton
              _focus={{ boxShadow: 'none' }}
              py={2}
              transition="all 0.3s"
            >
              <HStack>
                <Avatar size="sm" />
                <VStack
                  alignItems="flex-start"
                  display={{ base: 'none', xl: 'flex' }}
                  ml="2"
                  spacing="1px"
                >
                  <Text fontSize="sm">{userName ?? 'ゲストユーザ'}</Text>
                  <Text color="gray.600" fontSize="xs">
                    {department ?? '  '}
                  </Text>
                </VStack>
                <Box display={{ base: 'none', xl: 'flex' }}>
                  <FiChevronDown />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList
              bg={useColorModeValue('white', 'gray.900')}
              borderColor={useColorModeValue('gray.200', 'gray.700')}
            >
              <Text fontSize="sm" fontWeight="bold" mx={3} my={2}>
                {userName ?? 'ゲストユーザ'}
              </Text>
              <MenuItem>プロフィール</MenuItem>
              <MenuItem>設定</MenuItem>
              <MenuDivider />
              <MenuItem
                onClick={() => {
                  liffObject ? liffLogout() : logout();
                }}
              >
                ログアウト
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  );
};

export const SidebarWithHeader: React.FC<SidebarWithHeaderProps> = ({
  children,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box bg={useColorModeValue('white', 'gray.900')} minH="100vh">
      <SidebarContent
        display={{ base: 'none', xl: 'block' }}
        onClose={() => onClose}
      />
      <Drawer
        isOpen={isOpen}
        placement="left"
        returnFocusOnClose={false}
        size="full"
        onClose={onClose}
        onOverlayClick={onClose}
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      <MobileNav onOpen={onOpen} />
      <Box ml={{ base: 0, xl: 60 }} p="4">
        {children}
      </Box>
    </Box>
  );
};
