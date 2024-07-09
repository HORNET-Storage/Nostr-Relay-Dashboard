import React, { useEffect, useRef, useState } from 'react';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import { AutoScroll } from '@splidejs/splide-extension-auto-scroll';
import profile1 from '@app/assets/images/profile1.webp';
import profile2 from '@app/assets/images/profile2.webp';
import profile3 from '@app/assets/images/profile3.webp';
import profile4 from '@app/assets/images/profile4.webp';
import profile5 from '@app/assets/images/profile5.jpg';
import profile6 from '@app/assets/images/profile6.jpg';
import profile7 from '@app/assets/images/profile7.jpg';
import profile8 from '@app/assets/images/profile8.gif';
import profile9 from '@app/assets/images/profile9.gif';
import profile11 from '@app/assets/images/profile11.png';
import profile12 from '@app/assets/images/profile12.webp';
import profile13 from '@app/assets/images/profile13.webp';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { BaseCarousel } from '@app/components/common/BaseCarousel/Carousel';
import { NFTCardHeader } from '@app/components/nft-dashboard/common/NFTCardHeader/NFTCardHeader';
import { ViewAll } from '@app/components/nft-dashboard/common/ViewAll/ViewAll';
import { TrendingCreatorsStory } from '@app/components/nft-dashboard/trending-creators/story/TrendingCreatorsStory';
import { useResponsive } from '@app/hooks/useResponsive';
import { getTrendingCreators, TrendingCreator } from '@app/api/trendingCreators';
import * as S from './TrendingCreators.styles';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';

export const TrendingCreators: React.FC = () => {
  const [stories, setStories] = useState<TrendingCreator[]>([]);
  const [key, setKey] = useState(Math.random());
  const [dragging, setDragging] = useState(false);
  const sliderRef = useRef(null);

  const profiles = {
    images: [
      profile1,
      profile2,
      profile3,
      profile6,
      profile7,
      profile13,
      profile8,
      profile12,
      profile5,
      profile4,
      profile9,
      profile11,
    ],
  };
  const { isTablet: isTabletOrHigher } = useResponsive();
  const { t } = useTranslation();

  useEffect(() => {
    getTrendingCreators().then((res) => setStories(res));
  }, []);

  return (
    <>
      <NFTCardHeader title={t('nft.payingSubs')}>
        <BaseRow align="middle">
          <BaseCol>
            <ViewAll bordered={false} />
          </BaseCol>

          {isTabletOrHigher && (
            <>
              <BaseCol>
                <S.ArrowBtn type="text" size="small" onClick={() => {}}>
                  <LeftOutlined />
                </S.ArrowBtn>
              </BaseCol>

              <BaseCol>
                <S.ArrowBtn type="text" size="small" onClick={() => {}}>
                  <RightOutlined />
                </S.ArrowBtn>
              </BaseCol>
            </>
          )}
        </BaseRow>
      </NFTCardHeader>

      {stories.length > 0 && (
        <BaseCarousel
          ref={sliderRef}
          type="loop"
          drag="free"
          snap="false"
          autoScroll={{
            speed: 0.8,
          }}
          breakpoints={{
            1920: {
              perPage: 7,
            },

            1370: {
              perPage: 6,
            },

            820: {
              perPage: 5,
            },
            700: {
              perPage: 4,
            },
          }}
        >
          {profiles.images.map((img: string) => (
            <S.CardWrapper key={img}>
              <TrendingCreatorsStory
                onStoryOpen={() => {
                  return;
                }}
                img={img}
                viewed={false}
              />
            </S.CardWrapper>
          ))}
        </BaseCarousel>
      )}
    </>
  );
};
