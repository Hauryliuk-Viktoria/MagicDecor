import React, { useState, useEffect } from "react";
import { fetchPhotos, getTotalPhotosCount } from "../../utils/api";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import GalleryCard from "./GalleryCard";
import GallerySkeleton from "./GallerySkeleton";
import LightboxWithMotion from "./LightboxWithMotion";
import "../../styles/gallery.css";

const InfiniteGallery = () => {
  const [photos, setPhotos] = useState([]);
  const [page, setPage] = useState(1);
  const [initialLoading, setInitialLoading] = useState(true);
  const [totalLoaded, setTotalLoaded] = useState(0);
  const [countUpdated, setCountUpdated] = useState(false);

  // Настройки загрузки
  const PHOTOS_PER_PAGE = 9; // Сколько фото загружать за раз
  const AUTO_LOAD_LIMIT = 30; // Сколько фото грузить автоматически
  const TOTAL_PHOTOS = getTotalPhotosCount();

  // Состояние для отслеживания режима загрузки
  const [autoLoadComplete, setAutoLoadComplete] = useState(false);

  const loadMore = async () => {
    // Проверяем, не загрузили ли мы уже все фото
    if (totalLoaded >= TOTAL_PHOTOS) {
      setHasMore(false);
      return;
    }

    const newPhotos = await fetchPhotos(page + 1, PHOTOS_PER_PAGE);
    const remainingSlots = TOTAL_PHOTOS - totalLoaded;
    const photosToAdd = newPhotos.slice(0, remainingSlots);

    if (photosToAdd.length > 0) {
      setPhotos((prev) => [...prev, ...photosToAdd]);
      setPage((prev) => prev + 1);

      // Обновляем счетчик с анимацией
      setTotalLoaded((prev) => {
        const newValue = prev + photosToAdd.length;
        setCountUpdated(true);
        setTimeout(() => setCountUpdated(false), 300);
        return newValue;
      });

      // Проверяем, достигли ли лимита авто-загрузки
      const newTotal = totalLoaded + photosToAdd.length;
      if (newTotal >= AUTO_LOAD_LIMIT) {
        setAutoLoadComplete(true);
      }

      // Проверяем, всё ли загрузили
      if (newTotal >= TOTAL_PHOTOS) {
        setHasMore(false);
      }
    } else {
      setHasMore(false);
    }
  };

  // Функция для ручной загрузки (по кнопке)
  const handleManualLoad = async () => {
    if (loading) return;

    // Сбрасываем флаг авто-загрузки, чтобы можно было загружать дальше
    setAutoLoadComplete(false);
    // Загружаем следующую порцию
    await loadMore();
  };

  const { lastElementRef, loading, hasMore, setHasMore } = useInfiniteScroll(
    loadMore,
    {
      enabled: !autoLoadComplete && totalLoaded < AUTO_LOAD_LIMIT, // Авто-загрузка только до лимита
    },
  );

  useEffect(() => {
    const loadInitial = async () => {
      setInitialLoading(true);
      const initialPhotos = await fetchPhotos(1, PHOTOS_PER_PAGE);
      setPhotos(initialPhotos);
      setTotalLoaded(initialPhotos.length);
      setInitialLoading(false);

      // Проверяем, достигли ли лимита с первой загрузкой
      if (initialPhotos.length >= AUTO_LOAD_LIMIT) {
        setAutoLoadComplete(true);
      }

      if (
        initialPhotos.length < PHOTOS_PER_PAGE ||
        initialPhotos.length >= TOTAL_PHOTOS
      ) {
        setHasMore(false);
      }
    };
    loadInitial();
  }, []);

  // Функции для Lightbox
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

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

  // Вычисляем, сколько фото осталось до следующей кнопки
  const nextBatchSize = Math.min(AUTO_LOAD_LIMIT, TOTAL_PHOTOS - totalLoaded);

  if (initialLoading) {
    return <GallerySkeleton count={PHOTOS_PER_PAGE} />;
  }

  return (
    <>
      <div className="gallery-container" id="portfolio">
        <div className="gallery-header">
          <h2>Портфолио</h2>
          <p className={`gallery-counter ${countUpdated ? "update" : ""}`}>
            Показано {totalLoaded} из {TOTAL_PHOTOS} работ
          </p>
          <div className="gallery-progress">
            <div
              className="gallery-progress-bar"
              style={{ width: `${(totalLoaded / TOTAL_PHOTOS) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="gallery-grid">
          {photos.map((photo, index) => (
            <GalleryCard
              key={photo.id}
              photo={photo}
              onClick={openLightbox}
              // Даём ref только если авто-загрузка ещё работает
              ref={
                index === photos.length - 1 && !autoLoadComplete && hasMore
                  ? lastElementRef
                  : null
              }
            />
          ))}
        </div>

        {loading && <GallerySkeleton count={3} />}

        {/* Специальная секция с кнопкой "Показать еще" */}
        {autoLoadComplete && totalLoaded < TOTAL_PHOTOS && !loading && (
          <div className="gallery-more">
            <p className="gallery-more-title">
              🎉 Первые {totalLoaded} фото загружены!
            </p>
            <p className="gallery-more-subtitle">
              Хотите увидеть ещё {nextBatchSize} работ?
            </p>
            <button
              className="btn btn-primary load-more-btn"
              onClick={handleManualLoad}
              disabled={loading}
            >
              Показать еще {Math.min(PHOTOS_PER_PAGE, nextBatchSize)} фото
            </button>
          </div>
        )}

        {/* Сообщение о завершении (все фото загружены) */}
        {!hasMore && totalLoaded >= TOTAL_PHOTOS && (
          <div className="gallery-end">
            <p>🎉 Вы посмотрели все {TOTAL_PHOTOS} работ!</p>
            <p className="gallery-end-subtitle">
              Хотите обсудить проект? <a href="#contacts">Свяжитесь со мной</a>
            </p>
          </div>
        )}
      </div>

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
