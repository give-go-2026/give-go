'use client';

import Button from '@repo/ui/button';

export default function DetailsButton({
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
      styleType='secondary'
      styleVariant='outlined'
      fill={fill}
      big={big}
      small={small}
      onClick={onClickAction}
    >
      Részletek
    </Button>
  );
}
