'use client';

import { Center, Spinner, Text } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

import { pagesPath } from '@/gen/$path';

import { UserRole, UserRoleType } from './constants/role';
import { useAuth } from './hooks/useAuth';

type AuthGuardProps = {
  allowedRoles: UserRoleType[];
  children: ReactNode;
  debug?: boolean;
  isPublic?: boolean;
  redirectAuthenticatedTo?: Record<UserRoleType, string>;
};

export const AuthGuard = ({
  children,
  allowedRoles,
  redirectAuthenticatedTo = {
    [UserRole.Admin]: pagesPath.staff.home.$url().pathname,
    [UserRole.Staff]: pagesPath.staff.home.$url().pathname,
    [UserRole.Citizen]: pagesPath.home.$url().pathname,
  },
  isPublic = false,
  debug = false,
}: AuthGuardProps) => {
  const { idToken } = useAuth();
  const role = idToken?.roles?.[0] ?? null;

  const router = useRouter();

  useEffect(() => {
    if (debug) {
      console.log('return because debug mode');
      return;
    }

    // (1) ログイン済みユーザだがアクセスが許可されていない場合、リダイレクト
    if (role && !allowedRoles.includes(role)) {
      console.log('redirect because your role is not allowed');
      console.log('your role', role);
      const redirectPath = redirectAuthenticatedTo[role] || '/';
      router.replace(redirectPath);
      return;
    }
    // (2) 未ログインユーザーでアクセスが許可されていない場合、リダイレクト
    if (!role && !isPublic) {
      console.log('redirect because user is not logged in');

      const redirectPath = pagesPath.$url().pathname;
      router.replace(redirectPath);
      return;
    }
  }, [role, allowedRoles, redirectAuthenticatedTo, router, debug, isPublic]);

  // 未ログインユーザーでアクセスが許可されていない場合、リダイレクトまで以下を表示
  if (!role && isPublic === false) {
    console.log('show loading screen because user is not logged in');
    return (
      <Center h="100vh">
        <Text>読み込み中...</Text>
        <Spinner />
      </Center>
    );
  }

  return <>{children}</>;
};
