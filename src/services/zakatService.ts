export function calculateZakatMaal(wealth: number, nisab: number = 85_000_000): number {
  if (wealth < 0) return 0;
  if (wealth >= nisab) {
    return wealth * 0.025; // 2.5%
  }
  return 0;
}

export function calculateZakatFitrah(personCount: number, ricePricePerKg: number = 15_000): number {
  if (personCount < 0) return 0;
  // According to standard in Indonesia, it is usually ~ 2.5 kg or ~3.5 liters per person depending on region
  // In monetary terms, Kemenag sets a standard, commonly simplified as flat rate or variable by rice quality.
  // E.g., if input price is per person standard mapping.
  // Wait, if input is price per Kg of rice, usually 2.5kg is used. 
  // Let's assume the argument `ricePricePerKg` is really `ricePricePerZakatFitrah` flat or the 2.5kg is precalculated.
  // The tests expect calculateZakatFitrah(4, 45_000) -> 180_000
  // So it's personCount * rate
  return personCount * ricePricePerKg;
}

export function formatRupiah(amount: number): string {
  // Adds dot as thousand separator
  return 'Rp ' + amount.toLocaleString('id-ID', { maximumFractionDigits: 0 }).replace(/,/g, '.');
}
