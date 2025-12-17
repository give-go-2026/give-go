'use client';

import { ButtonProps } from '../types';
import { getButtonStyle } from '../utils/buttons';

import '../styles/button.css';

export default function Button({
  styleType,
  styleVariant,
  fill,
  children,
  big,
  small,
  ...props
}: ButtonProps) {
  const buttonStyle = getButtonStyle(styleType, styleVariant);
  const style = {
    ...buttonStyle,
    ...(fill ? { width: '100%' } : {}),
    ...(big ? { height: '46px' } : {}),
    ...(small ? { height: '30px' } : {}),
  };
  return (
    <button
      style={style}
      {...props}
    >
      {children}
    </button>
  );
}
