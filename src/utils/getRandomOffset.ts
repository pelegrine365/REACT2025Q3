export function getRandomOffset(
  totalCount: number,
  requestCount: number
): number {
  if (requestCount <= 0) {
    throw new Error('requestCount must be greater than 0');
  }

  const maxOffset = totalCount - requestCount;
  if (maxOffset <= 0) return 0;

  return Math.floor(Math.random() * maxOffset);
}
