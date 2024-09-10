import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import styled, { css } from 'styled-components';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
export const MediaItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;
export const FileName = styled.span`
  font-size: 0.95rem;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  font-weight: 500;
`;
export const SizeData = styled.span`
  font-size: 0.75rem;
  color: var(--text-nft-light-color);
`;

export const MediaBottomPanel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
export const MediaInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const MediaThumbnail = styled.img`
 cursor: pointer;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0.5rem;
`;

export const MenuWrapper = styled(BaseCol)`
  align-items: center;
  text-align: center;
`;

export const ButtonWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  text-align: center;
  padding-left: 0.75rem;
`;

export const ThumbnailContainer = styled.div`
  position: relative;
`;

export const MediaTypeIndicator = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  padding: 0.25rem 0.5rem;
  font-size: 1rem;
  background-color: var(--ant-primary-7);
  color: var(--text-nft-light-color);
  border-radius: 0 0 0 0.25rem;
`;
export const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  background-color:  var(--primary-color);

  opacity: 0.5;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
`;

export const CheckmarkIcon = styled.div`
  font-size: 24px;
  color: white;
  padding: 5px;
  background: transparent;
`;
