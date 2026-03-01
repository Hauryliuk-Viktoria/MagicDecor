import React, { forwardRef } from "react";

const GalleryCard = forwardRef(({ photo, onClick }, ref) => {
  return (
    <div
      className="gallery-card"
      ref={ref}
      onClick={() => onClick(photo)} // Здесь вызываем функцию с фото
    >
      <div className="gallery-card-image">
        <img src={photo.url} alt={photo.title} loading="lazy" />
        <div className="gallery-card-overlay">
          <span className="category-tag">{photo.category}</span>
          <h3>{photo.title}</h3>
          <span className="view-hint">Нажмите для просмотра</span>
        </div>
      </div>
    </div>
  );
});
GalleryCard.displayName = "GalleryCard";

export default GalleryCard;
