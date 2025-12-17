'use client';

import Button from '@repo/ui/button';

export default function ShareButton({
  fill = false,
  big,
  small,
  onClickAction = () => alert('Link másolva a vágólapra!'),
}: {
  fill?: boolean;
  onClickAction?: () => void;
  big?: boolean;
  small?: boolean;
}) {
  const handleClick = () => {
    navigator.clipboard.writeText(window.location.href);
    onClickAction();
  };

  return (
    <Button
      styleType='primary'
      styleVariant='outlined'
      fill={fill}
      big={big}
      small={small}
      onClick={handleClick}
    >
      Megosztás
    </Button>
  );
}
