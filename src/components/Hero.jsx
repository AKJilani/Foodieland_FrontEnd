import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BsArrowRight, BsArrowLeft } from 'react-icons/bs';

export default function Hero({ featuredRecipes = [] }) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    useEffect(() => {
        if (!isAutoPlaying) return;
        
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % featuredRecipes.length);
        }, 5000);
        
        return () => clearInterval(timer);
    }, [isAutoPlaying, featuredRecipes.length]);

    const navigateSlide = (direction) => {
        setIsAutoPlaying(false);
        setCurrentSlide((prev) => {
            if (direction === 'next') {
                return (prev + 1) % featuredRecipes.length;
            } else {
                return prev === 0 ? featuredRecipes.length - 1 : prev - 1;
            }
        });
    };

    if (!featuredRecipes.length) {
        return (
            <section className="bg-gradient-to-b from-gray-50 to-white">
                <div className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-10 items-center">
                    <div>
                        <div className="inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full border bg-white">
                            🍳 Your cooking community
                        </div>
                        <h1 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
                            Discover delicious recipes
                        </h1>
                        <p className="mt-4 text-gray-600">
                            Explore community-made recipes and blogs from passionate cooks around the world.
                        </p>
                        <div className="mt-6 flex gap-3">
                            <Link to="/recipes" className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-full hover:bg-primary-dark transition">
                                Browse Recipes
                            </Link>
                            <Link to="/blogs" className="inline-flex items-center px-6 py-3 border rounded-full hover:bg-gray-50 transition">
                                Read Blogs
                            </Link>
                        </div>
                    </div>
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative h-72 md:h-[22rem]"
                    >
                        <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-xl border bg-gray-100">
                            <img 
                                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop" 
                                alt="Food" 
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="absolute -z-10 -bottom-6 -right-6 h-32 w-32 rounded-2xl bg-gray-200" />
                    </motion.div>
                </div>
            </section>
        );
    }

    return (
        <section className="relative h-[600px] overflow-hidden bg-gray-900">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0"
                >
                    <div className="relative h-full">
                        {/* Background Image */}
                        <div className="absolute inset-0">
                            <img
                                src={featuredRecipes[currentSlide].image}
                                alt={featuredRecipes[currentSlide].title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-50" />
                        </div>

                        {/* Content */}
                        <div className="relative h-full container mx-auto px-4 flex items-center">
                            <div className="max-w-2xl text-white">
                                <motion.span
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.1 }}
                                    className="inline-block px-4 py-1 rounded-full bg-white/20 text-sm mb-4"
                                >
                                    Featured Recipe
                                </motion.span>
                                <motion.h1
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="text-4xl md:text-6xl font-bold mb-6"
                                >
                                    {featuredRecipes[currentSlide].title}
                                </motion.h1>
                                <motion.p
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-lg md:text-xl mb-8 text-gray-200"
                                >
                                    {featuredRecipes[currentSlide].description}
                                </motion.p>
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                    className="flex gap-4"
                                >
                                    <Link
                                        to={`/recipes/${featuredRecipes[currentSlide].id}`}
                                        className="px-6 py-3 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors flex items-center gap-2"
                                    >
                                        View Recipe <BsArrowRight />
                                    </Link>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <div className="absolute bottom-1/2 left-4 right-4 flex justify-between transform translate-y-1/2">
                <button
                    onClick={() => navigateSlide('prev')}
                    className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                >
                    <BsArrowLeft className="text-white text-2xl" />
                </button>
                <button
                    onClick={() => navigateSlide('next')}
                    className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                >
                    <BsArrowRight className="text-white text-2xl" />
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
                        className={`h-2 rounded-full transition-all ${
                            currentSlide === index ? 'w-8 bg-primary' : 'w-2 bg-white/50'
                        }`}
                    />
                ))}
            </div>
        </section>
    );
}



