import { useTiptap, useTiptapState } from '@tiptap/react';
import { Quote } from 'lucide-react';

import { ToolButton } from '../components/tool-button';

export function ToolBlockquote() {
  const { editor } = useTiptap();
  const isActive = useTiptapState((state) => state.editor.isActive('blockquote'));

  if (!editor) {
    return null;
  }

  return <ToolButton icon={Quote} label="引用" active={isActive} onClick={() => editor.chain().focus().toggleBlockquote().run()} />;
}
