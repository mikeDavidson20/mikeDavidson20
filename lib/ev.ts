export function americanToDecimal(odds: number): number {
  return odds > 0 ? odds / 100 + 1 : 100 / Math.abs(odds) + 1;
}

export function impliedProbabilityFromAmerican(odds: number): number {
  return odds > 0 ? 100 / (odds + 100) : Math.abs(odds) / (Math.abs(odds) + 100);
}

export function calculateEV(odds: number, trueProbability: number): number {
  const decimalOdds = americanToDecimal(odds);
  return trueProbability * (decimalOdds - 1) - (1 - trueProbability);
}
