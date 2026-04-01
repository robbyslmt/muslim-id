/**
 * Calculates the Qibla (direction to Mecca) from a given latitude and longitude.
 * Mecca coordinates: 21.422487 N, 39.826206 E
 * @param lat Observer's latitude
 * @param lon Observer's longitude
 * @returns Qibla bearing in degrees, clock-wise from North (0-360)
 */
export function calculateQiblaBearing(lat: number, lon: number): number {
  const meccaLat = 21.422487;
  const meccaLon = 39.826206;

  // Convert to radians
  const latR = lat * Math.PI / 180;
  const lonR = lon * Math.PI / 180;
  const mLatR = meccaLat * Math.PI / 180;
  const mLonR = meccaLon * Math.PI / 180;

  // Haversine / Great Circle equation for bearing
  const y = Math.sin(mLonR - lonR);
  const x = Math.cos(latR) * Math.tan(mLatR) - Math.sin(latR) * Math.cos(mLonR - lonR);

  let bearing = Math.atan2(y, x) * 180 / Math.PI;

  // Normalize to 0-360
  bearing = (bearing + 360) % 360;
  return bearing;
}
