import { Button, cn, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuShortcut, DropdownMenuTrigger } from '@r/ui';
import { MoreHorizontal } from 'lucide-react';

export type TableRowAction<T> = {
  name: string;
  onAction?: (row: T) => void;
  danger?: boolean;
  icon?: React.ReactNode;
};

type Props<T> = {
  actions: TableRowAction<T>[];
  row: T;
};

export function TableRowActions<T>({ actions, row }: Props<T>) {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger>
        <Button size="icon" variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {actions.map((action, index) => {
          const icon = action.icon;
          return (
            <DropdownMenuItem
              key={index}
              className={cn(action.danger && 'text-destructive focus:text-destructive focus:bg-destructive/10')}
              onClick={() => action.onAction?.(row)}
            >
              {action.name}
              {icon && <DropdownMenuShortcut>{icon}</DropdownMenuShortcut>}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
