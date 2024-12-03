'use client';

import { Center, Spinner, Text } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

import { useLiff } from '@/context/liffProvider';

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
  const { userRole } = useLiff();
  const router = useRouter();
  let redirectPath = '/';

  useEffect(() => {
    console.log('userRole:', userRole);
    if (debug) {
      console.log('[AuthGuard] debug mode is enabled. Skipping auth check.');
      return;
    }
    if (!userRole) {
      console.log('[AuthGuard] 401 userRole does not exist. Redirecting to /');
      router.replace('/');
    }

    if (userRole && !allowedRoles.includes(userRole)) {
      switch (userRole) {
        case 'citizen':
          redirectPath = '/home';
          break;
        case 'admin':
          redirectPath = '/admin-home';
          break;
        default:
          redirectPath = '/';
          break;
      }
      console.log(
        '[AuthGuard] 403 userRole is not allowed. Redirecting to :',
        redirectPath,
      );
      router.replace(redirectPath);
    }
  }, [userRole, allowedRoles, router, redirectPath]);

  if (!userRole) {
    return (
      <Center h="100vh">
        <Text>ログイン中...</Text>
        <Spinner />
      </Center>
    );
  }

  return <>{allowedRoles.includes(userRole) && children}</>;
};
