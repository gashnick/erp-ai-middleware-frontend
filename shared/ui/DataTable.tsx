import { ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/utils/cn";

export interface DataTableColumn<TRow> {
  key: keyof TRow | string;
  label: string;
  render?: (row: TRow) => React.ReactNode;
  align?: "left" | "right" | "center";
  sortable?: boolean;
  className?: string;
}

interface DataTableProps<TRow extends { id: string | number }> {
  columns: DataTableColumn<TRow>[];
  rows: TRow[];
  isLoading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: TRow) => void;
  sortKey?: string;
  sortDirection?: "asc" | "desc";
  onSort?: (key: string) => void;
  className?: string;
}

function SkeletonRow({ cols }: { cols: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-3.5 animate-pulse rounded bg-gray-100" />
        </td>
      ))}
    </tr>
  );
}

export function DataTable<TRow extends { id: string | number }>({
  columns,
  rows,
  isLoading = false,
  emptyMessage = "No data available.",
  onRowClick,
  sortKey,
  sortDirection,
  onSort,
  className,
}: DataTableProps<TRow>) {
  const alignClass = {
    left: "text-left",
    right: "text-right",
    center: "text-center",
  };

  return (
    <div
      className={cn(
        "overflow-x-auto rounded-lg border border-gray-200 bg-white",
        className,
      )}
    >
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr className="bg-gray-50">
            {columns.map((col) => {
              const isSorted = sortKey === col.key;
              return (
                <th
                  key={String(col.key)}
                  scope="col"
                  className={cn(
                    "px-4 py-3 text-xs font-medium uppercase tracking-wide text-gray-500",
                    alignClass[col.align ?? "left"],
                    col.sortable &&
                      onSort &&
                      "cursor-pointer select-none hover:text-gray-900",
                    col.className,
                  )}
                  onClick={() => col.sortable && onSort?.(String(col.key))}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.label}
                    {col.sortable && (
                      <span className="flex flex-col">
                        <ChevronUp
                          className={cn(
                            "h-2.5 w-2.5 -mb-0.5",
                            isSorted && sortDirection === "asc"
                              ? "text-blue-600"
                              : "text-gray-300",
                          )}
                        />
                        <ChevronDown
                          className={cn(
                            "h-2.5 w-2.5",
                            isSorted && sortDirection === "desc"
                              ? "text-blue-600"
                              : "text-gray-300",
                          )}
                        />
                      </span>
                    )}
                  </span>
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <SkeletonRow key={i} cols={columns.length} />
            ))
          ) : rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-10 text-center text-sm text-gray-400"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr
                key={row.id}
                className={cn(
                  "transition-colors",
                  onRowClick &&
                    "cursor-pointer hover:bg-gray-50 active:bg-gray-100",
                )}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((col) => (
                  <td
                    key={String(col.key)}
                    className={cn(
                      "px-4 py-3 text-sm text-gray-700",
                      alignClass[col.align ?? "left"],
                      col.className,
                    )}
                  >
                    {col.render
                      ? col.render(row)
                      : String(row[col.key as keyof TRow] ?? "")}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
