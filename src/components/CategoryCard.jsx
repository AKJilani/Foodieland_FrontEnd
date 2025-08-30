import React from "react";

export default function CategoryCard({ id, name, icon, color = "#f8fafc" }) {
  // Use a fallback URL since import.meta.env isn't supported in all environments
  const API_BASE = "http://localhost:8000";

  // Construct full image URL
  const imageSrc = icon ? `${API_BASE}/media/${icon}` : undefined;

  // Function to convert hex to a more usable rgba for the gradient
  const hexToRgba = (hex, alpha) => {
    let r = 0, g = 0, b = 0;
    // Handle 3-digit hex
    if (hex.length === 4) {
      r = parseInt(hex[1] + hex[1], 16);
      g = parseInt(hex[2] + hex[2], 16);
      b = parseInt(hex[3] + hex[3], 16);
    } 
    // Handle 6-digit hex
    else if (hex.length === 7) {
      r = parseInt(hex.slice(1, 3), 16);
      g = parseInt(hex.slice(3, 5), 16);
      b = parseInt(hex.slice(5, 7), 16);
    }
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  // Function to adjust the opacity of a hex color
  const adjustHexOpacity = (hex, opacity) => {
    const rgba = hexToRgba(hex, opacity);
    return rgba;
  }

  // Function to add a light, subtle overlay on top of the base color
  const getGradientOverlay = (hex, isHovered) => {
    // Determine the starting color based on hover state
    const startColor = isHovered ? hex : adjustHexOpacity(hex, 0.8);

    // Return a default light color if no hex is provided or is full white
    if (!hex || hex === '#ffffffff') {
      return `linear-gradient(to top, rgba(248, 250, 252, 1) 0%, rgba(248, 250, 252, 0) 70%)`;
    }
    
    // A gradient that starts with the full hex color and fades to transparent
    const rgbaColor0 = hexToRgba(hex, 0);
    
    // The gradient will start with the adjusted color, then fade to a semi-transparent version,
    // and finally become fully transparent at the top.
    return `linear-gradient(to top, ${startColor} 0%, ${rgbaColor0} 70%)`;
  };

  const [isHovered, setIsHovered] = React.useState(false);

  const gradientOverlay = getGradientOverlay(color, isHovered);

  return (
    <a
      href={`/recipes?category=${id || ""}`}
      className="group block h-[160px] md:h-[190px] xl:h-[200px] hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer rounded-3xl overflow-hidden my-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ backgroundImage: gradientOverlay }}
    >
      {/* Category Image Container */}
      <div className="relative w-full h-32 flex items-center justify-center p-6">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={name}
            className="w-30 h-30 object-contain transition-transform duration-300 group-hover:scale-110 drop-shadow-sm"
            onError={(e) => {
              console.error(`Failed to load image: ${imageSrc}`);
              e.target.style.display = 'none';
            }}
          />
        ) : (
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-2xl">🍽️</span>
          </div>
        )}
      </div>

      {/* Text Content */}
      <div className="px-4 pb-6 text-center">
        <div className="text-base font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">
          {name}
        </div>
      </div>
    </a>
  );
}
