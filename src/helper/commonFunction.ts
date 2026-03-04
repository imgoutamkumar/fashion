export const getPaginationRange = (
  currentPage: number,
  totalPages: number,
  siblingCount = 1
) => {
  const range: (number | "dots")[] = []

  const start = Math.max(2, currentPage - siblingCount)
  const end = Math.min(totalPages - 1, currentPage + siblingCount)

  // Always show first page
  range.push(1)

  // Left dots
  if (start > 2) {
    range.push("dots")
  }

  // Middle pages
  for (let i = start; i <= end; i++) {
    range.push(i)
  }

  // Right dots
  if (end < totalPages - 1) {
    range.push("dots")
  }

  // Always show last page
  if (totalPages > 1) {
    range.push(totalPages)
  }

  return range
}
