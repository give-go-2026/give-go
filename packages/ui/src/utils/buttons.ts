import { CSSProperties } from 'react';
import { ButtonStyleType, ButtonStyleVariant } from '../types';
import * as Styles from '../constants/button-styles';

export const getButtonStyle = (
  type: ButtonStyleType,
  variant: ButtonStyleVariant,
): CSSProperties => {
  switch (type) {
    case 'primary':
      switch (variant) {
        case 'filled':
          return Styles.PrimaryFilledButtonStyle;
        case 'outlined':
          return Styles.PrimaryOutlinedButtonStyle;
      }
      break;
    case 'secondary':
      switch (variant) {
        case 'filled':
          return Styles.SecondaryFilledButtonStyle;
        case 'outlined':
          return Styles.SecondaryOutlinedButtonStyle;
      }
      break;
    default:
      throw new Error(`Unsupported button style type: ${type}`);
  }
};
