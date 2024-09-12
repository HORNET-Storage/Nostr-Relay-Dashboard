import styled, { css } from 'styled-components';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { BaseBreadcrumb } from '@app/components/common/BaseBreadcrumb/BaseBreadcrumb';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';

export const MediaManagerContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;
export const Breadcrumb = styled(BaseBreadcrumb)<{ $is4kScreen: boolean }>`
  font-size: 1.2rem;
  padding-left: 1rem;
  ${(props) =>
    props.$is4kScreen &&
    css`
      font-size: 2rem;
    `}
`;

export const BreadcrumbWrapper = styled.div<{ isTablet?: boolean }>`
  width: 100%;
  height: 100%;
  display: flex;
    padding-bottom:2rem;
  ${(props) =>
    props.isTablet &&
    css`
      padding-bottom: 0;
    `}
  }

  text-align: center;
  align-items: center;
`;

export const ToolBarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
`;

export const ButtonsContainer = styled.div<{ isTablet?: boolean }>`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  width: 100%;
  ${(props) =>
    props.isTablet &&
    css`
      padding-right: 1rem;
    `}
`;

export const MediaItemsContainer = styled.div`
  height: 100%;
  overflow-y: auto;
  padding-top: 2rem;
`;

export const ToolBarButton = styled(BaseButton)<{ $isActive?: boolean; $is4kScreen: boolean }>`
  font-size: 0.8rem;
  ${(props) =>
    props.$isActive
      ? css`
          color: var(--ant-primary-color-hover);
          border-color: var(--ant-primary-color-hover);
        `
      : css`
          color: var(--text-main-color) !important;
          border-color: var(--border-base-color);
        `}
  ${(props) =>
    props.$is4kScreen &&
    css`
      font-size: 1.2rem;
    `}
`;
