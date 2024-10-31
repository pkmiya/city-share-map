'use client';

import {
  Avatar,
  Box,
  BoxProps,
  CloseButton,
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
import { IconType } from 'react-icons';
import {
  FiBell,
  FiChevronDown,
  FiHome,
  FiMap,
  FiMenu,
  FiPlusSquare,
} from 'react-icons/fi';
import { GoMegaphone } from 'react-icons/go';

import { appMetadata } from '@/config/metadata';

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
  { href: '/', icon: FiHome, name: 'ホーム' },
  { href: '/map/', icon: FiMap, name: 'マップ' },
  { href: '/post/', icon: FiHome, name: '投稿一覧' },
  { href: '/problem/new/', icon: FiPlusSquare, name: '新規募集' },
  { href: '/problem/', icon: GoMegaphone, name: '募集一覧' },
];

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  return (
    <Box
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      h="full"
      pos="fixed"
      transition="3s ease"
      w={{ base: 'full', xl: 60 }}
      {...rest}
    >
      <Flex alignItems="center" h="20" justifyContent="space-between" mx="8">
        {/* TODO: ロゴを配置 */}
        {/* <Image alt="app_logo" height="36px" src="/app_logo.png" /> */}
        <Link href="">
          <Text fontWeight="bold">{String(appMetadata.title)}</Text>
        </Link>
        <CloseButton display={{ base: 'flex', xl: 'none' }} onClick={onClose} />
      </Flex>
      {LinkItems.map((link) => (
        <NavItem
          key={link.name}
          href={link.href ?? ''}
          icon={link.icon}
          onClick={onClose}
        >
          <Text>{link.name}</Text>
        </NavItem>
      ))}
    </Box>
  );
};

const NavItem = ({ icon, href, onClick, children, ...rest }: NavItemProps) => {
  const pathname = usePathname();

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
        bg={pathname === href ? 'blue.500' : undefined}
        borderRadius="lg"
        color={pathname === href ? 'white' : undefined}
        cursor="pointer"
        mx="4"
        p="4"
        role="group"
        {...rest}
      >
        {icon && (
          <Icon
            as={icon}
            color={pathname === href ? 'white' : undefined}
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
        <Link href="">
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
                <Avatar size={'sm'} src={'/icon-192x192.png'} />
                <VStack
                  alignItems="flex-start"
                  display={{ base: 'none', xl: 'flex' }}
                  ml="2"
                  spacing="1px"
                >
                  <Text fontSize="sm">サンプル管理者</Text>
                  <Text color="gray.600" fontSize="xs">
                    サンプル課
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
              <MenuItem>プロフィール</MenuItem>
              <MenuItem>設定</MenuItem>
              <MenuDivider />
              <MenuItem>ログアウト</MenuItem>
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
        size="xs"
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
