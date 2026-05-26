import config from '@app/config/config';
import { readToken } from '@app/services/localStorage.service';
import {
  AllowedUsersSettings,
  AllowedUsersResponse,
  AddAllowedUserRequest,
  RemoveAllowedUserRequest,
  ApiResponse,
  AllowedUsersMode,
  DEFAULT_TIERS,
  RelayOwnerResponse,
  SetRelayOwnerRequest
} from '@app/types/allowedUsers.types';

// Settings Management
export const getAllowedUsersSettings = async (): Promise<AllowedUsersSettings> => {
  const token = readToken();
  const response = await fetch(`${config.baseURL}/api/settings`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

  const text = await response.text();
  try {
    const data = JSON.parse(text);

    // Extract allowed_users from the new nested structure
    const allowedUsersData = data.settings?.allowed_users;
    if (!allowedUsersData) {
      throw new Error('No allowed_users data found in response');
    }

    // Transform tiers from backend format to frontend format
    let transformedTiers = [];

    // Check if tiers exist in response, otherwise use defaults
    if (allowedUsersData.tiers && Array.isArray(allowedUsersData.tiers)) {
      transformedTiers = allowedUsersData.tiers.map((tier: any) => ({
        name: tier.name || 'Unnamed Tier',
        price_sats: tier.price_sats || 0,
        monthly_limit_bytes: tier.monthly_limit_bytes || 0,
        unlimited: tier.unlimited || false
      }));
    } else {
      // Use default tiers for the mode if none provided
      const mode = allowedUsersData.mode as AllowedUsersMode;
      transformedTiers = DEFAULT_TIERS[mode] || DEFAULT_TIERS['public'];
    }

    const transformedSettings = {
      mode: allowedUsersData.mode || 'public',
      read: allowedUsersData.read || 'all_users',
      write: allowedUsersData.write || 'all_users',
      auto_add_repo_collaborators: Boolean(allowedUsersData.auto_add_repo_collaborators),
      tiers: transformedTiers,
      relay_owner_npub: allowedUsersData.relay_owner_npub || ''
    };

    return transformedSettings;
  } catch (jsonError) {
    throw new Error(`Invalid JSON response: ${text}`);
  }
};

export const updateAllowedUsersSettings = async (settings: AllowedUsersSettings): Promise<ApiResponse> => {
  const token = readToken();

  // Transform to nested format as expected by new unified backend API
  // Note: relay_owner_npub is no longer sent in settings - it's managed via /api/allowed-users
  const nestedSettings = {
    "settings": {
      "allowed_users": {
        "mode": settings.mode,
        "read": settings.read,
        "write": settings.write,
        "auto_add_repo_collaborators": settings.auto_add_repo_collaborators,
        "tiers": settings.mode === 'public'
          ? settings.tiers.filter(tier => tier.active).map(tier => ({
              "name": tier.name,
              "price_sats": tier.price_sats,
              "monthly_limit_bytes": tier.monthly_limit_bytes,
              "unlimited": tier.unlimited
            }))
          : settings.tiers.map(tier => ({
              "name": tier.name,
              "price_sats": tier.price_sats,
              "monthly_limit_bytes": tier.monthly_limit_bytes,
              "unlimited": tier.unlimited
            }))
      }
    }
  };

  // Comprehensive logging for debugging
  console.group('🔧 [API] Updating Allowed Users Settings');
  console.log('📤 Original frontend settings:', settings);
  console.log('📦 Transformed payload for backend:', nestedSettings);
  console.log('🎯 Mode being sent:', settings.mode);
  console.log('📖 Read permission:', settings.read);
  console.log('✍️ Write permission:', settings.write);
  console.log('🏷️ Number of tiers:', settings.tiers.length);
  console.log('📋 Tiers details:', settings.tiers);
  console.log('🌐 Request URL:', `${config.baseURL}/api/settings`);
  console.log('📄 Request body (stringified):', JSON.stringify(nestedSettings, null, 2));
  console.groupEnd();

  const response = await fetch(`${config.baseURL}/api/settings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(nestedSettings),
  });

  const text = await response.text();

  // Log response details
  console.group('📥 [API] Settings Update Response');
  console.log('📊 Response status:', response.status);
  console.log('✅ Response OK:', response.ok);
  console.log('📄 Response text:', text);
  console.groupEnd();

  if (!response.ok) {
    console.error('❌ [API] Settings update failed:', {
      status: response.status,
      statusText: response.statusText,
      responseText: text,
      sentPayload: nestedSettings
    });
    throw new Error(`HTTP error! status: ${response.status}, response: ${text}`);
  }

  try {
    const parsedResponse = JSON.parse(text);
    console.log('✅ [API] Settings update successful:', parsedResponse);
    return parsedResponse;
  } catch (jsonError) {
    // If response is not JSON, assume success if status was OK
    console.log('ℹ️ [API] Non-JSON response, assuming success');
    return { success: true, message: 'Settings updated successfully' };
  }
};

// Unified User Management - Using correct invite-only endpoints
export const getAllowedUsers = async (page = 1, pageSize = 20): Promise<AllowedUsersResponse> => {
  const token = readToken();
  const response = await fetch(`${config.baseURL}/api/allowed/users?page=${page}&pageSize=${pageSize}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

  const text = await response.text();
  try {
    const data = JSON.parse(text);

    return {
      allowed_users: data.allowed_users || [],
      pagination: data.pagination || {
        page: page,
        page_size: pageSize,
        total_pages: 1,
        total_items: 0
      }
    };
  } catch (jsonError) {
    throw new Error(`Invalid JSON response: ${text}`);
  }
};

export const addAllowedUser = async (request: AddAllowedUserRequest): Promise<ApiResponse> => {
  const token = readToken();

  // Backend expects NPUB format (not hex), so keep as-is
  console.group('👤 [API] Adding Allowed User');
  console.log('📤 Request payload:', request);
  console.log('🌐 Request URL:', `${config.baseURL}/api/allowed/add`);
  console.log('📄 Request body (stringified):', JSON.stringify(request, null, 2));
  console.log('🔑 Authorization token present:', !!token);
  console.groupEnd();

  // Using correct POST method with request body
  const response = await fetch(`${config.baseURL}/api/allowed/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  });

  const text = await response.text();

  // Log response details
  console.group('📥 [API] Add User Response');
  console.log('📊 Response status:', response.status);
  console.log('✅ Response OK:', response.ok);
  console.log('📄 Response text:', text);
  console.groupEnd();

  if (!response.ok) {
    console.error('❌ [API] Add user failed:', {
      status: response.status,
      statusText: response.statusText,
      responseText: text,
      sentPayload: request
    });
    throw new Error(`HTTP error! status: ${response.status}, response: ${text}`);
  }

  try {
    const parsedResponse = JSON.parse(text);
    console.log('✅ [API] Add user successful:', parsedResponse);
    return parsedResponse;
  } catch (jsonError) {
    console.log('ℹ️ [API] Non-JSON response, assuming success');
    return { success: true, message: 'User added successfully' };
  }
};

export const removeAllowedUser = async (request: RemoveAllowedUserRequest): Promise<ApiResponse> => {
  const token = readToken();

  // Using correct DELETE method with request body
  const response = await fetch(`${config.baseURL}/api/allowed/remove`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch (jsonError) {
    throw new Error(`Invalid JSON response: ${text}`);
  }
};

// Relay Owner Management API (for only-me mode)
export const getRelayOwner = async (): Promise<RelayOwnerResponse> => {
  const token = readToken();

  console.group('🔍 [API] Getting Relay Owner');
  console.log('🌐 Request URL:', `${config.baseURL}/api/admin/owner`);
  console.log('🔑 Authorization token present:', !!token);
  console.groupEnd();

  const response = await fetch(`${config.baseURL}/api/admin/owner`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const text = await response.text();

  console.group('📥 [API] Get Owner Response');
  console.log('📊 Response status:', response.status);
  console.log('✅ Response OK:', response.ok);
  console.log('📄 Response text:', text);
  console.groupEnd();

  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

  try {
    const parsedResponse = JSON.parse(text);
    console.log('✅ [API] Get owner successful:', parsedResponse);
    return parsedResponse;
  } catch (jsonError) {
    throw new Error(`Invalid JSON response: ${text}`);
  }
};

export const setRelayOwner = async (request: SetRelayOwnerRequest): Promise<ApiResponse> => {
  const token = readToken();

  console.group('👤 [API] Setting Relay Owner');
  console.log('📤 Request payload:', request);
  console.log('🌐 Request URL:', `${config.baseURL}/api/admin/owner`);
  console.groupEnd();

  const response = await fetch(`${config.baseURL}/api/admin/owner`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  });

  const text = await response.text();

  console.group('📥 [API] Set Owner Response');
  console.log('📊 Response status:', response.status);
  console.log('✅ Response OK:', response.ok);
  console.log('📄 Response text:', text);
  console.groupEnd();

  if (!response.ok) {
    console.error('❌ [API] Set owner failed:', {
      status: response.status,
      statusText: response.statusText,
      responseText: text,
      sentPayload: request
    });
    throw new Error(`HTTP error! status: ${response.status}, response: ${text}`);
  }

  try {
    const parsedResponse = JSON.parse(text);
    console.log('✅ [API] Set owner successful:', parsedResponse);
    return parsedResponse;
  } catch (jsonError) {
    console.log('ℹ️ [API] Non-JSON response, assuming success');
    return { success: true, message: 'Relay owner set successfully' };
  }
};

export const removeRelayOwner = async (): Promise<ApiResponse> => {
  const token = readToken();

  const response = await fetch(`${config.baseURL}/api/admin/owner`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

  const text = await response.text();
  try {
    const parsedResponse = JSON.parse(text);
    return parsedResponse;
  } catch (jsonError) {
    return { success: true, message: 'Relay owner removed successfully' };
  }
};
