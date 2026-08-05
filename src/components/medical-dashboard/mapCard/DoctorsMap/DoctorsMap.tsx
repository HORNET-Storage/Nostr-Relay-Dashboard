import React, { useEffect, useMemo, useState } from 'react';
import L, { IconOptions, Map as LeafletMapInstance, PointExpression } from 'leaflet';
import { createRoot, Root } from 'react-dom/client';

import { ReactComponent as MapBackgroundIcon } from 'assets/icons/map-background.svg';

import * as S from './DoctorsMap.styles';
import { useResponsive } from 'hooks/useResponsive';

import { Doctor } from 'api/doctors.api';
import { DoctorProfile } from 'components/common/DoctorProfile/DoctorProfile';

const LARGE_MARKER_SIZE: PointExpression = [50, 50];
const MARKER_SIZE: PointExpression = [30, 30];

const defineIconSize = (isDesktop: boolean): PointExpression => {
  return (isDesktop && LARGE_MARKER_SIZE) || MARKER_SIZE;
};

class MarkerDoctor extends L.Icon {
  constructor(props: IconOptions, isDesktop: boolean) {
    const iconSize = defineIconSize(isDesktop);
    super({
      popupAnchor: iconSize,
      iconSize,
      ...props,
    });
  }
}

interface DoctorsMapProps {
  doctors: Doctor[];
}

export const DoctorsMap: React.FC<DoctorsMapProps> = ({ doctors }) => {
  const { isDesktop } = useResponsive();
  const [map, setMap] = useState<LeafletMapInstance | null>(null);
  const mapDoctors = useMemo(() => doctors.filter(({ gps }) => gps), [doctors]);

  useEffect(() => {
    if (!map) return;

    const markers: L.Marker[] = [];
    const popupRoots: Root[] = [];

    mapDoctors.forEach((doctor) => {
      const popupContainer = document.createElement('div');
      const popupRoot = createRoot(popupContainer);
      popupRoot.render(
        <DoctorProfile
          avatar={doctor.imgUrl}
          name={doctor.name}
          speciality={doctor.specifity}
          rating={doctor.rating}
        />,
      );

      const marker = L.marker([doctor.gps?.latitude || 0, doctor.gps?.longitude || 0], {
        icon: new MarkerDoctor(
          {
            iconUrl: doctor.imgUrl,
            iconRetinaUrl: doctor.imgUrl,
          },
          isDesktop,
        ),
      })
        .bindPopup(popupContainer)
        .addTo(map);

      markers.push(marker);
      popupRoots.push(popupRoot);
    });

    return () => {
      popupRoots.forEach((root) => root.unmount());
      markers.forEach((marker) => marker.remove());
    };
  }, [isDesktop, map, mapDoctors]);

  return (
    <S.MapFrame>
      <S.MapDefinitions aria-hidden="true">
        <MapBackgroundIcon />
      </S.MapDefinitions>
      <S.DoctorsMap onMapReady={setMap} />
    </S.MapFrame>
  );
};
