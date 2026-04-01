import { describe, it, expect } from 'vitest'
import { calculateQiblaBearing } from '../services/qiblaService'

describe('qiblaService', () => {
  it('calculates correct bearing for Jakarta -> Mecca', () => {
    // Jakarta: -6.2, 106.8
    // Bearing should be ~295 degrees
    const bearing = calculateQiblaBearing(-6.2, 106.8);
    expect(bearing).toBeGreaterThanOrEqual(294);
    expect(bearing).toBeLessThanOrEqual(296);
  })

  it('calculates correct bearing for Jayapura -> Mecca', () => {
    // Jayapura: -2.54, 140.72
    // Bearing should be ~292 degrees
    const bearing = calculateQiblaBearing(-2.54, 140.72);
    expect(bearing).toBeGreaterThanOrEqual(291);
    expect(bearing).toBeLessThanOrEqual(293);
  })
})
