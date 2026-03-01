import React from "react";
import heroBd from "../../assets/images/about/hero.jpg";

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-background">
        <img
          src={heroBd} // Положи красивую фото декора
          alt="Свадебный декор"
          className="hero-bg-image"
        />
        <div className="hero-overlay"></div>
      </div>
      <div className="hero-content">
        <h1 className="hero-title">
          Создаем сказку <br />
          для вашего праздника
        </h1>
        <p className="hero-subtitle">
          Оформление свадеб, юбилеев и фотозон под ключ
        </p>
        <div className="hero-buttons">
          <a href="#portfolio" className="btn btn-primary">
            Наши работы
          </a>
          <a href="#contacts" className="btn btn-secondary">
            Заказать звонок
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
