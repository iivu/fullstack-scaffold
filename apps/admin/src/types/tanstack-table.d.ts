import '@tanstack/react-table';

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData, TValue> {
    className?: string; // apply to both th and td
    tdClassName?: string;
    thClassName?: string;
    columnName?: string;
  }

  interface TableMeta<TData> {
    // onUpdate?: (row: TData) => void;
    // onDelete?: (row: TData) => void;
    // onViewCodes?: (row: TData) => void;
    // onViewExplains?: (row: TData) => void;
    // onViewDelicacies?: (row: TData) => void;
    // onViewPhotos?: (row: TData) => void;
    // onCancel?: (rows: TData[]) => void;
    // isCancelPending?: boolean;
  }
}
