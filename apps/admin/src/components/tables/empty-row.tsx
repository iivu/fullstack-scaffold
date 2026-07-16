import { TableCell, TableRow } from '@r/ui';

export function EmptyRow({ colSpan = 0, text = '暂无数据' }) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="h-24 text-center">
        {text ?? '暂无数据'}
      </TableCell>
    </TableRow>
  );
}
