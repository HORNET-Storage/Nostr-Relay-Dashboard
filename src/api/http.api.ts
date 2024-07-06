import axios from 'axios';
import { AxiosError } from 'axios';
import { ApiError } from '@app/api/ApiError';
import { readToken } from '@app/services/localStorage.service';
import config from '@app/config/config';

// export const httpApi = axios.create({
//   baseURL: process.env.REACT_APP_BASE_URL,
// });

export const httpApi = axios.create({
  baseURL: config.baseURL, // Set the base URL for your backend server
  headers: {
    'Content-Type': 'application/json',
  },
});

httpApi.interceptors.request.use((config) => {
  config.headers = { ...config.headers, Authorization: `Bearer ${readToken()}` };

  return config;
});

httpApi.interceptors.response.use(undefined, (error: AxiosError) => {
  throw new ApiError<ApiErrorData>(error.response?.data.message || error.message, error.response?.data);
});

export interface ApiErrorData {
  message: string;
}
