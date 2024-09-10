import { useEffect, useState } from 'react';
import { persistWalletToken, readWalletToken, deleteWalletToken } from '@app/services/localStorage.service'; // Import the wallet-specific functions
import { notificationController } from '@app/controllers/notificationController';

const useWalletAuth = () => {
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch the wallet token from localStorage on mount
  useEffect(() => {
    const storedToken = readWalletToken(); // Use the wallet-specific token reader
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
    }
  }, []);

  // Function to handle login with Nostr public key and challenge verification
  const login = async () => {
    setLoading(true);
    try {
      if (!window.nostr) {
        notificationController.error({ message: 'Nostr extension is not available' });
        return;
      }

      console.log("getting challenge.")

      // Fetch the Nostr public key
      const npub = await window.nostr.getPublicKey();

      // Fetch the challenge from the server
      const challengeResponse = await fetch('http://localhost:9003/challenge', { method: 'GET' });

      // Check if the response is valid JSON
      if (!challengeResponse.ok) {
        throw new Error('Network response was not ok');
      }

      const { content: challenge } = await challengeResponse.json();

      console.log(challenge)

      // Sign the challenge using Nostr
      const signedEvent = await window.nostr.signEvent({
        pubkey: npub,
        content: challenge,
        created_at: Math.floor(Date.now() / 1000),
        kind: 1,
        tags: [],
      });

      // Send the signed challenge to the backend for verification
      const verifyResponse = await fetch('http://localhost:9003/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challenge,
          signature: signedEvent.sig,
          messageHash: signedEvent.id,
          event: signedEvent,
        }),
      });

      const { token } = await verifyResponse.json();

      // Store the wallet token and mark the user as authenticated
      persistWalletToken(token); // Persist the wallet-specific token
      setToken(token);
      setIsAuthenticated(true);

      console.log('Wallet login successful!')
    } catch (error) {
      console.error('Error during wallet login:', error);
      notificationController.error({ message: 'Wallet authentication failed' });
    } finally {
      setLoading(false);
    }
  };

  // Logout and clear wallet token
  const logout = () => {
    deleteWalletToken(); // Use the wallet-specific token deletion
    setToken(null);
    setIsAuthenticated(false);
  };

  return {
    token,
    isAuthenticated,
    login,
    logout,
    loading,
  };
};

export default useWalletAuth;



// import { useEffect, useState } from 'react';
// import { persistToken, readToken, deleteToken } from '@app/services/localStorage.service';
// import { notificationController } from '@app/controllers/notificationController';

// const useWalletAuth = () => {
//   const [token, setToken] = useState<string | null>(null);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [loading, setLoading] = useState(false);

//   // Fetch token from local storage on mount
//   useEffect(() => {
//     const storedToken = readToken(); // Use readToken to fetch from localStorage
//     if (storedToken) {
//       setToken(storedToken);
//       setIsAuthenticated(true);
//     }
//   }, []);

//   // Function to handle login with Nostr public key and challenge verification
//   const login = async () => {
//     setLoading(true);
//     try {
//       if (!window.nostr) {
//         notificationController.error({ message: 'Nostr extension is not available' });
//         return;
//       }

//       // Fetch the Nostr public key
//       const npub = await window.nostr.getPublicKey();

//       // Fetch the challenge from the server
//       const challengeResponse = await fetch('http://localhost:9003/challenge');
//       const { content: challenge } = await challengeResponse.json();

//       // Sign the challenge using Nostr
//       const signedEvent = await window.nostr.signEvent({
//         pubkey: npub,
//         content: challenge,
//         created_at: Math.floor(Date.now() / 1000),
//         kind: 1,
//         tags: [],
//       });

//       // Send the signed challenge to the backend for verification
//       const verifyResponse = await fetch('http://localhost:9003/verify', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           challenge,
//           signature: signedEvent.sig,
//           messageHash: signedEvent.id,
//           event: signedEvent,
//         }),
//       });

//       const { token } = await verifyResponse.json();

//       // Store the token and mark the user as authenticated
//       persistToken(token);
//       setToken(token);
//       setIsAuthenticated(true);

//       notificationController.success({ message: 'Login successful!' });
//     } catch (error) {
//       console.error('Error during login:', error);
//       notificationController.error({ message: 'Authentication failed' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Logout and clear token
//   const logout = () => {
//     deleteToken();
//     setToken(null);
//     setIsAuthenticated(false);
//   };

//   return {
//     token,
//     isAuthenticated,
//     login,
//     logout,
//     loading,
//   };
// };

// export default useWalletAuth;

