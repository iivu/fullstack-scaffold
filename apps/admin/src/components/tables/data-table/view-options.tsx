import { Button, DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@r/ui';
import type { Table, VisibilityState } from '@tanstack/react-table';
import { Settings2Icon } from 'lucide-react';
import { useEffect, useMemo } from 'react';

export function TableViewOptions<TData>({ table }: { table: Table<TData> }) {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger>
        <Button variant="outline" className="hidden lg:flex">
          <Settings2Icon className="size-4" />
          列表视图
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-37.5">
        <DropdownMenuLabel>切换列显示/隐藏</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter((c) => !!c.accessorFn && c.getCanHide())
          .map((c) => (
            <DropdownMenuCheckboxItem key={c.id} checked={c.getIsVisible()} onCheckedChange={(value) => c.toggleVisibility(!!value)}>
              {c.columnDef.meta?.columnName}
            </DropdownMenuCheckboxItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ViewOptionsPersistence<TData>({ table, localKey }: { table: Table<TData>; localKey: string }) {
  const visibilityState = table.getState().columnVisibility;
  useEffect(() => {
    if (typeof window === 'undefined') return;
    window?.localStorage.removeItem(localKey);
    window?.localStorage.setItem(localKey, JSON.stringify(visibilityState));
  }, [visibilityState, localKey]);
  return null;
}

export function useViewOptionsPersistence(localKey: string) {
  function getPersistedViewOptions() {
    const persisted = window?.localStorage.getItem(localKey);
    if (!persisted) return {};
    try {
      return JSON.parse(persisted) as VisibilityState;
    } catch (error) {
      console.error('Failed to parse persisted view options:', error);
      return {};
    }
  }
  const ViewOptionsPersistenceHolder = useMemo(
    () =>
      <TData,>({ table }: { table: Table<TData> }) => <ViewOptionsPersistence table={table} localKey={localKey} />,
    [localKey],
  );
  return { getPersistedViewOptions, ViewOptionsPersistenceHolder };
}
