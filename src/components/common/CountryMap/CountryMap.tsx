import React, { CSSProperties } from 'react';
import L, { LatLngExpression, Map as LeafletMapInstance, MapOptions } from 'leaflet';
import { FeatureCollection, GeoJsonObject } from 'geojson';
import { feature } from 'topojson-client';
import { GeometryCollection, Topology } from 'topojson-specification';

import worldData from 'world-atlas/countries-110m.json';

import * as S from './CountryMap.styles';

const MAP_CENTER: LatLngExpression = [57.52142204768359, 6.08795867978202];
const MAP_OPTIONS: MapOptions = {
  zoomControl: false,
  minZoom: 1,
  maxZoom: 5,
};

const topology = worldData as unknown as Topology<{ countries: GeometryCollection }>;
const countries = feature(topology, topology.objects.countries) as FeatureCollection;

const configureCountryMap = (map: LeafletMapInstance): void => {
  L.geoJSON(countries as GeoJsonObject).addTo(map);
  L.control.zoom({ position: 'bottomleft' }).addTo(map);
};

interface CountryMapProps {
  className?: string;
  style?: CSSProperties;
  onMapReady?: (map: LeafletMapInstance) => void;
}

export const CountryMap: React.FC<CountryMapProps> = ({ className, style, onMapReady }) => {
  return (
    <S.Map
      center={MAP_CENTER}
      zoom={2}
      options={MAP_OPTIONS}
      onCreate={configureCountryMap}
      onMapReady={onMapReady}
      className={className}
      style={style}
    />
  );
};
