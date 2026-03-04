import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import GalleryCard from "./GalleryCard";
import GallerySkeleton from "./GallerySkeleton";
import LightboxWithMotion from "./LightboxWithMotion";
import "../../styles/gallery.css";

const InfiniteGallery = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalLoaded, setTotalLoaded] = useState(0);

  // Состояния для Lightbox
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  // Загружаем фото при монтировании
  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("photos")
        .select("*")
        .order("order", { ascending: false });

      if (error) throw error;

      setPhotos(data || []);
      setTotalLoaded(data?.length || 0);
    } catch (error) {
      console.error("Ошибка загрузки фото:", error);
    } finally {
      setLoading(false);
    }
  };

  // Функции для Lightbox
  const openLightbox = (photo) => {
    const index = photos.findIndex((p) => p.id === photo.id);
    setCurrentPhotoIndex(index);
    setLightboxOpen(true);
  };

  const goToPrev = () => {
    setCurrentPhotoIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1));
  };

  const goToNext = () => {
    setCurrentPhotoIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0));
  };

  if (loading) {
    return <GallerySkeleton count={9} />;
  }

  return (
    <>
      <div className="gallery-container" id="portfolio">
        <div className="gallery-header">
          <h2>Наши работы</h2>
          <p className="gallery-subtitle">
            Каждый проект мы делаем с душой, как для себя
          </p>
          <div className="gallery-counter">Всего работ: {totalLoaded}</div>
        </div>

        {photos.length === 0 ? (
          <div className="no-photos-message">
            <p>😕 Пока нет загруженных работ</p>
          </div>
        ) : (
          <div className="gallery-grid">
            {photos.map((photo, index) => (
              <GalleryCard
                key={photo.id}
                photo={photo}
                onClick={openLightbox}
              />
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <LightboxWithMotion
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        photo={photos[currentPhotoIndex]}
        onPrev={goToPrev}
        onNext={goToNext}
        hasPrev={photos.length > 1}
        hasNext={photos.length > 1}
      />
    </>
  );
};

export default InfiniteGallery;
