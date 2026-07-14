import { Separator, TooltipProvider, toast } from '@r/ui';
import FileHandler from '@tiptap/extension-file-handler';
import TextAlign from '@tiptap/extension-text-align';
import { Tiptap, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { resolveTiptapEditorConfig, type TiptapEditorConfig } from './editor-config';
import { CustomImage } from './extends/image';
import { PasteHTML } from './extension/paste-html';
import {
  type ConvertRichTextImageUrls,
  convertDocumentImageUrls,
  getImageIntakeErrorMessage,
  readRichTextImagesAsDataUrls,
  uploadRichTextImages,
} from './image-intake';
import { ToolAlignCenter } from './tools/tool-align-center';
import { ToolAlignLeft } from './tools/tool-align-left';
import { ToolAlignRight } from './tools/tool-align-right';
import { ToolBlockquote } from './tools/tool-blockquote';
import { ToolBold } from './tools/tool-bold';
import { ToolBulletList } from './tools/tool-bullet-list';
import { ToolHeading } from './tools/tool-heading';
import { ToolImage } from './tools/tool-image';
import { ToolImageAlignCenter } from './tools/tool-image-align-center';
import { ToolImageAlignLeft } from './tools/tool-image-align-left';
import { ToolImageAlignRight } from './tools/tool-image-align-right';
import { ToolItalic } from './tools/tool-italic';
import { ToolOrderedList } from './tools/tool-ordered-list';
import { ToolStrike } from './tools/tool-strike';
import { ToolWechatArticle } from './tools/tool-wechat-article';

export type TiptapEditorProps = {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  config?: TiptapEditorConfig;
};

function createTransformDocument(convertRemoteImages: ConvertRichTextImageUrls) {
  return async (doc: Document) => {
    try {
      await convertDocumentImageUrls(doc, convertRemoteImages);
    } catch (error) {
      toast.error('上传失败', {
        description: getImageIntakeErrorMessage(error),
      });
      throw error;
    }
  };
}

export function TiptapEditor({ value = '<p></p>', onChange, placeholder, config }: TiptapEditorProps) {
  const defaultTransformDocument = config?.imageIntake?.convertRemoteImages ? createTransformDocument(config.imageIntake.convertRemoteImages) : undefined;
  const editorConfig = resolveTiptapEditorConfig(
    {
      imageIntake: {
        uploadLocalImages: readRichTextImagesAsDataUrls,
      },
      htmlImport: {
        transformDocument: defaultTransformDocument,
      },
      wechatArticle: {
        enabled: true,
        fetchContent: async (url) => url,
      },
    },
    config,
  );

  const editor = useEditor({
    extensions: [
      StarterKit,
      CustomImage.configure({
        HTMLAttributes: { style: 'max-width: 100%; height: auto;' },
      }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      FileHandler.configure({
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jpg'],
        onPaste: async (_e, files, html) => {
          if (html) return false;
          try {
            const images = await uploadRichTextImages(files, editorConfig.imageIntake.uploadLocalImages);
            images.forEach((image) => {
              _e.chain()
                .insertContentAt(_e.state.selection.anchor, {
                  type: 'image',
                  attrs: { src: image.src, alt: image.alt },
                })
                .focus()
                .run();
            });
          } catch (error) {
            toast.error('上传失败', {
              description: getImageIntakeErrorMessage(error),
            });
          }
        },
      }),
      PasteHTML.configure({
        transformDocument: editorConfig.htmlImport.transformDocument,
      }),
    ],
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[180px] p-2',
      },
    },
    content: value,
    injectCSS: false,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  // useEffect(() => {
  //   if (editor && !editor.isDestroyed && !editor.isFocused && value !== editor.getHTML()) {
  //     editor.commands.setContent(value, { emitUpdate: false });
  //   }
  // }, [editor, value]);

  if (!editor) return null;

  return (
    <TooltipProvider>
      <div className="rounded-md border border-input bg-background shadow-sm focus-within:ring-1 focus-within:ring-ring">
        <Tiptap editor={editor}>
          <div className="flex flex-wrap items-center gap-0.5 border-b bg-muted/40 p-1">
            <ToolHeading />
            <Separator orientation="vertical" className="mx-1 h-6" />
            <ToolBold />
            <ToolItalic />
            <ToolStrike />
            <Separator orientation="vertical" className="mx-1 h-6" />
            <ToolAlignLeft />
            <ToolAlignCenter />
            <ToolAlignRight />
            <Separator orientation="vertical" className="mx-1 h-6" />
            <ToolBulletList />
            <ToolOrderedList />
            <ToolBlockquote />
            <Separator orientation="vertical" className="mx-1 h-6" />
            <ToolImage uploadLocalImages={editorConfig.imageIntake.uploadLocalImages} />
            <ToolImageAlignLeft />
            <ToolImageAlignCenter />
            <ToolImageAlignRight />
            {editorConfig.wechatArticle.enabled && (
              <>
                <Separator orientation="vertical" className="mx-1 h-6" />
                <ToolWechatArticle fetchContent={editorConfig.wechatArticle.fetchContent} transformDocument={editorConfig.htmlImport.transformDocument} />
              </>
            )}
            {/* <ToolUndo /> */}
            {/* <ToolRedo /> */}
          </div>
          <Tiptap.Content className="overflow-auto h-[480px]" />
          {placeholder && editor.isEmpty && <p className="pointer-events-none absolute left-2 top-2 text-sm text-muted-foreground">{placeholder}</p>}
        </Tiptap>
      </div>
    </TooltipProvider>
  );
}
