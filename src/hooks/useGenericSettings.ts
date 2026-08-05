import { useState, useEffect, useCallback } from 'react';
import config from '@app/config/config';
import { readToken } from '@app/services/localStorage.service';
import { useHandleLogout } from './authUtils';
import { SettingsGroupName, SettingsGroupType } from '@app/types/settings.types';

// Helper function to extract the correct nested data for each settings group
const extractSettingsForGroup = (settings: any, groupName: string) => {
  console.log(`Extracting settings for group: ${groupName}`, settings);
  
  let rawData: any = {};
  
  switch (groupName) {
    case 'image_moderation':
      rawData = settings?.content_filtering?.image_moderation || {};
      break;
    
    case 'content_filter':
      rawData = settings?.content_filtering?.text_filter || {};
      break;
    
    
    case 'ollama':
      rawData = settings?.external_services?.ollama || {};
      break;
    
    case 'wallet':
      rawData = settings?.external_services?.wallet || {};
      break;
    
    case 'relay_info':
      rawData = settings?.relay || {};
      break;
    
    case 'general':
      rawData = settings?.server || {};
      break;
    
    case 'push_notifications':
      rawData = settings?.push_notifications || {};
      break;
    
    default:
      console.warn(`Unknown settings group: ${groupName}`);
      return {};
  }

  // Handle the prefixed field name issue
  // The backend returns both prefixed and unprefixed fields, but forms expect prefixed ones
  if (groupName === 'image_moderation' && rawData) {
    const processedData: any = {};
    
    // Map backend fields to prefixed ones that the form expects
    // Based on the actual backend response, backend sends both prefixed and unprefixed versions
    const imageModerationMappings: Record<string, string[]> = {
      'image_moderation_api': ['image_moderation_api', 'api'],
      'image_moderation_check_interval': ['image_moderation_check_interval_seconds', 'check_interval_seconds'],
      'image_moderation_concurrency': ['image_moderation_concurrency', 'concurrency'],
      'image_moderation_enabled': ['image_moderation_enabled', 'enabled'],
      'image_moderation_mode': ['image_moderation_mode', 'mode'],
      'image_moderation_temp_dir': ['image_moderation_temp_dir', 'temp_dir'],
      'image_moderation_threshold': ['image_moderation_threshold', 'threshold'],
      'image_moderation_timeout': ['image_moderation_timeout_seconds', 'timeout_seconds']
    };
    
    // Map fields, prioritizing prefixed versions if they exist
    Object.entries(imageModerationMappings).forEach(([formField, possibleBackendFields]) => {
      for (const backendField of possibleBackendFields) {
        if (rawData[backendField] !== undefined) {
          processedData[formField] = rawData[backendField];
          break; // Use the first found value
        }
      }
    });
    
    console.log(`Processed ${groupName} data:`, processedData);
    return processedData;
  }
  
  if (groupName === 'content_filter' && rawData) {
    const processedData: any = {};
    
    // Handle content filter prefixed fields
    const contentFilterMappings: Record<string, string> = {
      'content_filter_cache_size': 'cache_size',
      'content_filter_cache_ttl': 'cache_ttl_seconds', 
      'content_filter_enabled': 'enabled',
      'full_text_kinds': 'full_text_search_kinds' // Special mapping
    };
    
    // Start with raw data
    Object.keys(rawData).forEach(key => {
      processedData[key] = rawData[key];
    });
    
    // Apply prefixed field mappings
    Object.entries(contentFilterMappings).forEach(([prefixedKey, rawKey]) => {
      if (rawData[rawKey] !== undefined) {
        processedData[prefixedKey] = rawData[rawKey];
      }
    });
    
    console.log(`Processed ${groupName} data:`, processedData);
    return processedData;
  }
  
  
  // Handle wallet field name mapping
  if (groupName === 'wallet' && rawData) {
    const processedData: any = {};
    
    // Map backend field names to frontend field names
    const walletMappings: Record<string, string> = {
      'wallet_name': 'name',
      'wallet_api_key': 'key' // Backend sends 'key', frontend expects 'wallet_api_key'
    };
    
    // Apply field mappings
    Object.entries(walletMappings).forEach(([frontendKey, backendKey]) => {
      if (rawData[backendKey] !== undefined) {
        processedData[frontendKey] = rawData[backendKey];
      }
    });
    
    console.log(`Processed ${groupName} data:`, processedData);
    return processedData;
  }
  
  // Handle general settings field name mapping
  if (groupName === 'general' && rawData) {
    const processedData: any = {};
    
    // General settings come from both server and relay sections
    // We need to access both sections from the root settings
    const relayData = settings?.relay || {};
    
    // Map backend field names to frontend field names
    // Some fields come from server section, others from relay section
    const generalMappings: Record<string, { section: string; field: string }> = {
      'port': { section: 'server', field: 'port' },
      'private_key': { section: 'relay', field: 'private_key' },
      'service_tag': { section: 'relay', field: 'service_tag' },
      'relay_stats_db': { section: 'server', field: 'stats_db' },
      'proxy': { section: 'server', field: 'proxy' }, // May not exist
      'demo_mode': { section: 'server', field: 'demo' },
      'web': { section: 'server', field: 'web' }
    };
    
    // Apply field mappings
    Object.entries(generalMappings).forEach(([frontendKey, mapping]) => {
      const sourceData = mapping.section === 'relay' ? relayData : rawData;
      if (sourceData[mapping.field] !== undefined) {
        processedData[frontendKey] = sourceData[mapping.field];
      } else {
        // Set default values for missing fields
        if (frontendKey === 'relay_stats_db') {
          processedData[frontendKey] = ''; // Default empty
        } else if (frontendKey === 'proxy') {
          processedData[frontendKey] = false; // Default false
        }
      }
    });
    
    console.log(`Processed ${groupName} data:`, processedData);
    return processedData;
  }
  
  // Handle relay info field name mapping
  if (groupName === 'relay_info' && rawData) {
    const processedData: any = {};
    
    // Map backend field names to frontend field names
    const relayInfoMappings: Record<string, string> = {
      'relayname': 'name',
      'relaydescription': 'description', 
      'relaycontact': 'contact',
      'relayicon': 'icon',
      'relaypubkey': 'public_key', // Backend sends 'public_key'
      'relaydhtkey': 'dht_key',
      'relaysoftware': 'software',
      'relayversion': 'version',
      'relaysupportednips': 'supported_nips'
    };
    
    // Apply field mappings
    Object.entries(relayInfoMappings).forEach(([frontendKey, backendKey]) => {
      if (rawData[backendKey] !== undefined) {
        processedData[frontendKey] = rawData[backendKey];
        if (frontendKey === 'relayicon') {
          console.log(`Icon mapping: ${frontendKey} = ${rawData[backendKey]}`);
        }
      } else {
        // Set default values for missing fields
        if (frontendKey === 'relaysupportednips') {
          processedData[frontendKey] = []; // Default empty array
        }
        if (frontendKey === 'relayicon') {
          console.log(`Icon field '${backendKey}' not found in rawData:`, Object.keys(rawData));
        }
      }
    });
    
    console.log(`Processed ${groupName} data:`, processedData);
    return processedData;
  }
  
  // Handle push notifications field name mapping
  if (groupName === 'push_notifications' && rawData) {
    const processedData: any = {};
    
    // Copy top-level fields directly
    if (rawData.enabled !== undefined) {
      processedData.enabled = rawData.enabled;
    }
    
    // Flatten service fields
    if (rawData.service && typeof rawData.service === 'object') {
      const serviceData = rawData.service;
      if (serviceData.worker_count !== undefined) {
        processedData.service_worker_count = serviceData.worker_count;
      }
      if (serviceData.queue_size !== undefined) {
        processedData.service_queue_size = serviceData.queue_size;
      }
      if (serviceData.retry_attempts !== undefined) {
        processedData.service_retry_attempts = serviceData.retry_attempts;
      }
      if (serviceData.retry_delay !== undefined) {
        processedData.service_retry_delay = serviceData.retry_delay;
      }
      if (serviceData.batch_size !== undefined) {
        processedData.service_batch_size = serviceData.batch_size;
      }
    }
    
    // Flatten APNs fields
    if (rawData.apns && typeof rawData.apns === 'object') {
      const apnsData = rawData.apns;
      if (apnsData.enabled !== undefined) {
        processedData.apns_enabled = apnsData.enabled;
      }
      if (apnsData.key_path !== undefined) {
        processedData.apns_key_path = apnsData.key_path;
      }
      if (apnsData.bundle_id !== undefined) {
        processedData.apns_bundle_id = apnsData.bundle_id;
      }
      if (apnsData.key_id !== undefined) {
        processedData.apns_key_id = apnsData.key_id;
      }
      if (apnsData.team_id !== undefined) {
        processedData.apns_team_id = apnsData.team_id;
      }
      if (apnsData.production !== undefined) {
        processedData.apns_production = apnsData.production;
      }
    }
    
    // Flatten FCM fields
    if (rawData.fcm && typeof rawData.fcm === 'object') {
      const fcmData = rawData.fcm;
      if (fcmData.enabled !== undefined) {
        processedData.fcm_enabled = fcmData.enabled;
      }
      if (fcmData.credentials_path !== undefined) {
        processedData.fcm_credentials_path = fcmData.credentials_path;
      }
      if (fcmData.project_id !== undefined) {
        processedData.fcm_project_id = fcmData.project_id;
      }
    }
    
    console.log(`Processed ${groupName} data:`, processedData);
    return processedData;
  }
  
  return rawData;
};

