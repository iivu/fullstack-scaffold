import { useTiptap, useTiptapState } from '@tiptap/react';
import { AlignCenterVertical } from 'lucide-react';

import { ToolButton } from '../components/tool-button';

export function ToolImageAlignCenter() {
  const { editor } = useTiptap();
  const isActive = useTiptapState((state) => state.editor.isActive('image', { alignment: 'center' }));
  const disabled = useTiptapState((state) => !state.editor.isActive('image'));

  if (!editor) {
    return null;
  }

  return (
    <ToolButton
      icon={AlignCenterVertical}
      label="图片居中"
      active={isActive}
      disabled={disabled}
      onClick={() => editor.chain().focus().updateAttributes('image', { alignment: 'center' }).run()}
    />
  );
}
