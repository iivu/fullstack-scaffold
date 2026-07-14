import { useTiptap, useTiptapState } from '@tiptap/react';
import { AlignRight } from 'lucide-react';

import { ToolButton } from '../components/tool-button';

export function ToolAlignRight() {
  const { editor } = useTiptap();
  const isActive = useTiptapState((state) => state.editor.isActive({ textAlign: 'right' }));

  if (!editor) {
    return null;
  }

  return <ToolButton icon={AlignRight} label="右对齐" active={isActive} onClick={() => editor.chain().focus().setTextAlign('right').run()} />;
}
