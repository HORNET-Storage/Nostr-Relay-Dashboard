// Updated mode names to match backend
export type AllowedUsersMode = 'only-me' | 'invite-only' | 'public' | 'subscription';

// Permission types as defined by backend
export type PermissionType = 'all_users' | 'paid_users' | 'allowed_users' | 'only-me';

// Tier structure remains the same
export interface AllowedUsersTier {
  name: string;
  price_sats: number;
  monthly_limit_bytes: number;
  unlimited: boolean;
  active?: boolean; // Optional field for public mode tier selection
}

// Updated settings structure to match backend
export interface AllowedUsersSettings {
  mode: AllowedUsersMode;
  read: PermissionType;
  write: PermissionType;
  auto_add_repo_collaborators: boolean;
  tiers: AllowedUsersTier[];
  relay_owner_npub?: string; // Optional field for only-me mode
}

// Simplified user structure - no more per-user permissions
export interface AllowedUser {
  npub: string;
  tier: string;
  created_at: string;
  created_by: string;
}

// Pagination structure for API responses
export interface PaginationInfo {
  page: number;
  page_size: number;
  total_pages: number;
  total_items: number;
}

// API response for getting allowed users
export interface AllowedUsersResponse {
  allowed_users: AllowedUser[];
  pagination: PaginationInfo;
}

// Request structure for adding a user
export interface AddAllowedUserRequest {
  npub: string;
  tier: string;
}

// Request structure for removing a user
export interface RemoveAllowedUserRequest {
  npub: string;
}

// API response structure
export interface ApiResponse {
  success: boolean;
  message: string;
}

// Relay Owner Management (only-me mode)
export interface RelayOwner {
  npub: string;
  created_at: string;
  created_by: string;
}

export interface RelayOwnerResponse {
  relay_owner: RelayOwner | null;
}

export interface SetRelayOwnerRequest {
  npub: string;
}

// Mode-specific configurations with validation rules
export interface ModeConfiguration {
  readOptions: PermissionType[];
  writeOptions: PermissionType[];
  forcedRead?: PermissionType;
  forcedWrite?: PermissionType;
  description: string;
}

export const MODE_CONFIGURATIONS: Record<AllowedUsersMode, ModeConfiguration> = {
  'only-me': {
    readOptions: ['only-me', 'all_users', 'allowed_users'],
    writeOptions: ['only-me'],
    forcedWrite: 'only-me',
    description: 'Personal relay for single user'
  },
  'invite-only': {
    readOptions: ['all_users', 'allowed_users'],
    writeOptions: ['allowed_users'],
    forcedWrite: 'allowed_users',
    description: 'Private community relay'
  },
  'public': {
    readOptions: ['all_users'],
    writeOptions: ['all_users'],
    forcedRead: 'all_users',
    forcedWrite: 'all_users',
    description: 'Public relay with no restrictions'
  },
  'subscription': {
    readOptions: ['all_users', 'paid_users'],
    writeOptions: ['paid_users'],
    forcedWrite: 'paid_users',
    description: 'Commercial relay with subscription tiers'
  }
};

// Default tier configurations for each mode
export const DEFAULT_TIERS: Record<AllowedUsersMode, AllowedUsersTier[]> = {
  'only-me': [
    { name: 'Personal', price_sats: 0, monthly_limit_bytes: 0, unlimited: true }
  ],
  'invite-only': [
    { name: 'Member', price_sats: 0, monthly_limit_bytes: 5368709120, unlimited: false }, // 5 GB
    { name: 'VIP', price_sats: 0, monthly_limit_bytes: 53687091200, unlimited: false }, // 50 GB
    { name: 'Unlimited', price_sats: 0, monthly_limit_bytes: 0, unlimited: true }
  ],
  'public': [
    { name: 'Basic', price_sats: 0, monthly_limit_bytes: 104857600, unlimited: false, active: true }, // 100 MB - default active
    { name: 'Standard', price_sats: 0, monthly_limit_bytes: 524288000, unlimited: false }, // 500 MB
    { name: 'Plus', price_sats: 0, monthly_limit_bytes: 1073741824, unlimited: false } // 1 GB
  ],
  'subscription': [
    { name: 'Starter', price_sats: 1000, monthly_limit_bytes: 1073741824, unlimited: false }, // 1 GB
    { name: 'Professional', price_sats: 5000, monthly_limit_bytes: 5368709120, unlimited: false }, // 5 GB
    { name: 'Business', price_sats: 10000, monthly_limit_bytes: 10737418240, unlimited: false } // 10 GB
  ]
};

// Helper function to get permission label
export const getPermissionLabel = (permission: PermissionType): string => {
  switch (permission) {
    case 'all_users':
      return 'All Users';
    case 'paid_users':
      return 'Paid Users';
    case 'allowed_users':
      return 'Allowed Users';
    case 'only-me':
      return 'Only Me';
    default:
      return permission;
  }
};
