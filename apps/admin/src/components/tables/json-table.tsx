import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@r/ui';

import { EmptyRow } from './empty-row';

export type JsonTableColumn<T> = {
  key: string;
  title: string;
  headClassName?: string;
  cellClassName?: string;
  render?: (cell: unknown, row: T, index: number) => React.ReactNode;
};

type JsonTableProps<T> = {
  data: T[];
  columns: JsonTableColumn<T>[];
};

export function JsonTable<T extends Record<string, unknown>>({ data, columns }: JsonTableProps<T>) {
  const hasData = !!data && data.length > 0;
  return (
    <div className="overflow-hidden rounded-md border">
      <Table className="table-fixed w-full">
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={col.key} className={col.headClassName}>
                {col.title}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {columns.map((col) => (
                <TableCell key={col.key} className={col.cellClassName}>
                  {col.render ? col.render(row[col.key], row, rowIndex) : String(row[col.key] ?? '')}
                </TableCell>
              ))}
            </TableRow>
          ))}
          {hasData ? null : <EmptyRow colSpan={columns.length} />}
        </TableBody>
      </Table>
    </div>
  );
}
