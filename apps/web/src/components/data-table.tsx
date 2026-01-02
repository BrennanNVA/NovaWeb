"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, ArrowUpDown } from "lucide-react"

interface Column<T> {
  key: string
  label: string
  sortable?: boolean
  render?: (value: T[keyof T], row: T) => React.ReactNode
  className?: string
}

interface DataTableProps<T extends Record<string, unknown>> {
  data: T[]
  columns: Column<T>[]
  keyExtractor: (row: T) => string
  className?: string
}

export function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  keyExtractor,
  className = "",
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortKey(key)
      setSortDirection("asc")
    }
  }

  const sortedData = [...data].sort((a, b) => {
    if (!sortKey) return 0
    const aVal = a[sortKey]
    const bVal = b[sortKey]
    
    if (aVal === bVal) return 0
    if (aVal == null) return 1
    if (bVal == null) return -1
    
    const comparison = aVal < bVal ? -1 : 1
    return sortDirection === "asc" ? comparison : -comparison
  })

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full border-collapse" role="table" aria-label="Data table">
        <thead>
          <tr className="border-b border-[#3a3a3a] bg-[#2B2B2B]">
            {columns.map((column) => (
              <th
                key={column.key}
                className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#ededed]/80 ${
                  column.sortable ? "cursor-pointer select-none hover:bg-[#333333]" : ""
                } ${column.className || ""}`}
                onClick={() => column.sortable && handleSort(column.key)}
                role="columnheader"
                aria-sort={
                  sortKey === column.key
                    ? sortDirection === "asc"
                      ? "ascending"
                      : "descending"
                    : undefined
                }
              >
                <div className="flex items-center gap-2">
                  {column.label}
                  {column.sortable && (
                    <span className="inline-flex" aria-hidden="true">
                      {sortKey === column.key ? (
                        sortDirection === "asc" ? (
                          <ChevronUp className="h-4 w-4 text-[#0A9D8F]" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-[#0A9D8F]" />
                        )
                      ) : (
                        <ArrowUpDown className="h-4 w-4 text-[#ededed]/40" />
                      )}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row) => (
            <tr
              key={keyExtractor(row)}
              className="border-b border-[#3a3a3a] transition-colors hover:bg-[#333333]"
              role="row"
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={`px-4 py-3 text-sm text-[#ededed] ${column.className || ""}`}
                  role="cell"
                >
                  {column.render
                    ? column.render(row[column.key] as T[keyof T], row)
                    : (row[column.key] as React.ReactNode)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {sortedData.length === 0 && (
        <div className="py-8 text-center text-sm text-[#ededed]/60" role="status">
          No data available
        </div>
      )}
    </div>
  )
}
