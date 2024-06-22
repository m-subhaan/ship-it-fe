// config.ts
import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const NAV_ITEMS: { [key: string]: NavItemConfig[] } = {
  SUPER_ADMIN: [
    { key: 'dashboard', href: paths.dashboard.dashboard, title: 'Home', icon: 'home' },
    { key: 'users', href: paths.dashboard.users, title: 'Users Management', icon: 'users' },
    { key: 'requests', title: 'Requests', href: paths.dashboard.requests, icon: 'manageUsers' },
    { key: 'settings', title: 'Settings', href: paths.dashboard.settings, icon: 'gear-six' },
  ],
  LISTING_MANAGER: [
    { key: 'categories', title: 'Manage Categories', href: paths.dashboard.categories, icon: 'chart-pie' },
    { key: 'listings', title: 'Product Listings', href: paths.dashboard.listings, icon: 'chart-pie' },
    { key: 'settings', title: 'Settings', href: paths.dashboard.settings, icon: 'gear-six' },
  ],
  ORDER_DISPATCHER: [
    { key: 'orders', title: 'Orders', href: paths.dashboard.orders, icon: 'chart-pie' },
    { key: 'settings', title: 'Settings', href: paths.dashboard.settings, icon: 'gear-six' },
  ],
};
