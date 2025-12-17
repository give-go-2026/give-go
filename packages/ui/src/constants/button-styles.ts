import { CSSProperties } from 'react';

export const ButtonStyles: CSSProperties = {
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '6px 12px',
  gap: '8px',
  position: 'relative',
  width: '129px',
  height: '38px',
  borderRadius: '30px',
} as const;

export const PrimaryFilledButtonStyle: CSSProperties = {
  ...ButtonStyles,
  background: '#284B63',
  color: '#FFFFFF',
  border: '1px solid #284B63',
} as const;

export const PrimaryOutlinedButtonStyle: CSSProperties = {
  ...ButtonStyles,
  width: '311px',
  height: '46px',
  background: 'transparent',
  color: '#284B63',
  border: '1px solid #284B63',
} as const;

export const SecondaryFilledButtonStyle: CSSProperties = {
  ...ButtonStyles,
  width: '311px',
  height: '46px',
  background: '#7E9FB6',
  color: '#FFFFFF',
  opacity: 0.65,
} as const;

export const SecondaryOutlinedButtonStyle: CSSProperties = {
  ...ButtonStyles,
  background: 'transparent',
  color: '#6C757D',
  border: '1px solid #6C757D',
} as const;
