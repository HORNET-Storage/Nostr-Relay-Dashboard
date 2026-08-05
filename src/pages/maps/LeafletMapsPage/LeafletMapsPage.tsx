import React from 'react';

import { useTranslation } from 'react-i18next';

import L, { LatLngExpression, Map as LeafletMapInstance, MapOptions } from 'leaflet';

import { LeafletMap } from '@app/components/common/LeafletMap/LeafletMap';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import * as S from '@app/pages/maps/maps.styles';

const MAP_CENTER: LatLngExpression = [59.333772, 18.0644457];
const MAP_OPTIONS: MapOptions = {
  zoomControl: false,
  minZoom: 1,
  maxZoom: 10,
};

const addOpenStreetMapTiles = (map: LeafletMapInstance): void => {
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);
};

const LeafletMaps: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageTitle>{t('common.leafletMap')}</PageTitle>
      <S.MapsCard title={t('common.leafletMap')}>
        <LeafletMap
          center={MAP_CENTER}
          zoom={6}
          options={MAP_OPTIONS}
          onCreate={addOpenStreetMapTiles}
          style={{ height: '100%' }}
        />
      </S.MapsCard>
    </>
  );
};

export default LeafletMaps;
