const GOOGLE_API_KEY = process.env.GOOGLE_POLLEN_API_KEY;

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const { lat, lng, days = 5 } = req.query;
  if (!lat || !lng) return res.status(400).json({ error: 'Missing lat/lng' });

  // If no API key, return mock data
  if (!GOOGLE_API_KEY) {
    console.warn('No GOOGLE_POLLEN_API_KEY set — returning mock data');
    return res.json({ ...generateMockData(parseFloat(lat), parseFloat(lng), parseInt(days)), _demo: true });
  }

  try {
    const url = `https://pollen.googleapis.com/v1/forecast:lookup?key=${GOOGLE_API_KEY}&location.latitude=${lat}&location.longitude=${lng}&days=${days}&plantsDescription=true`;
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      console.error('Google API error:', data);
      return res.status(response.status).json({ error: data.error?.message || 'Pollen API error' });
    }

    res.json(data);
  } catch (err) {
    console.error('Pollen API error:', err);
    res.status(500).json({ error: 'Pollen API request failed' });
  }
}

// Generate realistic mock data for demo mode
function generateMockData(lat, lng, days) {
  const today = new Date();
  const categories = ['None', 'Very Low', 'Low', 'Moderate', 'High', 'Very High'];
  const colors = [
    {},
    { green: 0.62, blue: 0.23 },
    { red: 0.96, green: 0.84 },
    { red: 1.0, green: 0.56 },
    { red: 0.91, green: 0.2, blue: 0.14 },
    { red: 0.56, green: 0.16, blue: 0.72 }
  ];

  const plants = [
    {
      code: 'BIRCH', displayName: 'Birch', type: 'TREE',
      family: 'Betulaceae (the Birch family)', season: 'Late winter, spring',
      crossReaction: 'Alder, Hazel, Hornbeam, Beech, Willow, and Oak pollen.',
      picture: 'https://storage.googleapis.com/pollen-pictures/birch_full.jpg',
      pictureCloseup: 'https://storage.googleapis.com/pollen-pictures/birch_closeup.jpg'
    },
    {
      code: 'OAK', displayName: 'Oak', type: 'TREE',
      family: 'Fagaceae (the Beech family)', season: 'Spring',
      crossReaction: 'Birch, Alder, and Hazel pollen.',
      picture: 'https://storage.googleapis.com/pollen-pictures/oak_full.jpg',
      pictureCloseup: 'https://storage.googleapis.com/pollen-pictures/oak_closeup.jpg'
    },
    {
      code: 'GRAMINALES', displayName: 'Grasses', type: 'GRASS',
      family: 'Poaceae', season: 'Late spring, summer',
      crossReaction: 'Plantain (Plantago) pollen. Higher risk for food allergies like melons, oranges, tomatoes.',
      picture: 'https://storage.googleapis.com/pollen-pictures/graminales_full.jpg',
      pictureCloseup: 'https://storage.googleapis.com/pollen-pictures/graminales_closeup.jpg'
    },
    {
      code: 'RAGWEED', displayName: 'Ragweed', type: 'WEED',
      family: 'Asteraceae (the daisy family)', season: 'Late summer, fall',
      crossReaction: 'Mugwort and Goldenrod as well as daisies such as Sunflower, Dandelion, and Chamomile.',
      picture: 'https://storage.googleapis.com/pollen-pictures/ragweed_full.jpg',
      pictureCloseup: 'https://storage.googleapis.com/pollen-pictures/ragweed_closeup.jpg'
    },
    {
      code: 'MUGWORT', displayName: 'Mugwort', type: 'WEED',
      family: 'Asteraceae (the daisy family)', season: 'Late summer, fall',
      crossReaction: 'Ragweed and Goldenrod pollen as well as daisies.',
      picture: 'https://storage.googleapis.com/pollen-pictures/mugwort_full.jpg',
      pictureCloseup: 'https://storage.googleapis.com/pollen-pictures/mugwort_closeup.jpg'
    },
    {
      code: 'OLIVE', displayName: 'Olive', type: 'TREE',
      family: 'Oleaceae (the Olive family)', season: 'Spring',
      crossReaction: 'Ash and Privet pollen.',
      picture: 'https://storage.googleapis.com/pollen-pictures/olive_full.jpg',
      pictureCloseup: 'https://storage.googleapis.com/pollen-pictures/olive_closeup.jpg'
    },
    {
      code: 'ALDER', displayName: 'Alder', type: 'TREE',
      family: 'Betulaceae (the Birch family)', season: 'Winter, early spring',
      crossReaction: 'Birch and Hazel pollen.',
      picture: 'https://storage.googleapis.com/pollen-pictures/alder_full.jpg',
      pictureCloseup: 'https://storage.googleapis.com/pollen-pictures/alder_closeup.jpg'
    }
  ];

  const seed = Math.abs(Math.round(lat * 100 + lng * 100));
  const seededRandom = (min, max, offset = 0) => {
    const x = Math.sin(seed + offset) * 10000;
    const r = x - Math.floor(x);
    return Math.floor(r * (max - min + 1)) + min;
  };

  const treeBase = seededRandom(2, 4, 1);
  const grassBase = seededRandom(1, 3, 2);
  const weedBase = seededRandom(0, 3, 3);

  const healthRecs = {
    0: ['No pollen detected in your area. Enjoy the fresh air!'],
    1: ['Pollen levels are very low right now. It\'s a great day to enjoy the outdoors!'],
    2: ['Pollen is present at low levels. Those with high sensitivity may want to take precautions.'],
    3: ['Moderate pollen levels detected. Consider limiting prolonged outdoor activities. Keep windows closed and use air filtration.'],
    4: ['High pollen levels! Take allergy medications as needed. Avoid outdoor exercise during peak hours. Shower after being outside.'],
    5: ['Very high pollen levels! Stay indoors when possible. Use HEPA air filters. Take prescribed allergy medications. Wear a mask if you must go outside.']
  };

  const dailyInfo = [];
  for (let d = 0; d < days; d++) {
    const date = new Date(today);
    date.setDate(date.getDate() + d);

    const dayVariation = seededRandom(-1, 1, d * 10);
    const treeVal = Math.max(0, Math.min(5, treeBase + dayVariation));
    const grassVal = Math.max(0, Math.min(5, grassBase + seededRandom(-1, 1, d * 20)));
    const weedVal = Math.max(0, Math.min(5, weedBase + seededRandom(-1, 0, d * 30)));

    const makePlantInfo = (plant, baseVal) => {
      const val = Math.max(0, Math.min(5, baseVal + seededRandom(-1, 1, d * 5 + plants.indexOf(plant))));
      return {
        code: plant.code,
        displayName: plant.displayName,
        inSeason: val > 0,
        indexInfo: val > 0 ? {
          code: 'UPI',
          displayName: 'Universal Pollen Index',
          value: val,
          category: categories[val],
          indexDescription: `Pollen level: ${categories[val]}`,
          color: colors[val]
        } : undefined,
        plantDescription: {
          type: plant.type,
          family: plant.family,
          season: plant.season,
          crossReaction: plant.crossReaction,
          picture: plant.picture,
          pictureCloseup: plant.pictureCloseup
        }
      };
    };

    dailyInfo.push({
      date: { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() },
      pollenTypeInfo: [
        {
          code: 'TREE', displayName: 'Tree', inSeason: treeVal > 0,
          indexInfo: {
            code: 'UPI', displayName: 'Universal Pollen Index',
            value: treeVal, category: categories[treeVal],
            indexDescription: `Pollen level: ${categories[treeVal]}`,
            color: colors[treeVal]
          },
          healthRecommendations: healthRecs[treeVal]
        },
        {
          code: 'GRASS', displayName: 'Grass', inSeason: grassVal > 0,
          indexInfo: {
            code: 'UPI', displayName: 'Universal Pollen Index',
            value: grassVal, category: categories[grassVal],
            indexDescription: `Pollen level: ${categories[grassVal]}`,
            color: colors[grassVal]
          },
          healthRecommendations: healthRecs[grassVal]
        },
        {
          code: 'WEED', displayName: 'Weed', inSeason: weedVal > 0,
          indexInfo: {
            code: 'UPI', displayName: 'Universal Pollen Index',
            value: weedVal, category: categories[weedVal],
            indexDescription: `Pollen level: ${categories[weedVal]}`,
            color: colors[weedVal]
          },
          healthRecommendations: healthRecs[weedVal]
        }
      ],
      plantInfo: [
        makePlantInfo(plants[0], treeVal),
        makePlantInfo(plants[1], treeVal),
        makePlantInfo(plants[6], Math.max(0, treeVal - 1)),
        makePlantInfo(plants[5], Math.max(0, treeVal - 1)),
        makePlantInfo(plants[2], grassVal),
        makePlantInfo(plants[3], weedVal),
        makePlantInfo(plants[4], Math.max(0, weedVal - 1))
      ]
    });
  }

  return { regionCode: 'US', dailyInfo };
}
