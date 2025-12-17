export type ButtonStyleType = 'primary' | 'secondary';
export type ButtonStyleVariant = 'filled' | 'outlined';

export type ButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'style' | 'className'
> & {
  styleType: ButtonStyleType;
  styleVariant: ButtonStyleVariant;
  fill?: boolean;
  big?: boolean;
  small?: boolean;
  children: React.ReactNode;
};
