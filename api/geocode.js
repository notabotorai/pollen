export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const { q } = req.query;
  if (!q) return res.status(400).json({ error: 'Missing query parameter "q"' });

  try {
    // If the query looks like a US zip code, use the postalcode parameter
    const isZipCode = /^\d{5}(-\d{4})?$/.test(q.trim());
    let url;
    if (isZipCode) {
      url = `https://nominatim.openstreetmap.org/search?postalcode=${encodeURIComponent(q.trim())}&country=us&format=json&limit=1&addressdetails=1`;
    } else {
      url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1&addressdetails=1`;
    }

    const response = await fetch(url, {
      headers: { 'User-Agent': 'PollenWatch/1.0 (pollen-monitor-app)' }
    });
    let data = await response.json();

    // Fallback: if no results, try appending ", USA" for zip-like queries
    if (!data.length && isZipCode) {
      const fallbackUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q.trim() + ', USA')}&format=json&limit=1&addressdetails=1`;
      const fallbackRes = await fetch(fallbackUrl, {
        headers: { 'User-Agent': 'PollenWatch/1.0 (pollen-monitor-app)' }
      });
      data = await fallbackRes.json();
    }

    if (!data.length) {
      return res.status(404).json({ error: 'Location not found' });
    }

    const place = data[0];
    res.json({
      lat: parseFloat(place.lat),
      lng: parseFloat(place.lon),
      displayName: place.display_name,
      city: place.address?.city || place.address?.town || place.address?.village || place.address?.county || q,
      state: place.address?.state || '',
      country: place.address?.country_code?.toUpperCase() || ''
    });
  } catch (err) {
    console.error('Geocoding error:', err);
    res.status(500).json({ error: 'Geocoding failed' });
  }
}
