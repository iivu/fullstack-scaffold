import { Skeleton } from '@r/ui';
import { Suspense } from 'react';

import { useFieldContext } from '../../context';
import { FieldBase, type FieldBaseProps } from '../field-base';
import type { TiptapEditorProps } from './tiptap/editor';
import { TiptapEditor } from './tiptap/lazy';

export type FieldEditorConfig = NonNullable<TiptapEditorProps['config']>;

type Props = FieldBaseProps & {
  editorConfig?: FieldEditorConfig;
};

export function useFieldEditorConfig(): FieldEditorConfig {
  return {
    imageIntake: {
      uploadLocalImages: undefined,
      convertRemoteImages: undefined,
    },
    wechatArticle: {
      enabled: false,
      fetchContent: undefined,
    },
  };
}

export function FieldEditor({ editorConfig, ...props }: Props) {
  const field = useFieldContext<string>();
  const defaultEditorConfig = useFieldEditorConfig();

  return (
    <FieldBase {...props}>
      <Suspense fallback={<Skeleton className="h-48 rounded-md" />}>
        <TiptapEditor value={field.state.value} config={editorConfig ?? defaultEditorConfig} onChange={(value) => field.handleChange(value)} />
      </Suspense>
    </FieldBase>
  );
}
