import type { TransformRichTextDocument } from './html-intake';
import type { ConvertRichTextImageUrls, UploadRichTextImages } from './image-intake';

export type TiptapEditorConfig = {
  imageIntake?: {
    uploadLocalImages?: UploadRichTextImages;
    convertRemoteImages?: ConvertRichTextImageUrls;
  };
  htmlImport?: {
    transformDocument?: TransformRichTextDocument;
  };
  wechatArticle?: {
    enabled?: boolean;
    fetchContent?: (url: string) => Promise<string>;
  };
};

export type ResolvedTiptapEditorConfig = {
  imageIntake: {
    uploadLocalImages: UploadRichTextImages;
    convertRemoteImages?: ConvertRichTextImageUrls;
  };
  htmlImport: {
    transformDocument?: TransformRichTextDocument;
  };
  wechatArticle: {
    enabled: boolean;
    fetchContent: (url: string) => Promise<string>;
  };
};

export function resolveTiptapEditorConfig(defaults: ResolvedTiptapEditorConfig, config?: TiptapEditorConfig): ResolvedTiptapEditorConfig {
  return {
    imageIntake: {
      ...defaults.imageIntake,
      ...config?.imageIntake,
    },
    htmlImport: {
      ...defaults.htmlImport,
      ...config?.htmlImport,
    },
    wechatArticle: {
      ...defaults.wechatArticle,
      ...config?.wechatArticle,
    },
  };
}
