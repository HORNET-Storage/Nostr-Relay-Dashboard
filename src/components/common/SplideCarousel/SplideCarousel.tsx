// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { forwardRef, PropsWithChildren } from 'react';
import { Splide, SplideProps } from '@splidejs/react-splide';
import '@splidejs/splide/dist/css/splide.min.css';
import { AutoScroll } from '@splidejs/splide-extension-auto-scroll';
interface BaseCarouselProps extends SplideProps {
  slidesToShow?: number;
  arrows?: boolean;
  dots?: boolean;
  infinite?: boolean;
  swipeSpeed?: number;
  type?: 'loop' | 'fade';
  drag?: string;
  gap?: string;
  snap?: string | boolean;
  flickPower?: string;
  breakpoints?: Record<number, Record<string, number>>;
}

export const SplideCarousel = forwardRef<Splide, PropsWithChildren<BaseCarouselProps>>(
  (
    {
      children,
      slidesToShow = 4,
      arrows = false,
      dots = false,
      infinite = true,
      type = 'loop',
      swipeSpeed = 0.6,
      ...props
    },
    ref,
  ) => {
    const options = {
      perPage: slidesToShow,
      arrows: arrows,
      pagination: dots,
      loop: infinite,
      interval: 5000,
      gap: '1rem',
      drag: 'free',
      type: type,
      autoScroll: {
        speed: swipeSpeed,
      },
      ...props,
    };

    return (
      //MUST use SlideTtrack around slides to work
      <Splide options={options} hasTrack={false} extensions={{ AutoScroll }} ref={ref}>
        {children}
      </Splide>
    );
  },
);
