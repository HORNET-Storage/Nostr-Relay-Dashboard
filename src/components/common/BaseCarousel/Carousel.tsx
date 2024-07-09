// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { useRef, useState, useEffect } from 'react';
import { Splide, SplideSlide, SplideTrack } from '@splidejs/react-splide';
import '@splidejs/splide/dist/css/splide.min.css';
import { AutoScroll } from '@splidejs/splide-extension-auto-scroll';

export const BaseCarousel = React.forwardRef(
  (
    {
      slidesToShow = 4,
      arrows = false,
      dots = false,
      infinite = true,
      type = 'loop',
      children,
      swipeSpeed = 0.5, // Adjust swipe speed (higher value is faster)
      ...props // Collecting all other props dynamically
    },
    ref,
  ) => {
    const [isAutoScrolling, setAutoScrolling] = useState(true); // State to manage auto scroll

    const [autoScrollPaused, setAutoScrollPaused] = useState(false);
    const [autoScrollTimeout, setAutoScrollTimeout] = useState(null);

    // Function to toggle auto scroll on and off
    const toggleAutoScroll = () => {
      if (ref.current) {
        ref.current.toggleAutoScroll(); // Toggle auto scroll
        if (!autoScrollPaused) {
          setAutoScrollPaused(true); // Set autoScrollPaused to true
          clearTimeout(autoScrollTimeout); // Clear any existing timeout
        }
      }
    };

    // Function to resume auto scroll after timeout
    const resumeAutoScroll = () => {
      if (ref.current && autoScrollPaused) {
        ref.current.toggleAutoScroll(); // Toggle auto scroll back on
        setAutoScrollPaused(false); // Set autoScrollPaused to false
      }
    };

    // Function to handle user interaction (pause auto scroll and set timeout to resume after 10s)
    const handleInteraction = () => {
      toggleAutoScroll(); // Pause auto scroll
      if (autoScrollTimeout) {
        clearTimeout(autoScrollTimeout); // Clear existing timeout
      }
      // Set new timeout to resume auto scroll after 10 seconds
      setAutoScrollTimeout(
        setTimeout(() => {
          resumeAutoScroll(); // Resume auto scroll
        }, 10000), // 10 seconds timeout
      );
    };

    // Cleanup effect to clear timeout on unmount or re-render
    useEffect(() => {
      return () => {
        if (autoScrollTimeout) {
          clearTimeout(autoScrollTimeout); // Clear timeout on cleanup
        }
      };
    }, []);

    // Reference to the Splide instance
    const splideRef = useRef(null);

    // Configure options for Splide carousel
    const options = {
      perPage: slidesToShow, // Number of slides to show at once
      arrows: arrows, // Show navigation arrows
      pagination: dots, // Show pagination dots
      loop: infinite, // Enable infinite loop
      gap: '1rem', // Space between slides
      drag: 'free', // Default drag behavior
      type: type, // Carousel type
      autoScroll: {
        speed: swipeSpeed, // Adjust swipe speed
      },
      ...props, // Merge all other props
    };

    return (
      <Splide
        hasTrack={false}
        options={options}
        extensions={{ AutoScroll }}
        ref={splideRef}
        onMouseEnter={handleInteraction}
        onTouchStart={handleInteraction}
      >
        {/* Render each child slide */}
        <SplideTrack>
          {React.Children.map(children, (child, index) => (
            <SplideSlide key={index}>{child}</SplideSlide>
          ))}
        </SplideTrack>
      </Splide>
    );
  },
);
