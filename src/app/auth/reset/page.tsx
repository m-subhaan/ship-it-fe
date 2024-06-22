import * as React from 'react';
import type { Metadata } from 'next';

import { GuestGuard } from '@/components/auth/guest-guard';
import { Layout } from '@/components/auth/layout';
import { ResetForm } from '@/components/auth/reset-form';

export default function Page(): React.JSX.Element {
  return (
    <Layout>
      <GuestGuard>
        <ResetForm />
      </GuestGuard>
    </Layout>
  );
}
