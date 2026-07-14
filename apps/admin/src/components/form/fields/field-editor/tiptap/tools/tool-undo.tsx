import { useTiptap, useTiptapState } from '@tiptap/react';
import { Undo } from 'lucide-react';

import { ToolButton } from '../components/tool-button';

export function ToolUndo() {
  const { editor } = useTiptap();
  const disabled = useTiptapState((state) => !state.editor.can().undo());

  if (!editor) {
    return null;
  }

  return <ToolButton icon={Undo} label="撤销" disabled={disabled} onClick={() => editor.chain().focus().undo().run()} />;
}
