import { useTiptap, useTiptapState } from '@tiptap/react';
import { ChevronDown, Heading1, Heading2, Heading3, Pilcrow } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/shared/utils';

const headingOptions = [
  { label: '正文', level: 0, icon: Pilcrow },
  { label: '标题 1', level: 1, icon: Heading1 },
  { label: '标题 2', level: 2, icon: Heading2 },
  { label: '标题 3', level: 3, icon: Heading3 },
] as const;

export function ToolHeading() {
  const { editor } = useTiptap();
  const currentLevel = useTiptapState(
    (state) => headingOptions.find((option) => option.level > 0 && state.editor.isActive('heading', { level: option.level }))?.level,
  );

  if (!editor) {
    return null;
  }

  const currentHeading = headingOptions.find((option) => option.level === currentLevel);
  const headingLabel = currentHeading?.label ?? '正文';
  const HeadingIcon = currentHeading?.icon ?? Pilcrow;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="ghost" size="sm" className="h-8 gap-1 px-2 text-sm font-normal">
          <HeadingIcon className="h-4 w-4" />
          <span>{headingLabel}</span>
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-[140px]">
        {headingOptions.map((option) => (
          <DropdownMenuItem
            key={option.level}
            className={cn('gap-2', option.level === currentLevel && 'bg-accent')}
            onClick={() => {
              if (option.level === 0) {
                editor.chain().focus().setParagraph().run();
              } else {
                editor.chain().focus().toggleHeading({ level: option.level }).run();
              }
            }}
          >
            <option.icon className="h-4 w-4" />
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
