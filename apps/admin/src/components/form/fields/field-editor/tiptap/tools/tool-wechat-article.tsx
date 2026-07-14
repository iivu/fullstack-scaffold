import { useTiptap } from '@tiptap/react';
import { type SubmitEvent, useState } from 'react';

import { AntDesignWechatFilled } from '@/components/icons/wechat';
import { Button, Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, Input } from '@/components/ui';
import { toast } from '@/hooks/use-toast';
import { ToolButton } from '../components/tool-button';
import { insertRichTextHTML, type TransformRichTextDocument } from '../html-intake';

type Props = {
  fetchContent: (url: string) => Promise<string>;
  transformDocument?: TransformRichTextDocument;
};

function normalizeArticleUrl(value: string) {
  const url = value.trim();
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error('请输入有效的文章链接');
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new Error('请输入 http 或 https 链接');
  }
  return parsed.toString();
}

function getImportErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === 'object' && error !== null && 'message' in error) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === 'string' && message) return message;
  }
  return '导入失败，请检查链接或稍后再试';
}

export function ToolWechatArticle({ fetchContent, transformDocument }: Props) {
  const { editor } = useTiptap();
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!editor) {
    return null;
  }

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    try {
      const normalizedUrl = normalizeArticleUrl(url);
      const content = await fetchContent(normalizedUrl);
      await insertRichTextHTML(editor, content, { transformDocument });
      setOpen(false);
      setUrl('');
    } catch (error) {
      toast.destructive({ title: '导入失败', description: getImportErrorMessage(error) });
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (submitting) return;
    setOpen(nextOpen);
  };

  return (
    <>
      <ToolButton iconClassName="!size-5" icon={AntDesignWechatFilled} label="导入公众号文章" onClick={() => setOpen(true)} />
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>导入公众号文章</DialogTitle>
          </DialogHeader>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <Input
              value={url}
              aria-label="公众号文章链接"
              disabled={submitting}
              placeholder="请输入公众号文章链接"
              onChange={(event) => setUrl(event.target.value)}
            />
            <DialogFooter>
              <Button type="submit" disabled={submitting}>
                {submitting ? '导入中...' : '导入'}
              </Button>
              <Button variant="outline" type="button" disabled={submitting} onClick={() => setOpen(false)}>
                取消
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
