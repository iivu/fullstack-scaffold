import { useTiptap, useTiptapState } from '@tiptap/react';
import { AlignEndVertical } from 'lucide-react';

import { ToolButton } from '../components/tool-button';

export function ToolImageAlignRight() {
  const { editor } = useTiptap();
  const isActive = useTiptapState((state) => state.editor.isActive('image', { alignment: 'right' }));
  const disabled = useTiptapState((state) => !state.editor.isActive('image'));

  if (!editor) {
    return null;
  }

  return (
    <ToolButton
      icon={AlignEndVertical}
      label="图片右对齐"
      active={isActive}
      disabled={disabled}
      onClick={() => editor.chain().focus().updateAttributes('image', { alignment: 'right' }).run()}
    />
  );
}
