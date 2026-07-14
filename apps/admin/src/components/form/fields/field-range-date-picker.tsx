import { cn, type DateRange, RangeDatePicker } from '@r/ui';

import { useFieldContext } from '../context';
import { FieldBase, type FieldBaseProps } from './field-base';

type Props = FieldBaseProps & {
  placeholder?: string;
  className?: string;
  dateFormat?: string;
};

export function FieldRangeDatePicker({ placeholder, className, dateFormat, ...baseProps }: Props) {
  const field = useFieldContext<DateRange | undefined>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <FieldBase {...baseProps}>
      <RangeDatePicker
        value={field.state.value}
        onChange={(range) => field.handleChange(range)}
        placeholder={placeholder}
        dateFormat={dateFormat}
        className={cn(isInvalid && 'border-destructive focus-visible:ring-destructive', className)}
      />
    </FieldBase>
  );
}
