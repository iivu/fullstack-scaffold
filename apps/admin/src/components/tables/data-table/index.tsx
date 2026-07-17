import { cn } from '@r/ui';
import {
  type ColumnDef,
  getCoreRowModel,
  type TableMeta,
  useReactTable,
} from '@tanstack/react-table';
import type { ReactNode } from 'react';
import { Pagination } from '#/components/pagination';
import { DataTableRenderer } from './table-renderer';
import { TableViewOptions, useViewOptionsPersistence } from './view-options';

type DataTableProps<TData> = {
  data: TData[];
  columns: ColumnDef<TData>[];
  total: number;
  page: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
  header?: ReactNode;
  viewOptionsStorageKey: string;
  meta?: TableMeta<TData>;
  className?: string;
  tableClassName?: string;
  emptyText?: string;
};

const DEFAULT_PAGE_SIZE = 15;

export function DataTable<TData>({
  data,
  columns,
  total,
  page,
  pageSize = DEFAULT_PAGE_SIZE,
  onPageChange,
  header,
  viewOptionsStorageKey,
  meta,
  className,
  tableClassName,
  emptyText,
}: DataTableProps<TData>) {
  const { getPersistedViewOptions, ViewOptionsPersistenceHolder } =
    useViewOptionsPersistence(viewOptionsStorageKey);
  const table = useReactTable<TData>({
    columns,
    data,
    initialState: {
      columnVisibility: getPersistedViewOptions(),
    },
    getCoreRowModel: getCoreRowModel(),
    meta,
  });

  return (
    <>
      <div className="flex items-center mb-4 gap-2">
        {header}
        <TableViewOptions table={table} />
        <ViewOptionsPersistenceHolder table={table} />
      </div>
      <DataTableRenderer
        table={table}
        className="mb-4"
        tableClassName={tableClassName}
        emptyText={emptyText}
      />
      <Pagination
        className="w-fit shrink-0 rounded-full border bg-background px-2 py-1.5 shadow-lg sticky bottom-4 mt-4"
        size={pageSize}
        currentPage={page}
        total={total}
        onPageChange={onPageChange}
      />
    </>
  );
}
