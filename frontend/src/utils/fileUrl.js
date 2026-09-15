// Uploaded files (receipts/invoices) are stored as relative paths like "/uploads/xyz.png".
// In local dev, Vite's proxy forwards /uploads to the backend, so the relative path works as-is.
// In production, the frontend and backend are on different domains, so we need to prefix
// the backend's origin (derived from VITE_API_URL) onto the relative path.
export function fileUrl(relativePath) {
  if (!relativePath) return '';
  const apiUrl = import.meta.env.VITE_API_URL;
  if (!apiUrl) return relativePath; // dev: proxy handles it
  const origin = apiUrl.replace(/\/api\/?$/, '');
  return `${origin}${relativePath}`;
}
