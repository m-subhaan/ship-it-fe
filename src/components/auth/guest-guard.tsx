'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';

import { paths } from '@/paths';
import { useUser } from '@/hooks/use-user';

export interface GuestGuardProps {
  children: React.ReactNode;
}

export function GuestGuard({ children }: GuestGuardProps): React.JSX.Element | null {
  const router = useRouter();
  const { user, isLoading } = useUser();

  React.useEffect(() => {
    if (!isLoading) {
      if (user) {
        console.log(user);
        if (user.adminType === 'SUPER_ADMIN') {
          router.replace(paths.dashboard.dashboard);
        } else if (user.adminType === 'LISTING_MANAGER') {
          router.replace(paths.dashboard.categories);
        } else {
          console.log('Redirecting to default dashboard');
          router.replace(paths.dashboard.dashboard); // default case
        }
      }
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return null; // or a loading spinner
  }

  if (user) {
    return null;
  }

  return <>{children}</>;
}
