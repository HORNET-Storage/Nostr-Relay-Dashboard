import { useState, useCallback } from 'react';
import config from '@app/config/config';
import { readToken } from '@app/services/localStorage.service';
import { useHandleLogout } from './authUtils';
import { Settings } from '@app/constants/relaySettings';
import { CORE_KINDS, ensureCoreKinds } from '@app/constants/coreKinds';

const getInitialSettings = (): Settings => ({
  allowUnregisteredKinds: false, // Default to strict mode
  registeredKinds: [], // Will be populated from backend
  protocol: ['WebSocket'],
  kinds: [...CORE_KINDS], // Always start with core kinds
  dynamicKinds: [],
  photos: [],
  videos: [],
  nosis: [],
  audio: [],
  isKindsActive: true,
  isPhotosActive: true,
  isVideosActive: true,
  isNosisActive: true,
  isAudioActive: true,
  isFileStorageActive: false,
  moderationMode: 'strict', // Default to strict mode
  // Default file size limits in MB
  photoMaxSizeMB: 100,
  videoMaxSizeMB: 500,
  audioMaxSizeMB: 100
});

const useRelaySettings = () => {
  const [relaySettings, setRelaySettings] = useState<Settings>(getInitialSettings());

  const handleLogout = useHandleLogout();
  const token = readToken();

  // Transformation function for backend response
  const transformFromBackendSettings = useCallback((backendData: any): Settings => {
    console.log('Raw backend settings:', backendData);
    const settings = getInitialSettings();
    
    // Map from actual backend structure
    if (backendData.event_filtering) {
      // New fields
      settings.allowUnregisteredKinds = backendData.event_filtering.allow_unregistered_kinds || false;
      settings.registeredKinds = backendData.event_filtering.registered_kinds || [];
      settings.moderationMode = backendData.event_filtering.moderation_mode || 'strict';
      
      // Handle kinds - now simply extract from kind_whitelist
      const backendKinds = backendData.event_filtering.kind_whitelist || [];
      
      // Get all stored dynamic kinds from localStorage
      const allStoredDynamicKinds = JSON.parse(localStorage.getItem('dynamicKinds') || '[]');
      
      // Simply separate kinds into registered (predefined) and dynamic
      settings.kinds = ensureCoreKinds(backendKinds.filter((kind: string) =>
        settings.registeredKinds.some((rk: number) => `kind${rk}` === kind)
      ));
      settings.dynamicKinds = backendKinds.filter((kind: string) =>
        !settings.registeredKinds.some((rk: number) => `kind${rk}` === kind) &&
        allStoredDynamicKinds.includes(kind)
      );
      
      // Extract mime types and file sizes from actual backend format
      const mediaDefinitions = backendData.event_filtering.media_definitions || {};
      const backendPhotos = mediaDefinitions.image?.mime_patterns || [];
      const backendVideos = mediaDefinitions.video?.mime_patterns || [];
      const backendAudio = mediaDefinitions.audio?.mime_patterns || [];
      
      // Media types are now directly from backend
      settings.photos = backendPhotos;
      settings.videos = backendVideos;
      settings.audio = backendAudio;
      
      // Extract file size limits
      settings.photoMaxSizeMB = mediaDefinitions.image?.max_size_mb || 100;
      settings.videoMaxSizeMB = mediaDefinitions.video?.max_size_mb || 500;
      settings.audioMaxSizeMB = mediaDefinitions.audio?.max_size_mb || 100;
      
      // Set protocols
      if (backendData.event_filtering.protocols?.enabled) {
        settings.protocol = backendData.event_filtering.protocols.allowed_protocols || ['WebSocket'];
      } else {
        settings.protocol = ['WebSocket'];
      }
    }

    // Set active states
    settings.isKindsActive = true;
    settings.isPhotosActive = true;
    settings.isVideosActive = true;
    settings.isAudioActive = true;
    settings.isFileStorageActive = true;

    return settings;
  }, []);

  const transformToBackendSettings = useCallback((settings: Settings) => {
    // Create media definitions
    const mediaDefinitions = {
      image: {
        mime_patterns: settings.photos,
        extensions: [".jpg", ".jpeg", ".png", ".gif", ".webp"],
        max_size_mb: settings.photoMaxSizeMB
      },
      video: {
        mime_patterns: settings.videos,
        extensions: [".mp4", ".webm", ".avi", ".mov"],
        max_size_mb: settings.videoMaxSizeMB
      },
      audio: {
        mime_patterns: settings.audio,
        extensions: [".mp3", ".wav", ".ogg", ".flac"],
        max_size_mb: settings.audioMaxSizeMB
      }
    };

    return {
      settings: {
        event_filtering: {
          allow_unregistered_kinds: settings.allowUnregisteredKinds,
          moderation_mode: settings.moderationMode,
          kind_whitelist: ensureCoreKinds([...settings.kinds, ...settings.dynamicKinds]),
          media_definitions: mediaDefinitions,
          dynamic_kinds: {
            enabled: false,
            allowed_kinds: []
          },
          protocols: {
            enabled: settings.protocol.length > 0,
            allowed_protocols: settings.protocol
          }
        }
      }
    };
  }, []);

  const fetchSettings = useCallback(async () => {
    try {
      const response = await fetch(`${config.baseURL}/api/settings`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        handleLogout();
        return;
      }

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      const settings = transformFromBackendSettings(data.settings);
      setRelaySettings(settings);

    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  }, [token, handleLogout, transformFromBackendSettings]);

  const saveSettings = useCallback(async () => {
    try {
      const updateRequest = transformToBackendSettings(relaySettings);
      
      const response = await fetch(`${config.baseURL}/api/settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updateRequest),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    } catch (error) {
      console.error('Error saving settings:', error);
      throw error;
    }
  }, [relaySettings, token, transformToBackendSettings]);

  const updateSettings = useCallback((category: keyof Settings, value: any) => {
    setRelaySettings(prev => ({
      ...prev,
      [category]: value
    }));
  }, []);

  return { relaySettings, fetchSettings, updateSettings, saveSettings };
};

export default useRelaySettings;
