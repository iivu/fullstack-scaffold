import { Badge, Button, cn, DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@r/ui';
import { ChevronDown } from 'lucide-react';
import { useMemo } from 'react';

import { useFieldContext } from '../context';
import { FieldBase, type FieldBaseProps } from './field-base';

export type MultiSelectOption<T> = {
  label: React.ReactNode;
  value: T;
};

type FieldMultiSelectProps<T> = FieldBaseProps & {
  options: MultiSelectOption<T>[];
  placeholder?: string;
  className?: string;
};

type TriggerProps<T> = {
  value: T[];
  labelMap: Map<string, React.ReactNode>;
  placeholder?: string;
  className?: string;
};

type ContentProps<T> = {
  options: MultiSelectOption<T>[];
  value: T[];
  onToggle: (optionValue: T) => void;
};

function MultiSelectTrigger<T>({ value, labelMap, placeholder, className }: TriggerProps<T>) {
  return (
    <DropdownMenuTrigger>
      <Button
        type="button"
        variant="outline"
        className={cn(
          'flex h-auto min-h-9 w-full font-normal items-center justify-between gap-2 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
          className,
        )}
      >
        <span className="flex flex-1 flex-wrap gap-1">
          {value.length === 0 ? (
            <span className="text-muted-foreground">{placeholder}</span>
          ) : (
            value.map((v) => (
              <Badge key={String(v)} variant="secondary">
                {labelMap.get(String(v)) ?? String(v)}
              </Badge>
            ))
          )}
        </span>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </Button>
    </DropdownMenuTrigger>
  );
}

function MultiSelectContent<T>({ options, value, onToggle }: ContentProps<T>) {
  return (
    <DropdownMenuContent className="w-auto" align="start">
      {options.map((option) => {
        const key = String(option.value);
        const checked = value.some((v) => String(v) === key);
        return (
          <DropdownMenuCheckboxItem key={key} checked={checked} onCheckedChange={() => onToggle(option.value)} onSelect={(e) => e.preventDefault()}>
            {option.label}
          </DropdownMenuCheckboxItem>
        );
      })}
    </DropdownMenuContent>
  );
}

export function FieldMultiSelect<T = string>({ options, placeholder, className, ...baseProps }: FieldMultiSelectProps<T>) {
  const field = useFieldContext<T[]>();
  const value = field.state.value ?? [];
  const labelMap = useMemo(() => new Map(options.map((o) => [String(o.value), o.label])), [options]);

  function toggle(optionValue: T) {
    const key = String(optionValue);
    const next = value.some((v) => String(v) === key) ? value.filter((v) => String(v) !== key) : [...value, optionValue];
    field.handleChange(next);
  }

  return (
    <FieldBase {...baseProps}>
      <DropdownMenu>
        <MultiSelectTrigger value={value} labelMap={labelMap} placeholder={placeholder} className={className} />
        <MultiSelectContent options={options} value={value} onToggle={toggle} />
      </DropdownMenu>
    </FieldBase>
  );
}
