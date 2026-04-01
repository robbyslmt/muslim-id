import { describe, it, expect } from 'vitest'
import {
  calculateZakatMaal,
  calculateZakatFitrah,
  formatRupiah
} from '../services/zakatService'

describe('zakatService', () => {
  it('calculates maal zakat at 2.5% when above nisab', () => {
    expect(calculateZakatMaal(100_000_000, 85_000_000)).toBe(2_500_000)
  })
  it('returns 0 when below nisab', () => {
    expect(calculateZakatMaal(50_000_000, 85_000_000)).toBe(0)
  })
  it('calculates fitrah correctly per person', () => {
    expect(calculateZakatFitrah(4, 45_000)).toBe(180_000)
  })
  it('formats Rupiah with dot separators', () => {
    expect(formatRupiah(2_500_000)).toBe('Rp 2.500.000')
    expect(formatRupiah(0)).toBe('Rp 0')
  })
  it('rejects negative input', () => {
    expect(calculateZakatMaal(-100, 85_000_000)).toBe(0)
    expect(calculateZakatFitrah(-2, 45_000)).toBe(0)
  })
})
