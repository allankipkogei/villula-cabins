export function getImageUrl(url) {
  if (!url) return '/placeholder-cabin.svg';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/media/')) return `http://127.0.0.1:8000${url}`;
  return url;
}
