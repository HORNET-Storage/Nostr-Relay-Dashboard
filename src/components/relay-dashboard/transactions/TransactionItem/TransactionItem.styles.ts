import { BaseTypography } from '@app/components/common/BaseTypography/BaseTypography';
import { FONT_FAMILY, FONT_SIZE, FONT_WEIGHT } from '@app/styles/themes/constants';
import styled, { css } from 'styled-components';

interface StatusProps {
  $color: 'error' | 'warning' | 'success' | 'primary' | 'secondary';
}

interface CardInternalProps {
  $isSider?: boolean; // Make it optional
}

export const Title = styled(BaseTypography.Text)`
  font-size: ${FONT_SIZE.xs};
  font-family: ${FONT_FAMILY.secondary};
`;

export const Status = styled(BaseTypography.Text)<StatusProps>`
  color: ${(props) => `var(--${props.$color}-color)`};
  font-size: ${FONT_SIZE.xs};
  font-family: ${FONT_FAMILY.secondary};
`;

export const DateText = styled(Title)`
  font-weight: ${FONT_WEIGHT.regular};
`;

export const Text = styled(BaseTypography.Text)`
  font-size: ${FONT_SIZE.xs};
  font-weight: ${FONT_WEIGHT.regular};
  font-family: ${FONT_FAMILY.secondary};
`;

export const TransactionCard = styled.div<CardInternalProps>`
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: var(--box-shadow-nft-color);

  background: var(--additional-background-color); /* Use the theme variable for background */

  ${(props) =>
    props.$isSider &&
    css`
      background: var(--sider-background-color);,
    `};
`;

export const Label = styled.span`
  display: block;
  color: #aaa; /* Light gray for labels */
  font-size: 0.75rem; /* Smaller font size for labels */
  margin-bottom: 4px; /* Space between label and content */
`;

export const Address = styled.h3`
  color: #fff; /* White color for better readability */
  font-size: 1rem;
  margin-bottom: 10px;
  word-break: break-all; /* Break long addresses */
`;

export const Output = styled.p`
  color: #aaa; /* Light gray for secondary text */
  font-size: 0.875rem;
  margin-bottom: 10px;
  word-break: break-all; /* Break long outputs */
`;

export const Value = styled.span`
  color: #fff;
  font-size: 1rem;
  font-weight: bold;
  text-align: right;
`;
