import { Checkbox, cn } from '@r/ui';

import { useFieldContext } from '../context';
import { FieldBase, type FieldBaseProps } from './field-base';

export type CheckboxOption = {
  label: React.ReactNode;
  value: string;
};

type Props = FieldBaseProps & {
  options: CheckboxOption[];
  className?: string;
};

export function FieldCheckboxGroup({ options, className, ...baseProps }: Props) {
  const field = useFieldContext<string[]>();
  const value = field.state.value ?? [];

  function toggle(optionValue: string) {
    const next = value.includes(optionValue) ? value.filter((v) => v !== optionValue) : [...value, optionValue];
    field.handleChange(next);
  }

  return (
    <FieldBase {...baseProps}>
      <div className={cn('flex flex-wrap gap-4', className)}>
        {options.map((option) => {
          const checked = value.includes(option.value);
          return (
            <label key={option.value} className="flex items-center gap-2 text-sm cursor-pointer">
              <Checkbox id={`${field.name}-${option.value}`} checked={checked} onCheckedChange={() => toggle(option.value)} />
              <span>{option.label}</span>
            </label>
          );
        })}
      </div>
    </FieldBase>
  );
}
