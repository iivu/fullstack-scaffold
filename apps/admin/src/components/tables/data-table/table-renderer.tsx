import { cn, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@r/ui';
import type { Table as ReactTable } from '@tanstack/react-table';
import { flexRender } from '@tanstack/react-table';
import { EmptyRow } from '../empty-row';

type DataTableRendererProps<TData> = {
  table: ReactTable<TData>;
  className?: string;
  tableClassName?: string;
  emptyText?: string;
};

export function DataTableRenderer<TData>({ table, className, tableClassName, emptyText }: DataTableRendererProps<TData>) {
  const rows = table.getRowModel().rows;
  const colSpan = Math.max(table.getVisibleLeafColumns().length, 1);

  return (
    <div className={cn('overflow-hidden rounded-md border', className)}>
      <Table className={cn('table-fixed w-full', tableClassName)}>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className={cn(header.column.columnDef.meta?.className, header.column.columnDef.meta?.thClassName)}>
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {rows.length === 0 && <EmptyRow colSpan={colSpan} text={emptyText} />}
          {rows.map((row) => (
            <TableRow key={row.id} data-state={row.getIsSelected() ? 'selected' : undefined}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id} className={cn(cell.column.columnDef.meta?.className, cell.column.columnDef.meta?.tdClassName)}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
