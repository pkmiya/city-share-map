'use client';

import { Center, Spinner, Text, useToast } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

import { useLiff } from '@/context/liffProvider';
import { pagesPath } from '@/gen/$path';

import { LOCAL_STORAGE_KEYS } from './constants/localStoageKey';
import { UserRoleType } from './constants/role';

type AuthGuardProps = {
  allowedRoles: UserRoleType[];
  children: ReactNode;
  debug?: boolean;
};

export const AuthGuard = ({
  children,
  allowedRoles,
  debug = false,
}: AuthGuardProps) => {
  const { userRole, setUserRole } = useLiff();
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    let redirectPath = '/';
    if (debug) {
      return;
    }
    if (userRole === undefined) {
      const storedUserRole = localStorage.getItem(LOCAL_STORAGE_KEYS.userRole);
      if (storedUserRole) {
        setUserRole && setUserRole(storedUserRole);
      } else {
        router.replace('/');
      }
    }

    if (userRole && !allowedRoles.includes(userRole)) {
      switch (userRole) {
        case 'citizen':
          redirectPath = pagesPath.home.$url().pathname;
          break;
        case 'admin':
          redirectPath = pagesPath.staff.home.$url().pathname;
          break;
        default:
          redirectPath = pagesPath.$url().pathname;
          break;
      }
      toast({
        description: 'ページが見つかりません',
        duration: 3000,
        position: 'bottom-right',
        status: 'warning',
        title: '404エラー',
      });
      router.replace(redirectPath);
    }
  }, [userRole, allowedRoles, router]);

  if (!userRole) {
    return (
      <Center h="100vh">
        <Text>読み込み中...</Text>
        <Spinner />
      </Center>
    );
  }

  return <>{allowedRoles.includes(userRole) && children}</>;
};
