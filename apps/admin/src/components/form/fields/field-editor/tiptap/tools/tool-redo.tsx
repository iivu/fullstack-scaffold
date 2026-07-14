import { useTiptap, useTiptapState } from '@tiptap/react';
import { Redo } from 'lucide-react';

import { ToolButton } from '../components/tool-button';

export function ToolRedo() {
  const { editor } = useTiptap();
  const disabled = useTiptapState((state) => !state.editor.can().redo());

  if (!editor) {
    return null;
  }

  return <ToolButton icon={Redo} label="重做" disabled={disabled} onClick={() => editor.chain().focus().redo().run()} />;
}
