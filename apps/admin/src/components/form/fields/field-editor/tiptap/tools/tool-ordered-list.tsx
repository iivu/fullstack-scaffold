import { useTiptap, useTiptapState } from '@tiptap/react';
import { ListOrdered } from 'lucide-react';

import { ToolButton } from '../components/tool-button';

export function ToolOrderedList() {
  const { editor } = useTiptap();
  const isActive = useTiptapState((state) => state.editor.isActive('orderedList'));

  if (!editor) {
    return null;
  }

  return <ToolButton icon={ListOrdered} label="有序列表" active={isActive} onClick={() => editor.chain().focus().toggleOrderedList().run()} />;
}
