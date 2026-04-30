// UPI severity color mapping
const UPI_COLORS = {
  0: '#6b7280', // None - gray
  1: '#34d399', // Very Low - green
  2: '#fbbf24', // Low - yellow
  3: '#fb923c', // Moderate - orange
  4: '#ef4444', // High - red
  5: '#a855f7', // Very High - purple
};

const UPI_LABELS = {
  0: 'None',
  1: 'Very Low',
  2: 'Low',
  3: 'Moderate',
  4: 'High',
  5: 'Very High',
};

const POLLEN_ICONS = {
  TREE: '🌳',
  GRASS: '🌾',
  WEED: '🌿',
};

export function getUpiColor(value) {
  return UPI_COLORS[Math.min(5, Math.max(0, value))] || UPI_COLORS[0];
}

export function getUpiLabel(value) {
  return UPI_LABELS[Math.min(5, Math.max(0, value))] || UPI_LABELS[0];
}

export function getPollenIcon(code) {
  return POLLEN_ICONS[code] || '🌱';
}

export function formatDate(dateObj) {
  const d = new Date(dateObj.year, dateObj.month - 1, dateObj.day);
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

export function getDayName(dateObj) {
  const d = new Date(dateObj.year, dateObj.month - 1, dateObj.day);
  const today = new Date();
  today.setHours(0,0,0,0);
  const target = new Date(d);
  target.setHours(0,0,0,0);
  const diff = (target - today) / (1000 * 60 * 60 * 24);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  return d.toLocaleDateString('en-US', { weekday: 'short' });
}

export function isToday(dateObj) {
  const now = new Date();
  return dateObj.year === now.getFullYear() && dateObj.month === now.getMonth() + 1 && dateObj.day === now.getDate();
}
