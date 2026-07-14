import { useTiptap, useTiptapState } from '@tiptap/react';
import { AlignStartVertical } from 'lucide-react';

import { ToolButton } from '../components/tool-button';

export function ToolImageAlignLeft() {
  const { editor } = useTiptap();
  const isActive = useTiptapState((state) => state.editor.isActive('image', { alignment: 'left' }));
  const disabled = useTiptapState((state) => !state.editor.isActive('image'));

  if (!editor) {
    return null;
  }

  return (
    <ToolButton
      icon={AlignStartVertical}
      label="图片左对齐"
      active={isActive}
      disabled={disabled}
      onClick={() => editor.chain().focus().updateAttributes('image', { alignment: 'left' }).run()}
    />
  );
}
