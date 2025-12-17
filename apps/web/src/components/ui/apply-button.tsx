'use client';

import Button from '@repo/ui/Button';

export default function ApplyButton({
  fill = false,
  big,
  small,
  onClick,
}: {
  fill?: boolean;
  onClick?: () => void;
  big?: boolean;
  small?: boolean;
}) {
  return (
    <Button
      styleType='primary'
      styleVariant='filled'
      fill={fill}
      big={big}
      small={small}
      onClick={onClick}
    >
      Jelentkezem
    </Button>
  );
}
