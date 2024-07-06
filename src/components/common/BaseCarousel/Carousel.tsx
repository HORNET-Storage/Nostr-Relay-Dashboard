// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Slider, { Settings } from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export const BaseCarousel = React.forwardRef<Slider, Settings>(
  ({ slidesToShow = 1, arrows = false, dots = false, infinite = true, centerMode = true, children, ...props }, ref) => {
    const carouselRef = useRef();
    const [scrolling, setScrolling] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const totalRef = ref || carouselRef;

    const handleMouseDown = useCallback(
      (event) => {
        setScrolling(true);
        setStartX(event.pageX - totalRef.current.innerSlider.list.offsetLeft);
        setScrollLeft(totalRef.current.innerSlider.list.scrollLeft);
      },
      [totalRef],
    );

    const handleMouseLeave = useCallback(() => {
      setScrolling(false);
    }, []);

    const handleMouseUp = useCallback(() => {
      setScrolling(false);
    }, []);

    const handleMouseMove = useCallback(
      (event) => {
        if (!scrolling) return;
        event.preventDefault();
        const x = event.pageX - totalRef.current.innerSlider.list.offsetLeft;
        const walk = (x - startX) * 2; // Scroll-fast
        totalRef.current.innerSlider.list.scrollLeft = scrollLeft - walk;
      },
      [scrolling, startX, scrollLeft, totalRef],
    );

    useEffect(() => {
      if (totalRef.current) {
        const slickList = totalRef.current.innerSlider.list;

        slickList.addEventListener('mousedown', handleMouseDown);
        slickList.addEventListener('mouseleave', handleMouseLeave);
        slickList.addEventListener('mouseup', handleMouseUp);
        slickList.addEventListener('mousemove', handleMouseMove);

        return () => {
          slickList.removeEventListener('mousedown', handleMouseDown);
          slickList.removeEventListener('mouseleave', handleMouseLeave);
          slickList.removeEventListener('mouseup', handleMouseUp);
          slickList.removeEventListener('mousemove', handleMouseMove);
        };
      }
    }, [totalRef, handleMouseDown, handleMouseLeave, handleMouseUp, handleMouseMove]);

    return (
      <Slider
        ref={totalRef}
        slidesToShow={slidesToShow}
        arrows={arrows}
        dots={dots}
        infinite={infinite}
        centerMode={centerMode}
        {...props}
      >
        {children}
      </Slider>
    );
  },
);
