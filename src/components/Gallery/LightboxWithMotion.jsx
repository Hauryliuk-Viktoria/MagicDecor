import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSwipeable } from "react-swipeable";
import "./Lightbox.css";

const LightboxWithMotion = ({
  isOpen,
  onClose,
  photo,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}) => {
  // Блокируем скролл body когда открыт lightbox
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    const handleKeyDown = (e) => {
      if (!isOpen) return;

      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowLeft":
          if (hasPrev) onPrev();
          break;
        case "ArrowRight":
          if (hasNext) onNext();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose, onPrev, onNext, hasPrev, hasNext]);

  // Настройка свайпов
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (hasNext) onNext(); // Свайп влево = следующее фото
    },
    onSwipedRight: () => {
      if (hasPrev) onPrev(); // Свайп вправо = предыдущее фото
    },
    onSwipedDown: () => {
      onClose(); // Свайп вниз = закрыть
    },
    preventDefaultTouchmoveEvent: true,
    trackMouse: true, // Для тестирования мышкой (на компьютере)
    delta: 50, // Минимальное расстояние для свайпа
  });

  if (!isOpen || !photo) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="lightbox-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          {...swipeHandlers} // Добавляем обработчики свайпов
        >
          <motion.div
            className="lightbox-content"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Кнопка закрытия */}
            <motion.button
              className="lightbox-close"
              onClick={onClose}
              whileHover={{ rotate: 90, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              ×
            </motion.button>

            {/* Навигационные кнопки (только для десктопа) */}
            {hasPrev && (
              <motion.button
                className="lightbox-nav lightbox-prev desktop-only"
                onClick={onPrev}
                whileHover={{ scale: 1.1, x: -5 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                ‹
              </motion.button>
            )}

            {hasNext && (
              <motion.button
                className="lightbox-nav lightbox-next desktop-only"
                onClick={onNext}
                whileHover={{ scale: 1.1, x: 5 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                ›
              </motion.button>
            )}

            {/* Контейнер с изображением */}
            <motion.div
              className="lightbox-image-container"
              key={photo.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ type: "spring", damping: 25 }}
            >
              <img
                src={photo.largeUrl || photo.url} // Сначала пробуем большую
                alt={photo.title}
                className="lightbox-image"
              />
            </motion.div>

            {/* Информация о фото */}
            <motion.div
              className="lightbox-info"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3>{photo.title}</h3>
              <p className="lightbox-category">{photo.category}</p>
              {/* Подсказка для мобильных */}
              <span className="swipe-hint">
                {hasPrev && hasNext
                  ? "👆 Листай влево/вправо • Свайп вниз чтобы закрыть"
                  : "👆 Свайп вниз чтобы закрыть"}
              </span>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LightboxWithMotion;
