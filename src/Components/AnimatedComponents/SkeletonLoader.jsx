import React from "react";

// Navbar Skeleton
export function NavbarSkeleton() {
    return (
        <header>
            <div className="fixed top-0 left-0 right-0 bg-transparent backdrop-blur-lg h-[75px] flex items-center z-50 px-10 sm:px-16">
                <nav className="flex items-center justify-between w-full">
                    {/* Brand Skeleton */}
                    <div className="h-10 w-32 bg-white/20 rounded animate-pulse" />

                    {/* Right Side Skeleton */}
                    <div className="flex items-center gap-11">
                        {/* Coins Display Skeleton */}
                        <div className="flex items-center gap-2 bg-white/10 px-4 py-1 rounded-full">
                            <div className="w-9 h-9 bg-white/20 rounded-full animate-pulse" />
                            <div className="h-5 w-16 bg-white/20 rounded animate-pulse" />
                        </div>

                        {/* Add Coins Button Skeleton */}
                        <div className="h-10 w-28 bg-white/20 rounded-3xl animate-pulse" />

                        {/* Profile/Login Skeleton */}
                        <div className="w-12 h-12 bg-white/20 rounded-full animate-pulse" />
                    </div>
                </nav>
            </div>

            {/* Crypto Filter Bar Skeleton */}
            <div className="bg-transparent py-6 px-4 overflow-x-auto scrollbar-hide pt-[90px] mx-[50px]">
                <ul className="flex gap-4 min-w-max justify-between">
                    {[...Array(9)].map((_, i) => (
                        <li key={i}>
                            <div className="px-5 py-3 rounded-full border-2 border-white/20 bg-white/10 flex items-center gap-2 animate-pulse">
                                <div className="w-6 h-6 bg-white/20 rounded-full" />
                                <div className="h-4 w-20 bg-white/20 rounded" />
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </header>
    );
}

// MainBanner Skeleton
export function MainBannerSkeleton() {
    return (
        <div className="relative flex items-center justify-center bg-transparent">
            {/* Left Arrow Skeleton */}
            <div className="absolute left-2 top-1/2 -translate-y-1/2 h-[223px] w-[150px] bg-white/5 animate-pulse z-10" />

            {/* Banner Image Skeleton */}
            <div className="w-full overflow-hidden flex justify-center">
                <div className="w-full max-w-full h-[250px] mx-[65px] my-2 rounded-2xl bg-gradient-to-r from-white/10 via-white/20 to-white/10 animate-pulse" />
            </div>

            {/* Right Arrow Skeleton */}
            <div className="absolute right-2 top-1/2 -translate-y-1/2 h-[223px] w-[150px] bg-white/5 animate-pulse z-10" />
        </div>
    );
}

// Main Content Skeleton
export function MainSkeleton() {
    return (
        <div className="relative min-h-screen pt-[75px] px-[50px] text-white overflow-hidden bg-transparent">
            <div className="flex flex-row gap-4 relative z-10">
                {/* LEFT SIDE - Questions Skeleton */}
                <div className="flex-1 min-w-[55vw] flex flex-col space-y-11">
                    {/* Title Skeleton */}
                    <div className="h-9 w-40 bg-white/20 rounded animate-pulse mb-2 sticky top-0 py-4 z-10" />

                    {/* Question Cards Skeleton */}
                    {[...Array(3)].map((_, i) => (
                        <div
                            key={i}
                            className="p-5 bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.05)] animate-pulse"
                        >
                            {/* Traders Badge */}
                            <div className="h-5 w-24 bg-white/20 rounded-full mb-2" />

                            {/* Question Text and Icon */}
                            <div className="flex flex-row justify-between mb-11">
                                <div className="py-1 flex-1 space-y-2">
                                    <div className="h-5 w-full bg-white/20 rounded" />
                                    <div className="h-5 w-3/4 bg-white/20 rounded" />
                                </div>
                                <div className="w-[60px] h-[60px] bg-white/20 rounded-full relative right-4" />
                            </div>

                            {/* Timer Skeleton */}
                            <div className="h-5 w-40 bg-yellow-300/20 rounded mb-4" />

                            {/* Buttons Skeleton */}
                            <div className="flex flex-row justify-center pt-4 gap-10">
                                <div className="h-12 w-[400px] bg-blue-500/20 rounded-md" />
                                <div className="h-12 w-[400px] bg-red-500/20 rounded-md" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* RIGHT SIDE - Portfolio Skeleton */}
                <div className="flex-1 w-1 border border-white/20 bg-black/10 backdrop-blur-xl rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.08)] h-[100vh] relative overflow-hidden p-6">
                    {/* Portfolio Title */}
                    <div className="h-8 w-48 bg-white/20 rounded animate-pulse mb-6" />

                    {/* Portfolio Items */}
                    <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <div
                                key={i}
                                className="p-4 bg-white/5 rounded-xl border border-white/10 animate-pulse"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className="h-5 w-32 bg-white/20 rounded" />
                                    <div className="h-5 w-20 bg-white/20 rounded" />
                                </div>
                                <div className="h-4 w-full bg-white/20 rounded mb-2" />
                                <div className="h-4 w-2/3 bg-white/20 rounded" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Complete Loading Component (combines all three)
export default function SkeletonLoader() {
    return (
        <div className="bg-black min-h-screen">
            <NavbarSkeleton />
            <MainBannerSkeleton />
            <MainSkeleton />
        </div>
    );
}