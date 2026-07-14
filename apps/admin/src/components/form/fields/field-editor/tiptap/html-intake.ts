import type { Editor } from '@tiptap/core';

export type TransformRichTextDocument = (doc: Document) => Promise<void> | void;

export type InsertRichTextHTMLOptions = {
  transformDocument?: TransformRichTextDocument;
};

export async function insertRichTextHTML(editor: Editor, html: string, options?: InsertRichTextHTMLOptions) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  if (options?.transformDocument) {
    await options.transformDocument(doc);
  }

  editor.chain().focus().insertContentAt(editor.state.selection.anchor, doc.body.innerHTML).run();
}
