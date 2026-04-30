const API_BASE = '/api';

export async function fetchLocation(query) {
  const res = await fetch(`${API_BASE}/geocode?q=${encodeURIComponent(query)}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Location not found');
  }
  return res.json();
}

export async function fetchAutocomplete(query) {
  const res = await fetch(`${API_BASE}/autocomplete?q=${encodeURIComponent(query)}`);
  if (!res.ok) return [];
  return res.json();
}

export async function fetchPollen(lat, lng, days = 5) {
  const res = await fetch(`${API_BASE}/pollen?lat=${lat}&lng=${lng}&days=${days}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to fetch pollen data');
  }
  return res.json();
}
