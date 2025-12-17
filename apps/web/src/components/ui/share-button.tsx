'use client';

import Button from '@repo/ui/Button';

export default function ShareButton({
  fill = false,
  big,
  small,
  onClick = () => alert('Link másolva a vágólapra!'),
}: {
  fill?: boolean;
  onClick?: () => void;
  big?: boolean;
  small?: boolean;
}) {
  const handleClick = () => {
    navigator.clipboard.writeText(window.location.href);
    onClick();
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
