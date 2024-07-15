import React, { useEffect, useRef, useState } from 'react';
import { Splide, SplideSlide, SplideTrack } from '@splidejs/react-splide';
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
import { NFTCardHeader } from '@app/components/nft-dashboard/common/NFTCardHeader/NFTCardHeader';
import { ViewAll } from '@app/components/nft-dashboard/common/ViewAll/ViewAll';
import { TrendingCreatorsStory } from '@app/components/nft-dashboard/trending-creators/story/TrendingCreatorsStory';
import { getTrendingCreators, TrendingCreator } from '@app/api/trendingCreators';
import * as S from './TrendingCreators.styles';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { SplideCarousel } from '@app/components/common/SplideCarousel/SplideCarousel';
import { useResponsive } from '@app/hooks/useResponsive';

export const TrendingCreators: React.FC = () => {
  const [stories, setStories] = useState<TrendingCreator[]>([]);
  const sliderRef = useRef<Splide>(null);

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
  const { isTablet: isTabletOrHigher, isDesktop } = useResponsive();
  const { t } = useTranslation();

  const goPrev = () => {
    if (sliderRef.current && sliderRef.current.splide) {
      sliderRef.current.splide.go('-1');
    }
  };

  // Function to navigate to the next slide
  const goNext = () => {
    if (sliderRef.current && sliderRef.current.splide) {
      sliderRef.current.splide.go('+1');
    }
  };

  useEffect(() => {
    getTrendingCreators().then((res) => setStories(res));
  }, []);

  return (
    <>
      <SplideCarousel
        ref={sliderRef}
        type="loop"
        drag="free"
        gap=".2rem"
        snap="false"
        autoSpeed={isDesktop ? 0.7 : 0.8}
        flickPower="500"
        breakpoints={{
          8000: {
            perPage: 8, // Large desktops and above
          },
          1600: {
            perPage: 8, // Smaller desktops
          },
          850: {
            perPage: 7,
          },
          768: {
            perPage: 4, // All mobile devices
          },
        }}
      >
        <NFTCardHeader title={t('nft.paidSubs')}>
          <BaseRow align="middle">
            <BaseCol>
              <ViewAll bordered={false} />
            </BaseCol>

            {isTabletOrHigher && (
              <>
                <BaseCol>
                  <S.ArrowBtn
                    type="text"
                    size="small"
                    onClick={() => {
                      goPrev();
                    }}
                  >
                    <LeftOutlined />
                  </S.ArrowBtn>
                </BaseCol>

                <BaseCol>
                  <S.ArrowBtn
                    type="text"
                    size="small"
                    onClick={() => {
                      goNext();
                    }}
                  >
                    <RightOutlined />
                  </S.ArrowBtn>
                </BaseCol>
              </>
            )}
          </BaseRow>
        </NFTCardHeader>
        <SplideTrack>
          {stories.length > 0 && (
            <>
              {profiles.images.map((img: string) => (
                <SplideSlide key={img}>
                  <S.CardWrapper>
                    <TrendingCreatorsStory
                      onStoryOpen={() => {
                        return;
                      }}
                      img={img}
                      viewed={false}
                    />
                  </S.CardWrapper>
                </SplideSlide>
              ))}
            </>
          )}
        </SplideTrack>
      </SplideCarousel>
    </>
  );
};
