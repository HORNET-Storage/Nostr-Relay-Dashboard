// References.styles.ts
import styled from 'styled-components';
import { media } from '@app/styles/themes/constants';

export const ReferencesWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center; /* Center the content */
  justify-content: center; /* Center the content */
  flex-wrap: nowrap;
  margin-top: 2rem;

  @media only screen and ${media.sm} {
    align-items: center;
  }

  @media only screen and ${media.xl} {
    flex-direction: row;
    justify-content: space-between;
  }
`;

export const Text = styled.span`
  display: flex;
  align-items: center;
  justify-content: center; /* Center the text */
  white-space: pre-wrap;
  flex-wrap: wrap;
  margin-bottom: 1rem;
  font-size: 1.2rem; /* Increase font size */
  font-family: 'Arial', sans-serif; /* Change font family */
  font-weight: bold; /* Make the font bold */
  text-align: center; /* Ensure text is centered */

  @media only screen and ${media.xl} {
    margin-bottom: 0;
  }
`;

export const Icons = styled.div`
  margin-left: -0.5rem;
  margin-right: -0.5rem;
  display: flex;
  flex-wrap: nowrap;

  svg {
    font-size: 2rem;
    margin-left: 0.5rem;
    margin-right: 0.5rem;
  }
`;
