import { useState, useEffect, useCallback } from 'react';
import config from '@app/config/config';
import { readToken } from '@app/services/localStorage.service'; // Assuming you have these services
import { useDispatch } from 'react-redux';
import { message } from 'antd';
import { useHandleLogout } from '@app/utils/authUtils';

interface RelaySettings {
  mode: string;
  protocol: string[];
  chunked: string[];
  chunksize: string;
  maxFileSize: number;
  maxFileSizeUnit: string;
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
}

const getInitialSettings = (): RelaySettings => {
  const savedSettings = localStorage.getItem('relaySettings');
  return savedSettings
    ? JSON.parse(savedSettings)
    : {
        mode: 'smart',
        protocol: ['WebSocket'],
        chunked: ['unchunked'],
        chunksize: '2',
        maxFileSize: 100,
        maxFileSizeUnit: 'MB',
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
      };
};

const useRelaySettings = () => {
  const [relaySettings, setRelaySettings] = useState<RelaySettings>(getInitialSettings());
  const dispatch = useDispatch();

  useEffect(() => {
    localStorage.setItem('relaySettings', JSON.stringify(relaySettings));
  }, [relaySettings]);

  const handleLogout = useHandleLogout();

  const fetchSettings = useCallback(async () => {
    try {
      const token = readToken(); // Read JWT from localStorage
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${config.baseURL}/relay-settings`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Add JWT to Authorization header
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          handleLogout(); // Logout on invalid token
          throw new Error('Authentication failed. Please log in again.');
        }
        throw new Error(`Network response was not ok (status: ${response.status})`);
      }

      const data = await response.json();

      const storedAppBuckets = JSON.parse(localStorage.getItem('appBuckets') || '[]');
      const storedDynamicKinds = JSON.parse(localStorage.getItem('dynamicKinds') || '[]');

      const newAppBuckets = data.relay_settings.dynamicAppBuckets?.filter((bucket: string) => !storedAppBuckets.includes(bucket)) || [];
      const newDynamicKinds = data.relay_settings.dynamicKinds?.filter((kind: string) => !storedDynamicKinds.includes(kind)) || [];

      if (newAppBuckets.length > 0) {
        localStorage.setItem('appBuckets', JSON.stringify([...storedAppBuckets, ...newAppBuckets]));
      }
      if (newDynamicKinds.length > 0) {
        localStorage.setItem('dynamicKinds', JSON.stringify([...storedDynamicKinds, ...newDynamicKinds]));
      }

      setRelaySettings({
        ...data.relay_settings,
        protocol: Array.isArray(data.relay_settings.protocol) ? data.relay_settings.protocol : [data.relay_settings.protocol],
        chunked: Array.isArray(data.relay_settings.chunked) ? data.relay_settings.chunked : [data.relay_settings.chunked],
      });

    } catch (error) {
      console.error('Error fetching settings:', error);
      message.error(error instanceof Error ? error.message : 'An error occurred');
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
      const token = readToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${config.baseURL}/relay-settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Add JWT to Authorization header
        },
        body: JSON.stringify({ relay_settings: relaySettings }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          handleLogout(); // Logout on invalid token
          throw new Error('Authentication failed. Please log in again.');
        }
        throw new Error(`Network response was not ok (status: ${response.status})`);
      }

      localStorage.setItem('settingsCache', JSON.stringify(relaySettings));
      message.success('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      message.error(error instanceof Error ? error.message : 'An error occurred');
    }
  }, [relaySettings]);

  return { relaySettings, fetchSettings, updateSettings, saveSettings };
};

export default useRelaySettings;



// import { useState, useEffect } from 'react';
// import { useTranslation } from 'react-i18next';
// import { useDispatch } from 'react-redux';
// import config from '@app/config/config';
// import { readToken, deleteToken, deleteUser } from '@app/services/localStorage.service';
// import { setUser } from '@app/store/slices/userSlice';
// import { message } from 'antd';

// interface ChartDataItem {
//   value: number;
//   name: string;
// }

// const useChartData = () => {
//   const [chartData, setChartData] = useState<ChartDataItem[] | null>(null);
//   const [isLoading, setIsLoading] = useState<boolean>(true);
//   const { t } = useTranslation();
//   const dispatch = useDispatch();

//   const handleLogout = () => {
//     deleteToken();
//     deleteUser();
//     dispatch(setUser(null));
//     console.log('Token deleted, user logged out');
//     message.info('You have been logged out. Please login again.');
//   };

//   useEffect(() => {
//     console.log('Component mounted, starting data fetch...');
//     const fetchData = async () => {
//       console.log('Preparing to fetch data...');
//       setIsLoading(true);
//       try {
//         const token = readToken();
//         if (!token) {
//           throw new Error('No authentication token found');
//         }
//         console.log('Sending request to server...');
//         const response = await fetch(`${config.baseURL}/relay-count`, {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`,
//           },
//         });
//         if (!response.ok) {
//           if (response.status === 401) {
//             handleLogout();
//             throw new Error('Authentication failed. You have been logged out.');
//           }
//           throw new Error(`Network response was not ok (status: ${response.status})`);
//         }
//         const data = await response.json();
//         console.log('Response Data:', data);
//         // Process the data into chartDataItems using translated names
//         const newChartData: ChartDataItem[] = [
//           { value: data.kinds, name: t('categories.kinds') },
//           { value: data.photos, name: t('categories.photos') },
//           { value: data.videos, name: t('categories.videos') },
//           { value: data.audio, name: t('categories.audio') },
//           { value: data.misc, name: t('categories.misc') },
//         ];
//         setChartData(newChartData);
//       } catch (error) {
//         console.error('Error:', error);
//         message.error(error instanceof Error ? error.message : 'An error occurred');
//         setChartData(null);
//       } finally {
//         console.log('Fetching process complete.');
//         setIsLoading(false);
//       }
//     };

//     fetchData();

//     return () => {
//       console.log('Cleanup called; Component unmounting...');
//     };
//   }, [t, dispatch]);

//   return { chartData, isLoading };
// };

// export default useChartData;