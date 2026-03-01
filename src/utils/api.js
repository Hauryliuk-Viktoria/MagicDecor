// Имитация загрузки данных с сервера

import { photosData, TOTAL_PHOTOS } from "../data/data";

//const categories = ["Портрет", "Свадьба", "Репортаж", "Предметка", "Интерьер"];
const API_DELAY = 500;

export const fetchPhotos = async (page, limit = 9) => {
  await new Promise((resolve) => setTimeout(resolve, API_DELAY));

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  // Просто возвращаем данные из файла с импортами
  // Сами картинки уже внутри объектов!
  return photosData.slice(startIndex, endIndex);
};
export const getTotalPhotosCount = () => {
  return TOTAL_PHOTOS;
};
