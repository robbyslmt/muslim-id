import { describe, it, expect } from 'vitest'
import cities from '../../public/data/cities.json'

describe('cities.json', () => {
  it('contains at least 50 Indonesian cities', () => {
    expect(cities.length).toBeGreaterThanOrEqual(50)
  })
  it('each city has name, lat, lon, timezone', () => {
    cities.forEach((city: any) => {
      expect(city).toHaveProperty('name')
      expect(city).toHaveProperty('lat')
      expect(city).toHaveProperty('lon')
      expect(city).toHaveProperty('timezone')
      expect(['WIB', 'WITA', 'WIT']).toContain(city.timezone)
    })
  })
  it('includes Jakarta', () => {
    expect(cities.some((c: any) => c.name === 'Jakarta')).toBe(true)
  })
})
