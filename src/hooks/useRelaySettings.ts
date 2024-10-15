import { useState, useEffect, useCallback } from 'react';
import config from '@app/config/config';
import { readToken } from '@app/services/localStorage.service';
import { useHandleLogout } from './authUtils';

interface RelaySettings {
  mode: string;
  protocol: string[];
  kinds: string[];
  dynamicKinds: string[];
  photos: string[];
  videos: string[];
  gitNestr: string[];
  audio: string[];
  appBuckets: string[];
  dynamicAppBuckets: string[];
  isKindsActive: boolean;
  isPhotosActive: boolean;
  isVideosActive: boolean;
  isGitNestrActive: boolean;
  isAudioActive: boolean;
  isFileStorageActive: boolean;
}

const getInitialSettings = (): RelaySettings => {
  const savedSettings = localStorage.getItem('relaySettings');
  return savedSettings
    ? JSON.parse(savedSettings)
    : {
        mode: 'smart',
        protocol: ['WebSocket'],
        dynamicKinds: [],
        kinds: [],
        photos: [],
        videos: [],
        gitNestr: [],
        audio: [],
        appBuckets: [],
        dynamicAppBuckets: [],
        isKindsActive: true,
        isPhotosActive: true,
        isVideosActive: true,
        isGitNestrActive: true,
        isAudioActive: true,
        isFileStorageActive: false,
      };
};

const useRelaySettings = () => {
  const [relaySettings, setRelaySettings] = useState<RelaySettings>(getInitialSettings());

  useEffect(() => {
    localStorage.setItem('relaySettings', JSON.stringify(relaySettings));
  }, [relaySettings]);

  const handleLogout = useHandleLogout();

  const token = readToken();

  const fetchSettings = useCallback(async () => {
    try {
      const response = await fetch(`${config.baseURL}/api/relay-settings`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.status === 401) {
        console.error('Unauthorized: Invalid or expired token');
        handleLogout();
      }
      if (!response.ok) {
        throw new Error(`Network response was not ok (status: ${response.status})`);
      }

      const data = await response.json();

      const storedAppBuckets = JSON.parse(localStorage.getItem('appBuckets') || '[]');
      const storedDynamicKinds = JSON.parse(localStorage.getItem('dynamicKinds') || '[]');

      const newAppBuckets =
        data.relay_settings.dynamicAppBuckets == undefined
          ? []
          : data.relay_settings.dynamicAppBuckets.filter((bucket: string) => !storedAppBuckets.includes(bucket));
      const newDynamicKinds =
        data.relay_settings.dynamicKinds == undefined
          ? []
          : data.relay_settings.dynamicKinds.filter((kind: string) => !storedDynamicKinds.includes(kind));

      if (newAppBuckets.length > 0) {
        localStorage.setItem('appBuckets', JSON.stringify([...storedAppBuckets, ...newAppBuckets]));
      }
      if (newDynamicKinds.length > 0) {
        localStorage.setItem('dynamicKinds', JSON.stringify([...storedDynamicKinds, ...newDynamicKinds]));
      }
      setRelaySettings({
        ...data.relay_settings,
        protocol: Array.isArray(data.relay_settings.protocol)
          ? data.relay_settings.protocol
          : [data.relay_settings.protocol],
      });
      localStorage.setItem('relaySettings', JSON.stringify(data.relay_settings));
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  }, []);

  const updateSettings = useCallback((category: keyof RelaySettings, value: string | string[] | boolean | number) => {
    setRelaySettings((prevSettings) => ({
      ...prevSettings,
      [category]: value,
    }));
  }, []);

  const saveSettings = useCallback(async () => {
    try {
      const response = await fetch(`${config.baseURL}/api/relay-settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ relay_settings: relaySettings }),
      });
      if (!response.ok) {
        throw new Error(`Network response was not ok (status: ${response.status})`);
      }
      localStorage.setItem('settingsCache', JSON.stringify(relaySettings));
      console.log('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  }, [relaySettings]);

  return { relaySettings, fetchSettings, updateSettings, saveSettings };
};

export default useRelaySettings;
