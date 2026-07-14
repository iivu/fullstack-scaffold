import { cn, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@r/ui';
import { useCallback, useMemo } from 'react';

import { useFieldContext } from '../context';
import { FieldBase, type FieldBaseProps } from './field-base';

export type SelectOption<T> = {
  label: React.ReactNode;
  value: T;
};

type Props<T> = FieldBaseProps & {
  options: SelectOption<T>[];
  placeholder?: string;
  /** 将选项值转换为底层 Select 使用的字符串 key，默认使用 `String`。 */
  valueToString?: (value: T) => string;
  className?: string;
};

function defaultValueToString<T>(value: T): string {
  return String(value);
}

export function FieldSelect<T = string>({ options, placeholder, valueToString = defaultValueToString, className, ...baseProps }: Props<T>) {
  const field = useFieldContext<T>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  const valueMap = useMemo(() => {
    const map = new Map<string, T>();
    for (const option of options) {
      map.set(valueToString(option.value), option.value);
    }
    return map;
  }, [options, valueToString]);

  const currentKey = useMemo(() => valueToString(field.state.value), [field.state.value, valueToString]);

  const onChange = useCallback(
    (key: string | null) => {
      const next = valueMap.get(key || '');
      if (next !== undefined) {
        field.handleChange(next);
      }
    },
    [field.handleChange, valueMap],
  );

  return (
    <FieldBase {...baseProps}>
      <Select value={currentKey} onValueChange={onChange}>
        <SelectTrigger id={field.name} aria-invalid={isInvalid} className={cn(className)}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => {
            const key = valueToString(option.value);
            return (
              <SelectItem key={key} value={key}>
                {option.label}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </FieldBase>
  );
}
