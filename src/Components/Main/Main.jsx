import React, { useState, useEffect, useRef } from "react";
import BitcoinBanner from "../../assets/BitcoinBanner.svg";
import EthereumBanner from "../../assets/EthereumBanner.svg";
import SolanaBanner from "../../assets/SolanaBanner.svg";
import DogecoinBanner from "../../assets/DogecoinBanner.svg";
import CardanoBanner from "../../assets/CardanoBanner.svg";
import BinanceBanner from "../../assets/BinanceBanner.svg";
import PolygonBanner from "../../assets/PolygonBanner.svg";
import RippleBanner from "../../assets/RippleBanner.svg";

export default function Main() {
  // Original images
  const originalImages = [
    BitcoinBanner,
    EthereumBanner,
    SolanaBanner,
    DogecoinBanner,
    CardanoBanner,
    BinanceBanner,
    PolygonBanner,
    RippleBanner,
  ];

  // Add cloned first and last image for looping
  const images = [
    originalImages[originalImages.length - 1], // clone last
    ...originalImages,
    originalImages[0], // clone first
  ];

  const [index, setIndex] = useState(1); // Start at first real image
  const [isAnimating, setIsAnimating] = useState(true); // Controls smooth animation
  const intervalRef = useRef(null);

  // Start auto-scroll
  const startAutoScroll = () => {
    intervalRef.current = setInterval(nextImage, 5000);
  };

  // Reset auto-scroll after user interaction
  const resetAutoScroll = () => {
    clearInterval(intervalRef.current);
    startAutoScroll();
  };

  // Go to next image
  const nextImage = () => {
    setIndex((prev) => prev + 1);
    setIsAnimating(true);
  };

  // Go to previous image
  const prevImage = () => {
    setIndex((prev) => prev - 1);
    setIsAnimating(true);
  };

  // Auto-scroll on mount
  useEffect(() => {
    startAutoScroll();
    return () => clearInterval(intervalRef.current);
  }, []);

  // Infinite loop logic
  useEffect(() => {
    if (index === images.length - 1) {
      setTimeout(() => {
        setIsAnimating(false);
        setIndex(1);

      }, 1000);
    }
    if (index === 0) {
      setTimeout(() => {
        setIsAnimating(false);
        setIndex(images.length - 2);
      }, 1000);
    }
  }, [index, images.length]);

  return (
    <div className="flex items-center justify-center bg-gray-100 relative">
      {/* Left Arrow */}
      <button
        onClick={() => {
          prevImage();
          resetAutoScroll();
        }}
        className="p-2 bg-white shadow rounded-full mr-4 z-10"
      >
        &#8592;
      </button>

      {/* Image container */}
      <div className="w-full overflow-hidden flex justify-center">
        <div
          className={`flex ${isAnimating ? "transition-transform duration-1000 ease-in-out" : ""}`}
          style={{
            transform: `translateX(-${index * 100}%)`,
            width: `${images.length * 100}%`,
          }}
          onTransitionEnd={() => {
            if (!isAnimating) {
              setIsAnimating(true);
            }
          }}
        >
          {images.map((img, i) => (
            <div key={i} className="w-full flex-shrink-0 flex justify-center">
              <img
                src={img}
                alt={`banner-${i}`}
                className="w-full max-w-full h-[223px] rounded-lg"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Right Arrow */}
      <button
        onClick={() => {
          nextImage();
          resetAutoScroll();
        }}
        className="p-2 bg-white shadow rounded-full ml-4 z-10"
      >
        &#8594;
      </button>
    </div>
  );
}
