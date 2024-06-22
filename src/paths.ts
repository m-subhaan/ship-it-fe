export const paths = {
  home: '/',
  auth: {
    signIn: '/auth/sign-in',
    signUp: '/auth/sign-up',
    resetPassword: '/auth/reset-password',
    reset: '/auth/reset',
  },
  dashboard: {
    dashboard: '/dashboard',
    account: '/dashboard/account',
    users: '/dashboard/users',
    integrations: '/dashboard/integrations',
    requests: '/dashboard/requests',
    settings: '/dashboard/settings',
    categories: '/dashboard/categories',
    listings: '/dashboard/listings',
    orders: '/dashboard/orders',
  },
  errors: { notFound: '/errors/not-found' },
} as const;
