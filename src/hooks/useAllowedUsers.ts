import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import {
  getAllowedUsersSettings,
  updateAllowedUsersSettings,
  getAllowedUsers,
  addAllowedUser,
  removeAllowedUser
} from '@app/api/allowedUsers.api';
import {
  AllowedUsersSettings,
  AllowedUsersMode,
  AllowedUser,
  AllowedUsersResponse,
  DEFAULT_TIERS
} from '@app/types/allowedUsers.types';

// Hook for managing allowed users settings
export const useAllowedUsersSettings = () => {
  const [settings, setSettings] = useState<AllowedUsersSettings>({
    mode: 'public',
    read: 'all_users',
    write: 'all_users',
    auto_add_repo_collaborators: false,
    tiers: DEFAULT_TIERS['public']
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllowedUsersSettings();
      setSettings(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch settings';
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSettings = useCallback(async (newSettings: AllowedUsersSettings) => {
    setLoading(true);
    setError(null);
    try {
      await updateAllowedUsersSettings(newSettings);
      setSettings(newSettings);
      message.success('Settings updated successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update settings';

      // Handle specific wallet service error for subscription mode
      if (errorMessage.includes('wallet service is not available') ||
          errorMessage.includes('cannot switch to subscription mode')) {
        setError('Subscription mode requires active wallet service');
        message.error({
          content: 'Subscription mode requires Bitcoin payments, but the relay wallet service is not running. Please start the wallet service to generate Bitcoin addresses for user payments before enabling subscription mode.',
          duration: 8
        });
      } else {
        setError(errorMessage);
        message.error(errorMessage);
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return {
    settings,
    loading,
    error,
    updateSettings,
    refetch: fetchSettings
  };
};

// Hook for managing allowed users list
export const useAllowedUsersList = () => {
  const [users, setUsers] = useState<AllowedUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    page_size: 20,
    total_pages: 1,
    total_items: 0
  });

  const fetchUsers = useCallback(async (page = 1, pageSize = 20) => {
    setLoading(true);
    setError(null);
    try {
      const response: AllowedUsersResponse = await getAllowedUsers(page, pageSize);
      setUsers(response.allowed_users);
      setPagination(response.pagination);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch users';
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const addUser = useCallback(async (npub: string, tier: string) => {
    setLoading(true);
    setError(null);
    try {
      await addAllowedUser({ npub, tier });
      message.success('User added successfully');
      // Refresh the list
      await fetchUsers(pagination.page, pagination.page_size);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add user';
      setError(errorMessage);
      message.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchUsers, pagination.page, pagination.page_size]);

  const removeUser = useCallback(async (npub: string) => {
    setLoading(true);
    setError(null);
    try {
      await removeAllowedUser({ npub });
      message.success('User removed successfully');
      // Refresh the list
      await fetchUsers(pagination.page, pagination.page_size);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove user';
      setError(errorMessage);
      message.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchUsers, pagination.page, pagination.page_size]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    loading,
    error,
    pagination,
    addUser,
    removeUser,
    refetch: fetchUsers
  };
};

// Legacy hook for backward compatibility - will be removed
export const useAllowedUsersNpubs = (type: 'read' | 'write') => {
  const { users, loading, error, addUser, removeUser, refetch } = useAllowedUsersList();

  return {
    npubs: users,
    loading,
    error,
    addNpub: addUser,
    removeNpub: removeUser,
    refetch
  };
};

// Validation hook
export const useAllowedUsersValidation = () => {
  const validateNpub = useCallback((npub: string): string | null => {
    if (!npub) {
      return 'NPUB is required';
    }

    if (!npub.startsWith('npub1')) {
      return 'NPUB must start with "npub1"';
    }

    if (npub.length !== 63) {
      return 'NPUB must be 63 characters long';
    }

    // Basic bech32 validation
    const validChars = /^[a-z0-9]+$/;
    const npubWithoutPrefix = npub.slice(5);
    if (!validChars.test(npubWithoutPrefix)) {
      return 'NPUB contains invalid characters';
    }

    return null;
  }, []);

  return {
    validateNpub
  };
};

// Main hook that combines settings and users
export const useAllowedUsers = () => {
  const settingsHook = useAllowedUsersSettings();
  const usersHook = useAllowedUsersList();
  const validation = useAllowedUsersValidation();

  return {
    ...settingsHook,
    ...usersHook,
    ...validation
  };
};
