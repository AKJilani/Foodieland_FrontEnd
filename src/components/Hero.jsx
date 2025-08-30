import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BsArrowRight, BsArrowLeft } from 'react-icons/bs';
import { LuClock, LuChefHat } from 'react-icons/lu';
import { FaUserCircle } from "react-icons/fa";

export default function Hero({ featuredRecipes = [] }) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    useEffect(() => {
        if (!isAutoPlaying || featuredRecipes.length === 0) return;
        const timer = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % featuredRecipes.length);
        }, 5000); // 10-second interval
        return () => clearInterval(timer);
    }, [isAutoPlaying, featuredRecipes.length]);

    const navigateSlide = (direction) => {
        setIsAutoPlaying(false);
        setCurrentSlide(prev => {
            if (direction === 'next') return (prev + 1) % featuredRecipes.length;
            return prev === 0 ? featuredRecipes.length - 1 : prev - 1;
        });
    };

    if (!featuredRecipes.length) return null; // Nothing to display

    const currentRecipe = featuredRecipes[currentSlide];

    return (
        <section className="relative w-full h-[600px] overflow-hidden">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0"
                >
                    <div className="relative w-full h-full">
                        {/* Background Image */}
                        <img
                            src={currentRecipe.image}
                            alt={currentRecipe.title}
                            className="w-full h-full object-cover"
                            onError={(e) => e.target.src = "https://placehold.co/1200x600/a3a3a3/ffffff?text=Image+Not+Found"}
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-50" />

                        {/* Content */}
                        <div className="absolute inset-0 flex items-center justify-center p-4 w-[95%] h-[90%]">
                            <div className="relative w-full max-w-7xl h-[99%] bg-gradient-to-br from-[#e7fafe] to-white backdrop-blur-lg rounded-3xl p-6 md:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between">
                                {/* Left side */}
                                <div className="md:w-1/2 text-gray-900 pr-0 md:pr-12">
                                    <div className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800/70 text-gray-100 font-semibold shadow-md border border-gray-700/50 hover:bg-gray-700/80 transition-all duration-300">
                                        <LuChefHat className="w-5 h-5 md:w-6 md:h-6 text-gray-100" />
                                        {currentRecipe.tag || "Recipe"}
                                    </div>
                                    <h1 className="text-4xl md:text-4xl font-bold mb-4 leading-tight">
                                        {currentRecipe.title}
                                    </h1>
                                    {/* Description with word limit */}
                                    <p className="text-sm md:text-base mb-6">
                                        {(() => {
                                            const words = currentRecipe.description?.split(' ') ?? [];
                                            const limit = 10;
                                            if (words.length > limit) {
                                                return (
                                                    <>
                                                        {words.slice(0, limit).join(' ')}...
                                                        <Link
                                                            to={`/recipes/${currentRecipe.id}`}
                                                            className="text-primary ml-1 font-semibold hover:underline"
                                                        >
                                                            Read more
                                                        </Link>
                                                    </>
                                                );
                                            } else {
                                                return currentRecipe.description || "No description available.";
                                            }
                                        })()}
                                    </p>
                                    <div className="flex gap-4 items-center mb-6">
                                        <span className="inline-flex items-center px-4 py-2 bg-gray-800/70 text-gray-100 rounded-full text-sm font-medium border border-gray-700/10 shadow-lg">
                                            <LuClock className="text-gray-100 mr-1" />
                                            {currentRecipe.prep_time || "30 minutes"}
                                        </span>
                                        <span className="inline-flex items-center px-4 py-2 bg-gray-800/70 text-gray-100 rounded-full text-sm font-medium border border-gray-700/50 shadow-sm">
                                            {currentRecipe.category || "Unknown Category"}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <FaUserCircle className="w-10 h-10 text-gray-500" />
                                            <div>
                                                <p className="font-semibold text-sm">{currentRecipe.author_name || "Unknown Author"}</p>
                                                <p className="text-gray-500 text-xs">
                                                    {currentRecipe.created_at ? new Date(currentRecipe.created_at).toLocaleDateString() : ""}
                                                </p>
                                            </div>
                                        </div>
                                        <Link
                                            to={`/recipes/${currentRecipe.id}`}
                                            className="group px-6 py-3 bg-black text-white rounded-full flex items-center gap-2 font-medium
                                                        transition-all duration-300 hover:bg-gray-800 hover:scale-105 hover:shadow-lg"
                                        >
                                            View Recipe
                                            <BsArrowRight className="text-lg transition-transform duration-300 group-hover:translate-x-1" />
                                        </Link>
                                    </div>
                                </div>

                                {/* Right side image */}
                                <div className="relative md:w-1/2 h-full hidden md:block mt-6 md:mt-0">
                                    <img
                                        src={currentRecipe.image}
                                        alt={currentRecipe.title}
                                        className="w-full h-full object-cover rounded-3xl"
                                        onError={(e) => e.target.src = "https://placehold.co/1200x600/a3a3a3/ffffff?text=Image+Not+Found"}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <div className="absolute bottom-1/2 left-4 right-4 flex justify-between transform translate-y-1/2">
                <button
                    onClick={() => navigateSlide('prev')}
                    className="text-white text-7xl md:text-8xl font-light transition-transform duration-300 hover:scale-125"
                >
                    {"<"}
                </button>
                <button
                    onClick={() => navigateSlide('next')}
                    className="text-white text-7xl md:text-8xl font-light transition-transform duration-300 hover:scale-125"
                >
                    {">"}
                </button>
            </div>
            {/* Slide Indicators */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {featuredRecipes.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => {
                            setIsAutoPlaying(false);
                            setCurrentSlide(index);
                        }}
                        className={`h-2 rounded-full transition-all ${currentSlide === index ? 'w-8 bg-primary' : 'w-2 bg-white/50'}`}
                    />
                ))}
            </div>
        </section>
    );
}