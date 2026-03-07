/* eslint-disable @typescript-eslint/no-explicit-any */

type tree = {
  ID: string
  Name: string
  ParentID: string | null
  children?: tree[]
}

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


export const buildTree = (nestedTree :tree[]) => {
  console.log("nestedTree",nestedTree)
  const map = {} as Record<string, tree & { children: tree[] }>
  const roots :tree[] = []

  // Step 1: create map
  nestedTree?.forEach((nt:tree) => {
      map[nt?.ID] = { ...nt, children: [] }
  })

  // Step 2: link children
  nestedTree?.forEach((nt:tree) => {
    if (nt?.ParentID) {
      if (map[nt?.ParentID]) {
        map[nt?.ParentID].children.push(map[nt?.ID])
      }
    } else {
      roots.push(map[nt?.ID])
    }
  })
console.log("map",map)
  return roots
}
