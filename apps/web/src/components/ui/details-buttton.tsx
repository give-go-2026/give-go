'use client';

import Button from '@repo/ui/Button';

export default function DetailsButton({
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
      styleType='secondary'
      styleVariant='outlined'
      fill={fill}
      big={big}
      small={small}
      onClick={onClick}
    >
      Részletek
    </Button>
  );
}
