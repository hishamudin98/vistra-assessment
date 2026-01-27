"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ChevronDown, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
  searchKey?: string
  searchPlaceholder?: string
  onSelectionChange?: (selectedIds: number[]) => void
  pageCount?: number
  pageIndex?: number
  pageSize?: number
  totalRows?: number
  onPaginationChange?: (page: number, pageSize: number) => void
  onSortingChange?: (sortBy: string, sortOrder: 'asc' | 'desc') => void
  onSearchChange?: (search: string) => void
  manualPagination?: boolean
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  searchPlaceholder = "Search...",
  onSelectionChange,
  pageCount,
  pageIndex = 0,
  pageSize = 10,
  totalRows = 0,
  onPaginationChange,
  onSortingChange,
  onSearchChange,
  manualPagination = false,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([
    {
      id: "name",
      desc: false,
    },
  ])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [pagination, setPagination] = React.useState({
    pageIndex: pageIndex,
    pageSize: pageSize,
  })

  const table = useReactTable({
    data,
    columns,
    pageCount: pageCount ?? -1,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: manualPagination ? undefined : getSortedRowModel(),
    getFilteredRowModel: manualPagination ? undefined : getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    manualPagination: manualPagination,
    manualSorting: manualPagination,
    manualFiltering: manualPagination,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
    getRowId: (row: TData) => (row as { id: string | number }).id.toString(),
    sortingFns: {
      folderFirst: (rowA, rowB, columnId) => {
        const a = rowA.original as { type?: string; [key: string]: unknown }
        const b = rowB.original as { type?: string; [key: string]: unknown }
        
        // Folders always come first
        if (a.isFolder && !b.isFolder) return -1
        if (!a.isFolder && b.isFolder) return 1
        
        // If both are folders or both are files, sort by the column value
        const aValue = String(rowA.getValue(columnId))
        const bValue = String(rowB.getValue(columnId))
        
        if (aValue < bValue) return -1
        if (aValue > bValue) return 1
        return 0
      }
    }
  })

  React.useEffect(() => {
    if (manualPagination && onPaginationChange) {
      onPaginationChange(pagination.pageIndex + 1, pagination.pageSize)
    }
  }, [pagination.pageIndex, pagination.pageSize, manualPagination, onPaginationChange])

  React.useEffect(() => {
    if (manualPagination && onSortingChange && sorting.length > 0) {
      const sortBy = sorting[0].id
      const sortOrder = sorting[0].desc ? 'desc' : 'asc'
      onSortingChange(sortBy, sortOrder)
    }
  }, [sorting, manualPagination, onSortingChange])

  React.useEffect(() => {
    if (manualPagination && onSearchChange && searchKey) {
      const searchValue = columnFilters.find(f => f.id === searchKey)?.value as string || ''
      onSearchChange(searchValue)
    }
  }, [columnFilters, manualPagination, onSearchChange, searchKey])

  React.useEffect(() => {
    if (onSelectionChange) {
      const selectedIds = table.getSelectedRowModel().rows.map((row) => Number(row.id))
      onSelectionChange(selectedIds)
    }
  }, [rowSelection, onSelectionChange, table])

  const selectedRowCount = table.getFilteredSelectedRowModel().rows.length

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        {searchKey && (
          <div className="relative w-sm">
            <Input
              placeholder={searchPlaceholder}
              value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table.getColumn(searchKey)?.setFilterValue(event.target.value)
              }
              className="pr-8"
            />
            <Search className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
          </div>
        )}
      </div>
      <div className="rounded-md border">
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
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {manualPagination ? (
            <>
              Showing {pagination.pageIndex * pagination.pageSize + 1} to{" "}
              {Math.min((pagination.pageIndex + 1) * pagination.pageSize, totalRows)} of{" "}
              {totalRows} results
            </>
          ) : (
            <>
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {manualPagination && (
            <div className="text-sm text-muted-foreground">
              Page {pagination.pageIndex + 1} of {pageCount}
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
