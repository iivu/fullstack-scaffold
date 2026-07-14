import { useTiptap, useTiptapState } from '@tiptap/react';
import { AlignLeft } from 'lucide-react';

import { ToolButton } from '../components/tool-button';

export function ToolAlignLeft() {
  const { editor } = useTiptap();
  const isActive = useTiptapState((state) => !state.editor.isActive({ textAlign: 'center' }) && !state.editor.isActive({ textAlign: 'right' }));

  if (!editor) {
    return null;
  }

  return <ToolButton icon={AlignLeft} label="左对齐" active={isActive} onClick={() => editor.chain().focus().setTextAlign('left').run()} />;
}
