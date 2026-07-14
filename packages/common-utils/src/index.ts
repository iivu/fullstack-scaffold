export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function toFixed(value: number, precision: number = 6): number {
  return Number(value.toFixed(precision));
}

export function isNumberInRange(value: unknown, min: number, max: number): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= min && value <= max;
}
