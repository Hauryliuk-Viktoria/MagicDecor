import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-info">
          <h3>MagicDecor</h3>
          <p>Создаем сказку для вашего праздника с 2018 года</p>
        </div>

        <div className="footer-links">
          <div className="footer-section">
            <h4>Навигация</h4>
            <ul>
              <li>
                <a href="#portfolio">Наши работы</a>
              </li>
              <li>
                <a href="#about">О нас</a>
              </li>
              <li>
                <a href="#services">Услуги</a>
              </li>
              <li>
                <a href="#contacts">Контакты</a>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Услуги</h4>
            <ul>
              <li>
                <a href="#">Оформление свадеб</a>
              </li>
              <li>
                <a href="#">Фотозоны</a>
              </li>
              <li>
                <a href="#">Выездные регистрации</a>
              </li>
              <li>
                <a href="#">Декор юбилеев</a>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Контакты</h4>
            <ul>
              <li>Email: info@magicdecor.ru</li>
              <li>Тел: +7 (999) 123-45-67</li>
              <li>Москва, ул. Декоративная, 15</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} MagicDecor. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
