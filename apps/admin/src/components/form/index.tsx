import { createFormHook } from '@tanstack/react-form';

import { fieldContext, formContext } from './context';
import { FieldCheckboxGroup } from './fields/field-checkbox-group';
import { FieldDatePicker } from './fields/field-date-picker';
import { FieldFileUpload } from './fields/field-file-upload';
import { FieldMap } from './fields/field-map';
import { FieldMultiSelect } from './fields/field-multi-select';
import { FieldRangeDatePicker } from './fields/field-range-date-picker';
import { FieldSelect } from './fields/field-select';
import { FieldText } from './fields/field-text';
import { SubmitButton } from './submit-button';

export const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    FieldCheckboxGroup,
    FieldDatePicker,
    FieldFileUpload,
    FieldRangeDatePicker,
    FieldMap,
    FieldMultiSelect,
    FieldSelect,
    FieldText,
  },
  formComponents: {
    SubmitButton,
  },
});
