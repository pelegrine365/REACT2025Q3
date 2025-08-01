export function getVisiblePages(
  currentPage: number,
  totalPages: number,
  maxVisible: number = 5
) {
  if (totalPages <= 0) return [];

  const current = Math.max(1, Math.min(currentPage, totalPages));

  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const half = Math.floor(maxVisible / 2);
  let start = current - half;
  let end = current + half;

  if (start < 1) {
    start = 1;
    end = start + maxVisible - 1;
  }

  if (end > totalPages) {
    end = totalPages;
    start = end - maxVisible + 1;
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}
