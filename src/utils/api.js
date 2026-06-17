const API = '/api';

export async function fetchHome() {
  const res = await fetch(`${API}/home`);
  const data = await res.json();
  if (!data.success) throw new Error(data.error);
  return data.data;
}

export async function fetchSearch(q, limit = 20) {
  const res = await fetch(`${API}/search?q=${encodeURIComponent(q)}&limit=${limit}`);
  const data = await res.json();
  if (!data.success) throw new Error(data.error);
  return data;
}

export async function fetchSeries(page = 1, sort = 'recently', genre = '', status = '') {
  const params = new URLSearchParams({ page, sort, ...(genre && { genre }), ...(status && { status }) });
  const res = await fetch(`${API}/series?${params}`);
  const data = await res.json();
  if (!data.success) throw new Error(data.error);
  return data;
}

export async function fetchDetail(slug, source = '') {
  const params = new URLSearchParams({ slug, ...(source && { source }) });
  const res = await fetch(`${API}/detail?${params}`);
  const data = await res.json();
  if (!data.success) throw new Error(data.error);
  return data.data;
}

export async function fetchWatch(slug, ep, source = '', episodeUrl = '') {
  const params = new URLSearchParams({ slug, ep, ...(source && { source }), ...(episodeUrl && { episodeUrl }) });
  const res = await fetch(`${API}/watch?${params}`);
  const data = await res.json();
  if (!data.success) throw new Error(data.error);
  return data.data;
}

export function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch { return ''; }
}
