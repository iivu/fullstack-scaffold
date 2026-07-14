import { Button, cn, Tooltip, TooltipContent, TooltipTrigger } from '@r/ui';

type ToolButtonProps = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  side?: 'top' | 'bottom' | 'left' | 'right';
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  tooltip?: {
    tooltipContent?: {
      side?: 'top' | 'bottom' | 'left' | 'right';
    };
  };
  iconClassName?: string;
};

export function ToolButton({ icon: Icon, label, active, disabled, onClick, tooltip, iconClassName }: ToolButtonProps) {
  const tooltipSide = tooltip?.tooltipContent?.side || 'top';
  return (
    <Tooltip>
      <TooltipTrigger>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn('h-8 w-8', active && 'bg-accent text-accent-foreground')}
          disabled={disabled}
          onClick={onClick}
        >
          <Icon className={cn('size-4', iconClassName)} />
          <span className="sr-only">{label}</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent side={tooltipSide}>
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  );
}
