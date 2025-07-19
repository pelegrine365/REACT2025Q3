export function getRandomOffset(
  totalCount: number,
  requestCount: number
): number {
  const maxOffset = totalCount - requestCount;
  if (maxOffset <= 0) return 0;

  return Math.floor(Math.random() * maxOffset);
}
