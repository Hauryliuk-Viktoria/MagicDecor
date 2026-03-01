import React from "react";

const GallerySkeleton = ({ count = 6 }) => {
  return (
    <div className="gallery-skeleton-grid">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="skeleton-card">
          <div className="skeleton-image"></div>
          <div className="skeleton-content">
            <div className="skeleton-category"></div>
            <div className="skeleton-title"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GallerySkeleton;
