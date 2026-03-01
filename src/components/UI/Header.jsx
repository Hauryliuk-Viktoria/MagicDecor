import React, { useState } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <a href="/">
            <span className="logo-text">MagicDecor</span>
          </a>
        </div>

        <nav className={`nav-menu ${isMenuOpen ? "active" : ""}`}>
          <ul className="nav-list">
            <li>
              <a href="#about">О нас</a>
            </li>
            <li>
              <a href="#portfolio">Наши работы</a>
            </li>

            {/* <li>
              <a href="#services">Услуги</a>
            </li> */}
            <li>
              <a href="#contacts">Контакты</a>
            </li>
          </ul>
        </nav>

        <button
          className="mobile-menu-btn"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Меню"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
};

export default Header;
