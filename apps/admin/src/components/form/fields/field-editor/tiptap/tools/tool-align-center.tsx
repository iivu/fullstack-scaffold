import { useTiptap, useTiptapState } from '@tiptap/react';
import { AlignCenter } from 'lucide-react';

import { ToolButton } from '../components/tool-button';

export function ToolAlignCenter() {
  const { editor } = useTiptap();
  const isActive = useTiptapState((state) => state.editor.isActive({ textAlign: 'center' }));

  if (!editor) {
    return null;
  }

  return <ToolButton icon={AlignCenter} label="居中对齐" active={isActive} onClick={() => editor.chain().focus().setTextAlign('center').run()} />;
}