// Helper function to build the nested update structure for the new API
const buildNestedUpdate = (groupName: string, data: any) => {
  switch (groupName) {
    case 'image_moderation':
      return {
        settings: {
          content_filtering: {
            image_moderation: data
          }
        }
      };
    
    case 'content_filter':
      return {
        settings: {
          content_filtering: {
            text_filter: data
          }
        }
      };
    
    
    case 'ollama':
      return {
        settings: {
          external_services: {
            ollama: data
          }
        }
      };
    
    case 'wallet':
      // Reverse the field mapping for saving
      const backendWalletData: any = {};
      const walletFieldMappings: Record<string, string> = {
        'name': 'wallet_name',
        'key': 'wallet_api_key'
      };
      
      Object.entries(walletFieldMappings).forEach(([backendKey, frontendKey]) => {
        if (data[frontendKey] !== undefined) {
          backendWalletData[backendKey] = data[frontendKey];
        }
      });
      
      return {
        settings: {
          external_services: {
            wallet: backendWalletData
          }
        }
      };
    
    case 'relay_info':
      // Reverse the field mapping for saving
      const backendRelayData: any = {};
      const relayFieldMappings: Record<string, string> = {
        'name': 'relayname',
        'description': 'relaydescription',
        'contact': 'relaycontact',
        'icon': 'relayicon',
        'public_key': 'relaypubkey', // Frontend 'relaypubkey' -> backend 'public_key'
        'dht_key': 'relaydhtkey',
        'software': 'relaysoftware',
        'version': 'relayversion',
        'supported_nips': 'relaysupportednips'
      };
      
      Object.entries(relayFieldMappings).forEach(([backendKey, frontendKey]) => {
        if (data[frontendKey] !== undefined) {
          // Special handling for supported_nips to ensure they're numbers
          if (backendKey === 'supported_nips') {
            const nips = data[frontendKey];
            if (Array.isArray(nips)) {
              backendRelayData[backendKey] = nips.map((nip: any) => Number(nip)).filter((nip: number) => !isNaN(nip));
            } else {
              backendRelayData[backendKey] = [];
            }
          } else {
            backendRelayData[backendKey] = data[frontendKey];
          }
        }
      });
      
      return {
        settings: {
          relay: backendRelayData
        }
      };
    
    case 'general':
      // Reverse the field mapping for saving
      // General settings need to be split between server and relay sections
      const serverData: any = {};
      const relayData: any = {};
      
      const generalFieldMappings: Record<string, { section: string; field: string }> = {
        'port': { section: 'server', field: 'port' },
        'private_key': { section: 'relay', field: 'private_key' },
        'service_tag': { section: 'relay', field: 'service_tag' },
        'stats_db': { section: 'server', field: 'relay_stats_db' },
        'proxy': { section: 'server', field: 'proxy' },
        'demo': { section: 'server', field: 'demo_mode' }, // Frontend 'demo_mode' -> backend 'demo'
        'web': { section: 'server', field: 'web' }
      };
      
      Object.entries(generalFieldMappings).forEach(([backendField, mapping]) => {
        const frontendField = mapping.field;
        if (data[frontendField] !== undefined) {
          if (mapping.section === 'server') {
            serverData[backendField] = data[frontendField];
          } else {
            relayData[backendField] = data[frontendField];
          }
        }
      });
      
      // Return nested structure with both server and relay sections
      const result: any = { settings: {} };
      if (Object.keys(serverData).length > 0) {
        result.settings.server = serverData;
      }
      if (Object.keys(relayData).length > 0) {
        result.settings.relay = relayData;
      }
      
      return result;
    
    case 'push_notifications':
      // Transform flat field names back to nested structure for backend
      const backendPushData: any = {};
      
      // Handle top-level fields
      if (data.enabled !== undefined) {
        backendPushData.enabled = data.enabled;
      }
      
      // Handle service fields - group them under service object
      const serviceFields = ['service_worker_count', 'service_queue_size', 'service_retry_attempts', 'service_retry_delay', 'service_batch_size'];
      const serviceData: any = {};
      let hasServiceFields = false;
      
      serviceFields.forEach(flatFieldName => {
        if (data[flatFieldName] !== undefined) {
          const backendFieldName = flatFieldName.replace('service_', '');
          serviceData[backendFieldName] = data[flatFieldName];
          hasServiceFields = true;
        }
      });
      
      if (hasServiceFields) {
        backendPushData.service = serviceData;
      }
      
      // Handle APNs fields - group them under apns object
      const apnsFields = ['apns_enabled', 'apns_key_path', 'apns_bundle_id', 'apns_key_id', 'apns_team_id', 'apns_production'];
      const apnsData: any = {};
      let hasApnsFields = false;
      
      apnsFields.forEach(flatFieldName => {
        if (data[flatFieldName] !== undefined) {
          const backendFieldName = flatFieldName.replace('apns_', '');
          apnsData[backendFieldName] = data[flatFieldName];
          hasApnsFields = true;
        }
      });
      
      if (hasApnsFields) {
        backendPushData.apns = apnsData;
      }
      
      // Handle FCM fields - group them under fcm object
      const fcmFields = ['fcm_enabled', 'fcm_credentials_path', 'fcm_project_id'];
      const fcmData: any = {};
      let hasFcmFields = false;
      
      fcmFields.forEach(flatFieldName => {
        if (data[flatFieldName] !== undefined) {
          const backendFieldName = flatFieldName.replace('fcm_', '');
          fcmData[backendFieldName] = data[flatFieldName];
          hasFcmFields = true;
        }
      });
      
      if (hasFcmFields) {
        backendPushData.fcm = fcmData;
      }
      
      console.log('Push notifications: transforming flat data to nested for backend:', { flatData: data, nestedData: backendPushData });
      
      return {
        settings: {
          push_notifications: backendPushData
        }
      };
    
    default:
      console.warn(`Unknown settings group for save: ${groupName}`);
      return {
        settings: {}
      };
  }
};

