export interface Coordinates {
  latitude: number;
  longitude: number;
}

export function calculateDistance(
  coord1: Coordinates,
  coord2: Coordinates
): number {
  const R = 3958.8;

  const lat1 = toRadians(coord1.latitude);
  const lat2 = toRadians(coord2.latitude);
  const deltaLat = toRadians(coord2.latitude - coord1.latitude);
  const deltaLon = toRadians(coord2.longitude - coord1.longitude);

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) *
    Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

export function formatDistance(distanceInMiles: number): string {
  if (distanceInMiles < 0.1) {
    const feet = Math.round(distanceInMiles * 5280);
    return `${feet} ft`;
  } else if (distanceInMiles < 1) {
    return `${distanceInMiles.toFixed(1)} mi`;
  } else {
    return `${distanceInMiles.toFixed(1)} mi`;
  }
}

export function sortByDistance<T extends { distance?: number }>(
  items: T[]
): T[] {
  return [...items].sort((a, b) => {
    if (a.distance === undefined && b.distance === undefined) return 0;
    if (a.distance === undefined) return 1;
    if (b.distance === undefined) return -1;
    return a.distance - b.distance;
  });
}

export function filterByDistance<T extends { distance?: number }>(
  items: T[],
  maxDistance: number
): T[] {
  return items.filter(item =>
    item.distance !== undefined && item.distance <= maxDistance
  );
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}
