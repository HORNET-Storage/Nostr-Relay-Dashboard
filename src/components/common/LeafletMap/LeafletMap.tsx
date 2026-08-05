import React, { CSSProperties, useEffect, useRef } from 'react';
import L, { LatLngExpression, Map as LeafletMapInstance, MapOptions } from 'leaflet';

import 'leaflet/dist/leaflet.css';

export interface LeafletMapProps {
  center: LatLngExpression;
  zoom: number;
  options?: MapOptions;
  className?: string;
  style?: CSSProperties;
  onCreate?: (map: LeafletMapInstance) => void;
  onMapReady?: (map: LeafletMapInstance) => void;
}

export const LeafletMap: React.FC<LeafletMapProps> = ({
  center,
  zoom,
  options,
  className,
  style,
  onCreate,
  onMapReady,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const map = L.map(containerRef.current, options).setView(center, zoom);
    onCreate?.(map);
    onMapReady?.(map);

    return () => {
      map.remove();
    };
  }, [center, onCreate, onMapReady, options, zoom]);

  return <div ref={containerRef} className={className} style={style} />;
};
