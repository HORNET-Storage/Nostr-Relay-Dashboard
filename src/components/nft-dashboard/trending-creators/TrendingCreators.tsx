import React, { useEffect, useRef, useState } from 'react';
import Stories from 'react-insta-stories';
import Slider from 'react-slick';
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
  const sliderRef = useRef<Slider>(null);

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
                <S.ArrowBtn type="text" size="small" onClick={() => sliderRef.current && sliderRef.current.slickPrev()}>
                  <LeftOutlined />
                </S.ArrowBtn>
              </BaseCol>

              <BaseCol>
                <S.ArrowBtn type="text" size="small" onClick={() => sliderRef.current && sliderRef.current.slickNext()}>
                  <RightOutlined />
                </S.ArrowBtn>
              </BaseCol>
            </>
          )}
        </BaseRow>
      </NFTCardHeader>

      {stories.length > 0 && (
        <BaseCarousel
          beforeChange={() => setDragging(true)}
          afterChange={() => setDragging(false)}
          slidesToShow={7}
          ref={sliderRef}
          swipe={true}
          centerMode={false}
          speed={300}
          swipeToSlide={true}
          draggable={true}
          easing="ease-in-out"
          responsive={[
            {
              breakpoint: 1920,
              settings: {
                slidesToShow: 8,
              },
            },
            {
              breakpoint: 1870,
              settings: {
                slidesToShow: 8,
              },
            },
            {
              breakpoint: 1700,
              settings: {
                slidesToShow: 7,
              },
            },
            {
              breakpoint: 1530,
              settings: {
                slidesToShow: 7,
              },
            },
            {
              breakpoint: 1370,
              settings: {
                slidesToShow: 6,
              },
            },
            {
              breakpoint: 1279,
              settings: {
                slidesToShow: 6,
              },
            },
            {
              breakpoint: 1200,
              settings: {
                slidesToShow: 6,
              },
            },
            {
              breakpoint: 1120,
              settings: {
                slidesToShow: 6,
              },
            },
            {
              breakpoint: 1020,
              settings: {
                slidesToShow: 6,
              },
            },
            {
              breakpoint: 920,
              settings: {
                slidesToShow: 6,
              },
            },
            {
              breakpoint: 820,
              settings: {
                slidesToShow: 6,
              },
            },
            {
              breakpoint: 767,
              settings: {
                slidesToShow: 5,
              },
            },
            {
              breakpoint: 650,
              settings: {
                slidesToShow: 5,
              },
            },
            {
              breakpoint: 550,
              settings: {
                slidesToShow: 5,
              },
            },
            {
              breakpoint: 500,
              settings: {
                slidesToShow: 5,
              },
            },
            {
              breakpoint: 450,
              settings: {
                slidesToShow: 5,
              },
            },
          ]}
        >
          {profiles.images.map((img: string) => (
            <div key={img}>
              <S.CardWrapper>
                <TrendingCreatorsStory
                  onStoryOpen={() => {
                    return;
                  }}
                  img={img}
                  viewed={false}
                />
              </S.CardWrapper>
            </div>
          ))}
        </BaseCarousel>
      )}
    </>
  );
};
