export function fmtNum(value: number | null | undefined, digits: number) {
  return Number.isFinite(value) ? (value as number).toFixed(digits) : '—';
}

export function formatShortDate(isoDate: string) {
  if (!isoDate) return '';
  const d = new Date(`${isoDate}T12:00:00`);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function formatElevationFeet(meters: number | null) {
  if (meters == null) return '—';
  return `${Math.round(meters * 3.28084)} ft`;
}
