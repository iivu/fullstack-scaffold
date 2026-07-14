import { useCallback } from 'react';
import { Input, Textarea ,cn} from '@r/ui';

import { useFieldContext } from '../context';
import { FieldBase, type FieldBaseProps } from './field-base';

type Props = FieldBaseProps & {
  type?: HTMLInputElement['type'];
  inputType?: 'input' | 'textarea';
  placeholder?: string;
  className?: string;
  rows?: number;
};

export function FieldText({ type = 'text', inputType = 'input', placeholder, className, rows, ...baseProps }: Props) {
  const field = useFieldContext<string | number>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
  const placeholderText = placeholder || (typeof baseProps.label === 'string' ? baseProps.label : '');
  const isNumberInput = type === 'number' && inputType === 'input';
  const textareaRows = inputType === 'textarea' ? (rows ?? 5) : undefined;

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value;
      field.handleChange(isNumberInput ? Number(value) : value);
    },
    [field, isNumberInput]
  );

  return (
    <FieldBase {...baseProps}>
      {inputType === 'input' ? (
        <Input
          className={cn(className)}
          aria-invalid={isInvalid}
          name={field.name}
          type={type}
          id={field.name}
          value={field.state.value}
          onChange={onChange}
          placeholder={placeholderText}
        />
      ) : null}
      {inputType === 'textarea' ? (
        <Textarea
          className={cn(className)}
          aria-invalid={isInvalid}
          name={field.name}
          id={field.name}
          value={field.state.value}
          onChange={onChange}
          placeholder={placeholderText}
          rows={textareaRows}
        />
      ) : null}
    </FieldBase>
  );
}
