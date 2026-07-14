import { useTiptap, useTiptapState } from '@tiptap/react';
import { List } from 'lucide-react';

import { ToolButton } from '../components/tool-button';

export function ToolBulletList() {
  const { editor } = useTiptap();
  const isActive = useTiptapState((state) => state.editor.isActive('bulletList'));

  if (!editor) {
    return null;
  }

  return <ToolButton icon={List} label="无序列表" active={isActive} onClick={() => editor.chain().focus().toggleBulletList().run()} />;
}