interface UseGenericSettingsResult<T> {
  settings: T | null;
  loading: boolean;
  error: Error | null;
  fetchSettings: () => Promise<void>;
  updateSettings: (updatedSettings: Partial<T>) => void;
  saveSettings: () => Promise<void>;
  updateSetting: (key: string, value: any) => Promise<void>;
}

/**
 * A hook for managing generic settings groups
 * @param groupName The name of the settings group to manage
 * @returns Object containing settings data and methods to fetch, update, and save settings
 */
const useGenericSettings = <T extends SettingsGroupName>(
  groupName: T
): UseGenericSettingsResult<SettingsGroupType<T>> => {
  const [settings, setSettings] = useState<SettingsGroupType<T> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const handleLogout = useHandleLogout();
  const token = readToken();

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log(`Fetching ${groupName} settings...`);

      const response = await fetch(`${config.baseURL}/api/settings`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        console.error('Unauthorized access, logging out');
        handleLogout();
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(`Raw settings data:`, data);
      
      // Extract the correct nested data based on groupName
      const settingsData = extractSettingsForGroup(data.settings, groupName) as SettingsGroupType<T>;

      if (!settingsData) {
        console.warn(`No settings data found for group: ${groupName}`);
        // Return empty object instead of null to prevent errors when accessing properties
        setSettings({} as SettingsGroupType<T>);
      } else {
        console.log(`Processed ${groupName} settings:`, settingsData);
        
        // Handle all settings groups the same way - no special handling for image_moderation
        // This approach works for all other settings groups, so it should work for image_moderation too
        setSettings(settingsData as SettingsGroupType<T>);
      }
    } catch (error) {
      console.error(`Error fetching ${groupName} settings:`, error);
      setError(error instanceof Error ? error : new Error(String(error)));
      // Set empty object on error to prevent null reference errors
      setSettings({} as SettingsGroupType<T>);
    } finally {
      setLoading(false);
    }
  }, [groupName, token, handleLogout]);

  const updateSettings = useCallback((updatedSettings: Partial<SettingsGroupType<T>>) => {
    console.log(`Updating ${groupName} settings:`, updatedSettings);

    // All groups should preserve existing settings when updating
    setSettings(prevSettings => {
      if (!prevSettings) {
        console.log(`No previous ${groupName} settings, using updated settings as initial`);
        return updatedSettings as SettingsGroupType<T>;
      }

      // Create a deep copy of the previous settings
      const prevSettingsCopy = { ...prevSettings };

      // Only update the changed fields, preserving all other fields
      const newSettings = { ...prevSettingsCopy, ...updatedSettings };

      console.log(`Previous settings:`, prevSettingsCopy);
      console.log(`Updated fields:`, updatedSettings);
      console.log(`Merged settings:`, newSettings);

      return newSettings;
    });
  }, [groupName]);

  const updateSetting = useCallback(async (key: string, value: any) => {
    try {
      setLoading(true);
      setError(null);

      const nestedUpdate = buildNestedUpdate(groupName, { [key]: value });

      const response = await fetch(`${config.baseURL}/api/settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(nestedUpdate),
      });

      if (response.status === 401) {
        handleLogout();
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await fetchSettings();
    } catch (error) {
      setError(error instanceof Error ? error : new Error(String(error)));
      throw error;
    } finally {
      setLoading(false);
    }
  }, [groupName, token, handleLogout, fetchSettings]);

  const saveSettings = useCallback(async () => {
    if (!settings) {
      console.warn('No settings to save');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      for (const [key, value] of Object.entries(settings)) {
        await updateSetting(key, value);
      }

      console.log(`${groupName} settings saved successfully`);
    } catch (error) {
      console.error(`Error saving ${groupName} settings:`, error);
      setError(error instanceof Error ? error : new Error(String(error)));
      throw error;
    } finally {
      setLoading(false);
    }
  }, [groupName, settings, updateSetting]);

  // Fetch settings on mount
  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return {
    settings,
    loading,
    error,
    fetchSettings,
    updateSettings,
    saveSettings,
    updateSetting,
  };
};

export default useGenericSettings;
