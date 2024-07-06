// src/services/authService.ts
import axios from 'axios';
import config from '@app/config/config';

export const isUserExist = async (): Promise<boolean> => {
  try {
    const response = await axios.get(`${config.baseURL}/user-exist`);
    return response.data.exists;
  } catch (error) {
    console.error('Error checking user existence', error);
    return false;
  }
};
