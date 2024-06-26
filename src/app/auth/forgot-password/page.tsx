import * as React from 'react';
import type { Metadata } from 'next';

import { config } from '@/config';
import { ForgotPasswordForm } from '@/components/auth/forgot-password';
import { GuestGuard } from '@/components/auth/guest-guard';
import { Layout } from '@/components/auth/layout';

export const metadata = { title: `Reset password | Auth | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
    <Layout>
      <GuestGuard>
        <ForgotPasswordForm />
      </GuestGuard>
    </Layout>
  );
}
