export interface Admin {
    adminId?: string;
    firstName: string;
    lastName: string;
    email: string;
    adminType: AdminTypes;
    id?: number;
  }
// also add the type in the utils/constants in USERS constants
  export type AdminTypes = 'SUPER_ADMIN' | 'ORDER_DISPATCHER' | 'LISTING_MANAGER';