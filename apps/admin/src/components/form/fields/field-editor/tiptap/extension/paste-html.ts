import { type Editor, Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { type InsertRichTextHTMLOptions, insertRichTextHTML } from '../html-intake';

let processing = false;

export type Options = InsertRichTextHTMLOptions;

const PasteHtmlPlugin = (editor: Editor, options: Options) => {
  return new Plugin({
    key: new PluginKey('__paste-html__'),
    props: {
      handlePaste(_view, event) {
        const htmlContent = event.clipboardData?.getData('text/html');
        if (!htmlContent) return false;
        if (processing) return true;
        event.preventDefault();
        event.stopPropagation();
        processing = true;
        void insertRichTextHTML(editor, htmlContent, options)
          .catch(() => undefined)
          .finally(() => {
            processing = false;
          });
        return true;
      },
    },
  });
};

export const PasteHTML = Extension.create<Options>({
  name: '__paste-html__',
  addOptions() {
    return {
      transformDocument: undefined,
    };
  },
  addProseMirrorPlugins() {
    return [PasteHtmlPlugin(this.editor, this.options)];
  },
});
