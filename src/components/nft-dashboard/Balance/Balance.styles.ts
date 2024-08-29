import { BaseTypography } from '@app/components/common/BaseTypography/BaseTypography';
import { FONT_FAMILY, FONT_SIZE, FONT_WEIGHT } from '@app/styles/themes/constants';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import styled from 'styled-components';

export const TitleText = styled(BaseTypography.Title)`
  &.ant-typography {
    margin-bottom: 1.25rem;

    font-size: ${FONT_SIZE.xs};
  }
`;

export const TitleBalanceText = styled(BaseTypography.Title)`
  &.ant-typography {
    margin-bottom: 0;

    font-family: ${FONT_FAMILY.secondary};
  }
`;

export const SubtitleBalanceText = styled(BaseTypography.Text)`
  font-family: ${FONT_FAMILY.secondary};

  font-size: ${FONT_SIZE.xs};

  font-weight: ${FONT_WEIGHT.regular};

  color: var(--text-nft-light-color);
`;

export const Text = styled(BaseTypography.Text)`
  font-family: ${FONT_FAMILY.secondary};
  font-size: ${FONT_SIZE.md};
  font-weight: ${FONT_WEIGHT.regular};
  color: var(--text-nft-light-color);
`;

// Style the switch and its label
export const SwitchContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem; // Adjust spacing as needed
`;

export const LabelSpan = styled.span`
  margin-left: 10px;
  color: #fff; // Adjust color based on your theme
  font-size: 1rem; // Adjust size as needed
`;
export const BalanceButtonsContainers = styled(BaseRow)`
  width: 100%;
  padding: 0 1rem;
`
