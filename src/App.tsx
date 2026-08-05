import React from 'react';
import { ConfigProvider } from 'antd';
import { HelmetProvider } from 'react-helmet-async';
import deDe from 'antd/lib/locale/de_DE';
import enUS from 'antd/lib/locale/en_US';
import GlobalStyle from './styles/GlobalStyle';
import { AppRouter } from './components/router/AppRouter';
import { useLanguage } from './hooks/useLanguage';
import { useAutoNightMode } from './hooks/useAutoNightMode';
import { usePWA } from './hooks/usePWA';
import { useThemeWatcher } from './hooks/useThemeWatcher';
import { useFullscreenModalFix } from './hooks/useFullscreenModalFix';
// NDK removed - login uses window.nostr directly, profile API uses panel API

const App: React.FC = () => {
  const { language } = useLanguage();

  usePWA();

  useAutoNightMode();

  useThemeWatcher();
  
  useFullscreenModalFix();

  return (
    <>
      <meta name="theme-color" content="#000000" />
      <GlobalStyle />
      <HelmetProvider>
        <ConfigProvider
          locale={language === 'en' ? enUS : deDe}
          getPopupContainer={() => {
            // Always use root element for all Ant Design popups to support fullscreen
            const root = document.getElementById('root');
            return root || document.body;
          }}
        >
          <AppRouter />
        </ConfigProvider>
      </HelmetProvider>
    </>
  );
};

export default App;