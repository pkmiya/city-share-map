export const formatDate = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    hour: '2-digit',
    hour12: false,
    minute: '2-digit',
    month: '2-digit',
    year: 'numeric',
  };

  return new Intl.DateTimeFormat('ja-JP', options)
    .format(date)
    .replace(/\//g, '/');
};
