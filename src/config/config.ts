// The relay serves both the panel and its API from the same origin.
// Keep this runtime-derived so one production build works on any host, port, or protocol.
const config = {
  baseURL: window.location.origin,
  isDemoMode: process.env.REACT_APP_DEMO_MODE === 'true',
  // Wallet operations now routed through panel API - always enabled
  isWalletEnabled: true,
  
  // Nostr relay configuration removed - using panel API for all operations
  
  
  // Notification settings
  notifications: {
    // 5 minutes in milliseconds
    pollingInterval: 5 * 60 * 1000,
    // Decrease polling frequency when tab is not focused
    backgroundPollingInterval: 15 * 60 * 1000,
  },
};

export default config;
