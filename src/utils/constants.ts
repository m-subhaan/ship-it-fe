import { paths } from '@/paths';
import type { NavItemConfig } from '@/types/nav';

  
  // Now you can define the NAV_ITEMS constant using the NavItems type
  const NAV_ITEMS:  { [key: string]: NavItemConfig[] } = {
    SUPER_ADMIN: [
      {key: 'dashboard', href: paths.dashboard.dashboard, title: "Home", icon: 'home'},
      {key: 'users', href: paths.dashboard.users, title: "Users Management", icon: 'users'},
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
    ]
  };
  export default NAV_ITEMS;
  
  export const USERS = [
    {value: 'SUPER_ADMIN', label: 'Super Admin' },
    {value: 'ORDER_DISPATCHER', label: 'Order Dispatcher' },
    {value: 'LISTING_MANAGER', label: 'Listing Manager' },

  ]
