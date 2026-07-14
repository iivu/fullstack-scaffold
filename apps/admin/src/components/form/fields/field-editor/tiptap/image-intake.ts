export type RichTextImage = {
  src: string;
  alt?: string;
};

type UploadedImage = {
  url: string;
  name: string;
};

export type UploadRichTextImages = (files: File[]) => Promise<UploadedImage[]>;
export type ConvertRichTextImageUrls = (urls: string[]) => Promise<string[]>;

const FALLBACK_UPLOAD_ERROR_MESSAGE = '请检查网络或稍后再试';

export function getImageIntakeErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === 'object' && error !== null && 'message' in error) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === 'string' && message) return message;
  }
  return FALLBACK_UPLOAD_ERROR_MESSAGE;
}

export async function uploadRichTextImages(files: File[], upload: UploadRichTextImages): Promise<RichTextImage[]> {
  if (files.length === 0) return [];
  const uploadedImages = await upload(files);
  if (uploadedImages.length !== files.length) {
    throw new Error('上传文件失败，请稍后再试');
  }
  return uploadedImages.map((image) => ({
    src: image.url,
    alt: image.name,
  }));
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
        return;
      }
      reject(new Error('读取图片失败，请稍后再试'));
    });
    reader.addEventListener('error', () => reject(new Error('读取图片失败，请稍后再试')));
    reader.readAsDataURL(file);
  });
}

export async function readRichTextImagesAsDataUrls(files: File[]) {
  return Promise.all(
    files.map(async (file) => ({
      url: await readFileAsDataUrl(file),
      name: file.name,
    })),
  );
}

export async function convertRichTextImageUrls(urls: string[], convert: ConvertRichTextImageUrls) {
  if (urls.length === 0) return [];
  const convertedUrls = await convert(urls);
  if (convertedUrls.length !== urls.length) {
    throw new Error('上传文件失败，请稍后再试');
  }
  return convertedUrls;
}

export async function convertDocumentImageUrls(doc: Document, convert: ConvertRichTextImageUrls) {
  const images = Array.from(doc.querySelectorAll('img'));
  const urls = images.map((img) => img.src || img.dataset.src || '').filter(Boolean);
  if (urls.length === 0) return;
  const convertedUrls = await convertRichTextImageUrls(urls, convert);
  images.forEach((img, index) => {
    img.src = convertedUrls[index];
  });
}
