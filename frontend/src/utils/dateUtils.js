import { format, parseISO, isValid } from 'date-fns';

export const safeFormatDate = (dateString, formatString = 'MMMM d, yyyy') => {
  if (!dateString) return 'Unknown Date';
  
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : new Date(dateString);
    if (!isValid(date)) return 'Invalid Date';
    return format(date, formatString);
  } catch (error) {
    return 'Invalid Date';
  }
};

export const getTodayDateString = () => {
  return format(new Date(), 'yyyy-MM-dd');
};

export const NASA_APOD_START_DATE = '1995-06-16';