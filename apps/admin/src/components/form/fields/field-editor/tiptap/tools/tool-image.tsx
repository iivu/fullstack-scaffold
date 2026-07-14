import { useTiptap } from '@tiptap/react';
import { Image } from 'lucide-react';
import { useRef } from 'react';

import { toast } from '@/hooks/use-toast';
import { ToolButton } from '../components/tool-button';
import { getImageIntakeErrorMessage, type UploadRichTextImages, uploadRichTextImages } from '../image-intake';

type Props = {
  uploadLocalImages: UploadRichTextImages;
};

export function ToolImage({ uploadLocalImages }: Props) {
  const { editor } = useTiptap();
  const inputRef = useRef<HTMLInputElement>(null);

  if (!editor) {
    return null;
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      const images = await uploadRichTextImages([file], uploadLocalImages);
      const image = images[0];
      editor.chain().focus().setImage({ src: image.src, alt: image.alt }).run();
    } catch (error) {
      toast.destructive({ title: '上传失败', description: getImageIntakeErrorMessage(error) });
    } finally {
      // Reset input so the same file can be selected again
      event.target.value = '';
    }
  };

  return (
    <>
      <input ref={inputRef} type="file" accept="image/*" className="sr-only" onChange={handleFileChange} />
      <ToolButton icon={Image} label="插入图片" onClick={() => inputRef.current?.click()} />
    </>
  );
}
