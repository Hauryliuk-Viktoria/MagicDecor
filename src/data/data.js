// Новые категории для декора
const categories = [
  "Свадьба",
  "Юбилей",
  "Фотозона",
  "Выездная регистрация",
  "Корпоратив",
];

// Автоматический импорт всех фото (как мы сделали)
const photoModules = import.meta.glob("../assets/images/portfolio/*.jpg", {
  eager: true,
});

export const photosData = Object.entries(photoModules).map(
  ([path, module], index) => ({
    id: `photo-${index + 1}`,
    url: module.default,
    title: getTitleForIndex(index), // Хитрость: даем названия в зависимости от категории
    category: categories[index % categories.length],
    description: getDescriptionForCategory(
      categories[index % categories.length],
    ),
    width: 800,
    height: 600,
  }),
);

// Функция для красивых названий
function getTitleForIndex(index) {
  const titles = [
    "Свадьба Марии и Александра",
    'Юбилей ресторана "Золотой"',
    "Фотозона в стиле бохо",
    "Выездная регистрация в парке",
    "50-летие компании",
    "Свадьба в шатре",
    "Фотозона с цветами",
    "Юбилей в загородном клубе",
    "Церемония на закате",
    "Новогодний корпоратив",
  ];
  return titles[index % titles.length];
}

// Функция для описаний
function getDescriptionForCategory(category) {
  const descriptions = {
    Свадьба: "Полное оформление свадебного зала, букет невесты и бутоньерки",
    Юбилей: "Праздничный декор для юбилеев и дней рождений",
    Фотозона: "Уникальные фотозоны с реквизитом для незабываемых фото",
    "Выездная регистрация": "Арки, дорожки, декор для церемоний на природе",
    Корпоратив: "Оформление корпоративных мероприятий и вечеринок",
  };
  return descriptions[category] || "Красивый декор для вашего праздника";
}

export const TOTAL_PHOTOS = photosData.length;
