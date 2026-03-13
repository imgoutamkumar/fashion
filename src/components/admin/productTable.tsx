/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  isFetching: boolean
}

const SkeletonRow = ({ columns }: any) => {
  return (
    <TableRow>
      {Array.from({ length: columns.length }).map((_, i) => (
        <TableCell key={i}>
          <div className="h-4 bg-gray-200 rounded animate-pulse" />
        </TableCell>
      ))}
    </TableRow>
  )
}

const ProductTable = ({ data, columns, isFetching }: DataTableProps<any, any>) => {

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getRowCanExpand: (row) => row.original.variants?.length > 0,
  })

  return (
    <div className="overflow-hidden rounded-md border w-full">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {isFetching && data.length === 0 ? (
            Array.from({ length: 8 }).map((_, i) => (
              <SkeletonRow key={i} columns={columns} />
            ))
          ) :
            table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <>
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                  {row.getIsExpanded() && (
                    <TableRow>
                      <TableCell colSpan={columns.length}>
                        <div className="p-4 bg-muted rounded-md">

                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>SKU</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Stock</TableHead>
                                <TableHead>Original Price</TableHead>
                                <TableHead>Discount %</TableHead>
                                <TableHead>Final Price</TableHead>
                              </TableRow>
                            </TableHeader>

                            <TableBody>
                              {row.original.variants.map((variant: any) => (
                                <TableRow key={variant.id}>
                                  <TableCell>{variant.sku}</TableCell>
                                  <TableCell>{variant.price}</TableCell>
                                  <TableCell>{variant.stock}</TableCell>
                                  <TableCell>{variant.original_price}</TableCell>
                                  <TableCell>{variant.discount_percent}</TableCell>
                                  <TableCell>{variant.final_price}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>

                          </Table>

                        </div>
                      </TableCell>
                    </TableRow>
                  )}

                </>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns?.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
        </TableBody>
      </Table>
    </div>
  )
}

export default ProductTable
