import { useState } from 'react';
import { notificationController } from '@app/controllers/notificationController';
import config from '@app/config/config';
import { persistToken, persistUser } from '@app/services/localStorage.service';

interface LoginFormData {
  npub: string;
  password: string;
}

interface VerifyPayload {
  challenge: string;
  signature: string;
  messageHash: string;
  event: any;
}

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);

  const login = async (loginData: LoginFormData): Promise<{ success: boolean; event?: any }> => {
    setIsLoading(true);
    try {
      const response = await fetch(`${config.baseURL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }

      const data = await response.json();
      return { success: true, event: data.event };
    } catch (error: any) {
      notificationController.error({ message: error.message });
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  const verifyChallenge = async (
    verifyPayload: VerifyPayload,
  ): Promise<{ success: boolean; token?: string; user?: any }> => {
    setIsLoading(true);
    try {
      const response = await fetch(`${config.baseURL}/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(verifyPayload),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }
  
      const data = await response.json();
      if (data.token && data.user) {
        persistToken(data.token);
        persistUser(data.user);
      }
      return { success: true, token: data.token, user: data.user };
    } catch (error: any) {
      notificationController.error({ message: error.message });
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  return { login, verifyChallenge, isLoading };
};
