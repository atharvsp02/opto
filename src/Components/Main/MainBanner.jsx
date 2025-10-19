import React, { useState, useEffect, useRef } from "react";
import BitcoinBanner from "../../assets/BitcoinBanner.svg";
import EthereumBanner from "../../assets/EthereumBanner.svg";
import SolanaBanner from "../../assets/SolanaBanner.svg";
import DogecoinBanner from "../../assets/DogecoinBanner.svg";
import CardanoBanner from "../../assets/CardanoBanner.svg";
import BinanceBanner from "../../assets/BinanceBanner.svg";
import PolygonBanner from "../../assets/PolygonBanner.svg";
import RippleBanner from "../../assets/RippleBanner.svg";
import { motion } from "framer-motion";

export default function MainBanner() {
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

    const images = [
        originalImages[originalImages.length - 1], 
        ...originalImages,
        originalImages[0], 
    ];

    const [index, setIndex] = useState(1); 
    const [isAnimating, setIsAnimating] = useState(true); 
    const intervalRef = useRef(null);

    const startAutoScroll = () => {
        intervalRef.current = setInterval(nextImage, 5000);
    };

    const resetAutoScroll = () => {
        clearInterval(intervalRef.current);
        startAutoScroll();
    };

    const nextImage = () => {
        setIndex((prev) => prev + 1);
        setIsAnimating(true);
    };

    const prevImage = () => {
        setIndex((prev) => prev - 1);
        setIsAnimating(true);
    };

    useEffect(() => {
        startAutoScroll();
        return () => clearInterval(intervalRef.current);
    }, []);

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

        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative flex items-center justify-center bg-transparent px-2 sm:px-4 lg:px-0"
        >

            <button
                onClick={() => {
                    prevImage();
                    resetAutoScroll();
                }}
                className="absolute left-0 sm:left-2 top-1/2 -translate-y-1/2 p-1 sm:p-2 bg-white/100 shadow z-10 hover:bg-white opacity-0 h-[120px] w-[40px] sm:h-[180px] sm:w-[100px] lg:h-[223px] lg:w-[150px] text-lg sm:text-2xl"
            >
                &#8592;
            </button>

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
                        <div key={i} className="w-full flex-shrink-0 flex justify-center px-2 sm:px-8 lg:px-[65px]">
                            <img
                                src={img}
                                alt={`banner-${i}`}
                                className="w-full h-[140px] sm:h-[200px] lg:h-[250px] my-2 rounded-lg sm:rounded-xl lg:rounded-2xl object-contain"
                            />
                        </div>
                    ))}
                </div>
            </div>

            <button
                onClick={() => {
                    nextImage();
                    resetAutoScroll();
                }}
                className="absolute right-0 sm:right-2 top-1/2 -translate-y-1/2 p-1 sm:p-2 bg-white/100 shadow z-10 hover:bg-white opacity-0 h-[120px] w-[40px] sm:h-[180px] sm:w-[100px] lg:h-[223px] lg:w-[150px] text-lg sm:text-2xl"
            >
                &#8594;
            </button>

        </motion.div>
    );

}