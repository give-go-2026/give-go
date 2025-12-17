'use client';

import Button from '@repo/ui/button';

export default function ApplyButton({
  fill = false,
  big,
  small,
  onClickAction,
}: {
  fill?: boolean;
  onClickAction?: () => void;
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
      onClick={onClickAction}
    >
      Jelentkezem
    </Button>
  );
}
