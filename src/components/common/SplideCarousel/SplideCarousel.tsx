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
  autoSpeed?: number;
  infinite?: boolean;
  swipeSpeed?: number;
  type?: 'loop' | 'fade';
  drag?: boolean | 'free';
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
      swipeSpeed = 0.8,
      autoSpeed = 0.6,
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
      flickMaxPages: 1.5,
      gap: '1rem',
      drag: 'free',
      type: type,
      ...props,
    };

    // Only add autoScroll if explicitly enabled and not false
    if (props.autoScroll !== false && autoSpeed) {
      options.autoScroll = {
        speed: autoSpeed,
      };
    }

    // Only add AutoScroll extension if autoScroll is not explicitly disabled
    const extensions = props.autoScroll !== false ? { AutoScroll } : {};

    return (
      //MUST use SlideTtrack around slides to work
      <Splide options={options} hasTrack={false} extensions={extensions} ref={ref}>
        {children}
      </Splide>
    );
  },
);
