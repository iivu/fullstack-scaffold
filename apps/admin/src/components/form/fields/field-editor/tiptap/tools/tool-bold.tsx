import { useTiptap, useTiptapState } from '@tiptap/react';
import { Bold } from 'lucide-react';

import { ToolButton } from '../components/tool-button';

export function ToolBold() {
  const { editor } = useTiptap();
  const isActive = useTiptapState((state) => state.editor.isActive('bold'));

  if (!editor) {
    return null;
  }

  return <ToolButton icon={Bold} label="加粗" active={isActive} onClick={() => editor.chain().focus().toggleBold().run()} />;
}
