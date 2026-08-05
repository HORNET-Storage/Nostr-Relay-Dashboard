import styled from 'styled-components';
import { LeafletMap } from '../LeafletMap/LeafletMap';

export const Map = styled(LeafletMap)`
  height: 100%;

  & .leaflet-bottom.leaflet-right {
    display: none;
  }
`;
