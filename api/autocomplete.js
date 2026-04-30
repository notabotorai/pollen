export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const { q } = req.query;
  if (!q || q.trim().length < 2) return res.json([]);

  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=5&addressdetails=1`;
    const response = await fetch(url, {
      headers: { 'User-Agent': 'PollenWatch/1.0 (pollen-monitor-app)' }
    });
    const data = await response.json();

    const results = data.map(place => ({
      displayName: place.display_name,
      city: place.address?.city || place.address?.town || place.address?.village || place.address?.county || '',
      state: place.address?.state || '',
      country: place.address?.country_code?.toUpperCase() || '',
      lat: parseFloat(place.lat),
      lng: parseFloat(place.lon)
    }));

    res.json(results);
  } catch (err) {
    console.error('Autocomplete error:', err);
    res.json([]);
  }
}
