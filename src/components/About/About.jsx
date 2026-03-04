import React, { useEffect, useRef, useState } from "react";
import { supabase } from "../../lib/supabase";
import "./About.css";

const About = () => {
  const [imageError, setImageError] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [aboutData, setAboutData] = useState({
    name: "Игорь & Анжелика",
    profession: "Свадебные декораторы и оформители",
    description: [
      "Мы — семейная пара, которая превращает обычные залы в волшебные пространства. Наша история началась с собственной свадьбы 7 лет назад, и теперь мы помогаем другим парам создать праздник мечты.",
      "За плечами — более 150 свадеб, 300 праздников и тысячи счастливых гостей. Мы верим, что каждая деталь важна: от цвета салфеток до аромата цветов. Работаем с лучшими площадками Москвы и области.",
    ],
    quote:
      "Каждый проект мы делаем с душой, как для себя. Ведь свадьба — это начало вашей семьи, а мы это очень хорошо понимаем.",
    skills: [
      { name: "Оформление свадебных залов", percent: 98 },
      { name: "Создание фотозон", percent: 95 },
      { name: "Букеты и композиции", percent: 90 },
      { name: "Выездные церемонии", percent: 92 },
      { name: "Декор юбилеев", percent: 88 },
    ],
    stats: [
      { number: "150+", label: "Свадеб оформлено" },
      { number: "300+", label: "Праздников" },
      { number: "7 лет", label: "Работаем вместе" },
    ],
    mainPhoto: "/images/about/couple.jpg",
  });
  const [loading, setLoading] = useState(true);
  const skillsRef = useRef(null);

  useEffect(() => {
    fetchAboutData();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3, rootMargin: "50px" },
    );

    if (skillsRef.current) {
      observer.observe(skillsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const fetchAboutData = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("about")
        .select("*")
        .eq("id", 1)
        .single();

      if (error && error.code !== "PGRST116") throw error;

      if (data) {
        setAboutData((prev) => ({
          ...prev,
          ...data,
          // Важно! Преобразуем description в массив, если это не массив
          description: Array.isArray(data.description)
            ? data.description
            : data.description
              ? [data.description]
              : prev.description,
          // Аналогично для skills и stats
          skills: Array.isArray(data.skills) ? data.skills : prev.skills,
          stats: Array.isArray(data.stats) ? data.stats : prev.stats,
        }));
      }
    } catch (error) {
      console.error("Ошибка загрузки данных:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="about-section" id="about">
        <div className="about-container">
          <div className="loading-spinner">Загрузка...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="about-section" id="about">
      <div className="about-container">
        <div className="about-header">
          <h2 className="about-title">О нас</h2>
          <div className="about-divider"></div>
        </div>

        <div className="about-content">
          {/* Фото пары */}
          <div className="about-image-wrapper">
            <div className="about-image-container">
              <img
                src={aboutData.main_photo}
                alt={aboutData.name}
                className="about-image"
                loading="lazy"
                onError={(e) => {
                  // Предотвращаем бесконечный цикл
                  if (e.target.src.includes("fallback")) return;

                  // Пытаемся загрузить локальную заглушку
                  e.target.src = "/images/about/couple.jpg";

                  // Если и локальная не загрузится - убираем обработчик
                  e.target.onerror = null;
                }}
              />
              <div className="about-image-overlay">
                <span className="about-experience">Семейная команда</span>
              </div>
            </div>
          </div>

          {/* Текстовая часть */}
          <div className="about-text-wrapper">
            <h3 className="about-name">{aboutData.name}</h3>
            <p className="about-profession">{aboutData.profession}</p>

            <div className="about-description">
              {/* Проверяем, что description - это массив, и он не пустой */}
              {Array.isArray(aboutData.description) &&
              aboutData.description.length > 0 ? (
                aboutData.description.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))
              ) : (
                // Если не массив или пусто, показываем значение по умолчанию
                <p>
                  Мы — семейная пара, которая превращает обычные залы в
                  волшебные пространства.
                </p>
              )}

              {aboutData.quote && (
                <p className="about-quote">{aboutData.quote}</p>
              )}
            </div>

            {/* Навыки */}
            <div className="about-skills" ref={skillsRef}>
              <h4>Наши сильные стороны</h4>
              <div className="skills-list">
                {aboutData.skills.map((skill, index) => (
                  <div className="skill-item" key={index}>
                    <div className="skill-header">
                      <span className="skill-name">{skill.name}</span>
                      <span className="skill-percent">{skill.percent}%</span>
                    </div>
                    <div className="skill-bar">
                      <div
                        className="skill-progress"
                        style={{
                          "--progress-width": `${skill.percent}%`,
                          width: isVisible ? "var(--progress-width)" : "0",
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Статистика */}
            <div className="about-stats">
              {aboutData.stats.map((stat, index) => (
                <div className="stat-item" key={index}>
                  <span className="stat-number">{stat.number}</span>
                  <span className="stat-label">{stat.label}</span>
                </div>
              ))}
            </div>

            {/* Кнопки */}
            <div className="about-buttons">
              <a href="#portfolio" className="btn btn-primary">
                Смотреть работы
              </a>
              <a href="#contacts" className="btn btn-outline">
                Обсудить праздник
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
