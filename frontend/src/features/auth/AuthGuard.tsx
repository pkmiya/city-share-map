'use client';

import { Center, Spinner, Text, useToast } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

import { pagesPath } from '@/gen/$path';

import { UserRole, UserRoleType } from './constants/role';
import { useAuth } from './hooks/useAuth';

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
  const { accessToken } = useAuth();
  const role = accessToken.user_type;

  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    if (debug) {
      return;
    }

    let redirectPath = '/';
    if (role && !allowedRoles.includes(role)) {
      switch (role) {
        case UserRole.Citizen:
          redirectPath = pagesPath.home.$url().pathname;
          break;
        case UserRole.Staff:
        case UserRole.Admin:
          redirectPath = pagesPath.staff.home.$url().pathname;
          break;
        default:
          redirectPath = pagesPath.$url().pathname;
          break;
      }
      router.replace(redirectPath);
    }
  }, [role, allowedRoles, router, debug, toast]);

  if (!role) {
    return (
      <Center h="100vh">
        <Text>読み込み中...</Text>
        <Spinner />
      </Center>
    );
  }

  if (!allowedRoles.includes(role)) {
    return null;
  }

  return <>{children}</>;
};
