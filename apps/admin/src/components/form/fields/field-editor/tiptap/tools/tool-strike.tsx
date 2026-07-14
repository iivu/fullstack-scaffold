import { useTiptap, useTiptapState } from '@tiptap/react';
import { Strikethrough } from 'lucide-react';

import { ToolButton } from '../components/tool-button';

export function ToolStrike() {
  const { editor } = useTiptap();
  const isActive = useTiptapState((state) => state.editor.isActive('strike'));

  if (!editor) {
    return null;
  }

  return <ToolButton icon={Strikethrough} label="删除线" active={isActive} onClick={() => editor.chain().focus().toggleStrike().run()} />;
}
