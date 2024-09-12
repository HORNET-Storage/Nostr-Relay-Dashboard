import styled, { css } from 'styled-components';
import { BaseModal } from '@app/components/common/BaseModal/BaseModal';
import { SplideSlide } from '@splidejs/react-splide';
export const Modal = styled(BaseModal)<{ $is4kScreen: boolean }>`
  text-align: center;
  justify-content: center;
  ${(props) =>
    props.$is4kScreen &&
    css`
      width: 60% !important;
    `}

  .ant-modal-content {
    border-radius: 1rem;
    padding: 1rem;
  }
  .ant-modal-body {
    padding: 1.5rem;
    min-height: 30vh;
  }
`;

export const MediaWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 25vh;
  height: 100%;
  width: 100%;
`;

export const NotSupported = styled.div<{ $is4kScreen: boolean }>`
  font-size: 1rem;
  height: 100%;
  display: flex;
  justify-content: center;
  
  align-items: center;
   ${(props) =>
    props.$is4kScreen &&
    css`
    font-size: 2rem;
    `}
`;

export const Image = styled.img`
  width: 70%;
`;

export const Audio = styled.audio`
  display: flex;
  align-items: center;
  width: 75%;
`;

export const Video = styled.video`
  width: 75%;
`;

export const Slide = styled(SplideSlide)`
  padding: 3rem 1rem;
`;

export const MediaDetails = styled.div<{ $is4kScreen: boolean }>`
  display: flex;
  flex-direction: column;
  opacity: 0.7;
     ${(props) =>
    props.$is4kScreen &&
    css`
    font-size: 1.7rem;
    `}
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
`;
