import { useTiptap, useTiptapState } from '@tiptap/react';
import { Italic } from 'lucide-react';

import { ToolButton } from '../components/tool-button';

export function ToolItalic() {
  const { editor } = useTiptap();
  const isActive = useTiptapState((state) => state.editor.isActive('italic'));

  if (!editor) {
    return null;
  }

  return <ToolButton icon={Italic} label="斜体" active={isActive} onClick={() => editor.chain().focus().toggleItalic().run()} />;
}
