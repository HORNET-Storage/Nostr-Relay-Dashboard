import styled, { css } from 'styled-components';

interface OverlayProps {
  show: boolean;
}

export const Overlay = styled.div<OverlayProps>`
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none; // Ensure it does not interfere with other elements when not visible

  ${(props) =>
    props.show &&
    css`
      z-index: 101;
      backdrop-filter: blur(6px);
      pointer-events: auto; // Enable interaction when visible
    `}
`;
