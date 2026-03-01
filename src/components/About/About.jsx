import React, { useEffect, useRef, useState } from "react";
import "./About.css";
import couplePic from "../../assets/images/about/couple.jpg";

const About = () => {
  const [isVisible, setIsVisible] = useState(false);
  const skillsRef = useRef(null);

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

  // Только навыки (команду убрали)
  const skills = [
    { name: "Оформление свадебных залов", width: "98%" },
    { name: "Создание фотозон", width: "95%" },
    { name: "Букеты и композиции", width: "90%" },
    { name: "Выездные церемонии", width: "92%" },
    { name: "Декор юбилеев", width: "88%" },
  ];

  const stats = [
    { number: "150+", label: "Свадеб оформлено" },
    { number: "300+", label: "Праздников" },
    { number: "7 лет", label: "Работаем вместе" }, // Изменили текст
  ];

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
                src={couplePic} // Положи фото пары
                alt="Алексей и Елена"
                className="about-image"
              />
              <div className="about-image-overlay">
                <span className="about-experience">Семейная команда</span>
              </div>
            </div>
          </div>

          {/* Текстовая часть */}
          <div className="about-text-wrapper">
            <h3 className="about-name">Игорь & Анжелика</h3>
            <p className="about-profession">
              Свадебные декораторы и оформители
            </p>

            <div className="about-description">
              <p>
                Мы — семейная пара, которая превращает обычные залы в волшебные
                пространства. Наша история началась с собственной свадьбы 7 лет
                назад, и теперь мы помогаем другим парам создать праздник мечты.
              </p>
              <p>
                За плечами — более 150 свадеб, 300 праздников и тысячи
                счастливых гостей. Мы верим, что каждая деталь важна: от цвета
                салфеток до аромата цветов. Работаем с лучшими площадками Москвы
                и области.
              </p>
              <p className="about-quote">
                "Каждый проект мы делаем с душой, как для себя. Ведь свадьба —
                это начало вашей семьи, а мы это очень хорошо понимаем."
              </p>
            </div>

            {/* Навыки */}
            <div className="about-skills" ref={skillsRef}>
              <h4>Наши сильные стороны</h4>
              <div className="skills-list">
                {skills.map((skill, index) => (
                  <div className="skill-item" key={index}>
                    <div className="skill-header">
                      <span className="skill-name">{skill.name}</span>
                      <span className="skill-percent">{skill.width}</span>
                    </div>
                    <div className="skill-bar">
                      <div
                        className="skill-progress"
                        style={{
                          "--progress-width": skill.width,
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
              {stats.map((stat, index) => (
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
