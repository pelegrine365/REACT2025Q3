export function getVisiblePages(currentPage: number, totalPage: number) {
  const pages = [];
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPage, currentPage + 2);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
}
