import { Button, cn } from '@r/ui';
import { Loader } from 'lucide-react';
import { useFormContext } from './context';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  text?: string;
};

export function SubmitButton({ text = '提交', type = 'submit', ...rest }: Props) {
  const form = useFormContext();

  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <Button className={cn(rest.className)} disabled={isSubmitting} type={type} {...rest}>
          {text}
          {isSubmitting && <Loader className="ml-2 h-4 w-4 animate-spin" />}
        </Button>
      )}
    </form.Subscribe>
  );
}
