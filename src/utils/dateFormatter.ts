// utils/dateFormatter.ts
import { format } from 'date-fns';

export const formatDate = (timestamp: number): string => {
  return format(new Date(timestamp), 'MM/dd/yyyy HH:mm');
};
