import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BsClock, BsHeart, BsHeartFill } from 'react-icons/bs';
import { useState } from 'react';

export default function RecipeCard({ id, title, image, author_name, average_rating, prepTime, category }) {
    const [isLiked, setIsLiked] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            className="relative group"
        >
            <Link to={`/recipes/${id}`} className="block overflow-hidden bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
                <div className="relative w-80 h-40 bg-gray-100 overflow-hidden rounded-t-2xl">
                    {image ? (
                        <motion.img 
                            src={image} 
                            alt={title}
                            className="w-80 h-40 object-cover"
                            animate={{ scale: isHovered ? 1.05 : 1 }}
                            transition={{ duration: 0.3 }}
                        />
                    ) : (
                        <div className="w-full h-full bg-gray-200" />
                    )}
                    {/* Category Tag */}
                    <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 text-sm font-medium bg-white/90 text-primary rounded-full">
                            {category}
                        </span>
                    </div>
                </div>
                
                <div className="p-4">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 line-clamp-1 mb-1">
                                {title}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                    <BsClock className="text-primary" />
                                    <span>{prepTime || '30 min'}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    ⭐ {Number(average_rating || 0).toFixed(1)}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <img 
                                src={`https://api.dicebear.com/7.x/initials/svg?seed=${author_name}`}
                                alt={author_name}
                                className="w-6 h-6 rounded-full"
                            />
                            <span className="text-sm text-gray-600">by {author_name || 'Unknown'}</span>
                        </div>
                    </div>
                </div>
            </Link>
            
            {/* Like Button */}
            <button
                onClick={(e) => {
                    e.preventDefault();
                    setIsLiked(!isLiked);
                }}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/90 hover:bg-white transition-colors duration-200"
            >
                {isLiked ? (
                    <BsHeartFill className="text-red-500 text-lg" />
                ) : (
                    <BsHeart className="text-gray-600 text-lg" />
                )}
            </button>
        </motion.div>
    );
}


