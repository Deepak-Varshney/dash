import { NavItem } from '@/types';

export type Product = {
  photo_url: string;
  name: string;
  description: string;
  created_at: string;
  price: number;
  id: number;
  category: string;
  updated_at: string;
};

export type Ticket = {
  _id?: string | undefined;
  category: string;
  description?: string;
  subcategory: string;
  status?: "open" | "assigned" | "extended" | "done";
  createdBy?: {
    firstName: string;
    lastName: string;
    email: string;
    clerkId: string;
  };
  assignedTo?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    clerkId?: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
  deadline?: Date;
  __v?: number;
};
export type User = {
  id?: string;
  passwordEnabled?: boolean;
  totpEnabled?: boolean;
  backupCodeEnabled?: boolean;
  twoFactorEnabled?: boolean;
  banned?: boolean;
  locked?: boolean;
  createdAt?: number;
  updatedAt?: number;
  imageUrl?: string;
  hasImage?: boolean;
  primaryEmailAddressId?: string | null;
  primaryPhoneNumberId?: string | null;
  primaryWeb3WalletId?: string | null;
  lastSignInAt?: number | null;
  externalId?: string | null;
  username?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  publicMetadata?: Record<string, any>;
  privateMetadata?: Record<string, any>;
  unsafeMetadata?: Record<string, any>;
  emailAddresses?: Array<any>;
  phoneNumbers?: Array<any>;
  web3Wallets?: Array<any>;
  externalAccounts?: Array<any>;
  samlAccounts?: Array<any>;
  lastActiveAt?: number | null;
  createOrganizationEnabled?: boolean;
  createOrganizationsLimit?: number | null;
  deleteSelfEnabled?: boolean;
  legalAcceptedAt?: number | null;
};

export type Event = {
  _id?: string;
  title: string;
  description: string;
  createdBy?: {
    firstName: string;
    lastName: string;
    email: string;
    clerkId: string;
  };
  date: Date;
  createdAt?: Date;
  __v?: number;
};

export type Expense = {
  _id?: string;
  amount: number;
  category: string;
  __v?: number;
  notes?: string;
  date?: Date;
  createdBy?: {
    firstName: string;
    lastName: string;
    email: string;
    clerkId: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
};

//Info: The following data is used for the sidebar navigation and Cmd K bar.
export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/dashboard/overview',
    icon: 'dashboard',
    isActive: false,
    shortcut: ['d', 'd'],
    items: [] // Empty array as there are no child items for Dashboard
  },
  {
    title: 'Ticket',
    url: '/dashboard/ticket',
    icon: 'ticket',
    shortcut: ['p', 'p'],
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Event',
    url: '/dashboard/event',
    icon: 'event',
    shortcut: ['p', 'p'],
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Expense',
    url: '/dashboard/expense',
    icon: 'expense',
    shortcut: ['p', 'p'],
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Users',
    url: '/dashboard/users',
    icon: 'user',
    shortcut: ['p', 'p'],
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Payments',
    url: '/dashboard/payments',
    icon: 'billing',
    shortcut: ['p', 'p'],
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Account',
    url: '#', // Placeholder as there is no direct link for the parent
    icon: 'gear',
    isActive: true,

    items: [
      {
        title: 'Profile',
        url: '/dashboard/profile',
        icon: 'userPen',
        shortcut: ['m', 'm']
      },
      {
        title: 'Billing',
        url: '/dashboard/billing', // Placeholder as there is no direct link for the parent
        icon: 'billing',
        isActive: true,
      }
    ]
  },
  {
    title: 'Kanban',
    url: '/dashboard/kanban',
    icon: 'kanban',
    shortcut: ['k', 'k'],
    isActive: false,
    items: [] // No child items
  }
];

export interface SaleUser {
  id: number;
  name: string;
  email: string;
  amount: string;
  image: string;
  initials: string;
}

export const recentSalesData: SaleUser[] = [
  {
    id: 1,
    name: 'Olivia Martin',
    email: 'olivia.martin@email.com',
    amount: '+$1,999.00',
    image: 'https://api.slingacademy.com/public/sample-users/1.png',
    initials: 'OM'
  },
  {
    id: 2,
    name: 'Jackson Lee',
    email: 'jackson.lee@email.com',
    amount: '+$39.00',
    image: 'https://api.slingacademy.com/public/sample-users/2.png',
    initials: 'JL'
  },
  {
    id: 3,
    name: 'Isabella Nguyen',
    email: 'isabella.nguyen@email.com',
    amount: '+$299.00',
    image: 'https://api.slingacademy.com/public/sample-users/3.png',
    initials: 'IN'
  },
  {
    id: 4,
    name: 'William Kim',
    email: 'will@email.com',
    amount: '+$99.00',
    image: 'https://api.slingacademy.com/public/sample-users/4.png',
    initials: 'WK'
  },
  {
    id: 5,
    name: 'Sofia Davis',
    email: 'sofia.davis@email.com',
    amount: '+$39.00',
    image: 'https://api.slingacademy.com/public/sample-users/5.png',
    initials: 'SD'
  }
];
