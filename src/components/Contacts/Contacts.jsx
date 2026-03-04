import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import "./Contacts.css";

const Contacts = () => {
  const [settings, setSettings] = useState({
    phone: "+7 (999) 123-45-67",
    email: "info@magicdecor.ru",
    address: "Москва, ул. Декоративная, 15",
    work_hours: "Ежедневно с 10:00 до 21:00",
    instagram: "https://instagram.com/magicdecor",
    vk: "https://vk.com/magicdecor",
    telegram: "https://t.me/magicdecor",
    map_lat: "55.755825",
    map_lng: "37.617633",
    map_address: "Москва, ул. Декоративная, 15",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContactsData();
  }, []);

  const fetchContactsData = async () => {
    try {
      const { data, error } = await supabase
        .from("settings")
        .select("*")
        .eq("id", 1)
        .single();

      if (error) throw error;
      if (data) {
        setSettings(data);
      }
    } catch (error) {
      console.error("Ошибка загрузки контактов:", error);
    } finally {
      setLoading(false);
    }
  };

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    eventType: "wedding", // тип мероприятия
    date: "",
    message: "",
  });

  const [formStatus, setFormStatus] = useState({
    submitted: false,
    loading: false,
    error: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus({ loading: true, submitted: false, error: null });

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Заявка на оформление:", formData);
      setFormStatus({ loading: false, submitted: true, error: null });
      setFormData({
        name: "",
        email: "",
        phone: "",
        eventType: "wedding",
        date: "",
        message: "",
      });

      setTimeout(() => {
        setFormStatus((prev) => ({ ...prev, submitted: false }));
      }, 5000);
    } catch (error) {
      setFormStatus({
        loading: false,
        submitted: false,
        error: "Ошибка. Попробуйте позже.",
      });
    }
  };

  return (
    <section className="contacts-section" id="contacts">
      <div className="contacts-container">
        <div className="contacts-header">
          <h2 className="contacts-title">Обсудим ваш праздник?</h2>
          <div className="contacts-divider"></div>
          <p className="contacts-subtitle">
            Расскажите о мероприятии — мы подготовим индивидуальное предложение
          </p>
        </div>

        <div className="contacts-content">
          {/* Левая колонка - информация */}
          <div className="contacts-info">
            <h3 className="info-title">Как с нами связаться</h3>

            <div className="info-items">
              {/* Телефон */}
              <div className="info-item">
                <div className="info-icon phone-icon">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8 10a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <div className="info-content">
                  <h4>Телефон</h4>
                  <a href={`tel:${settings.phone}`}>{settings.phone}</a>
                  <p className="info-note">{settings.work_hours}</p>
                </div>
              </div>

              {/* Email */}
              <div className="info-item">
                <div className="info-icon email-icon">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <div className="info-content">
                  <h4>Email</h4>
                  <a href={`mailto:${settings.email}`}>{settings.email}</a>
                  <p className="info-note">Отвечаем в течение 2 часов</p>
                </div>
              </div>

              {/* Адрес */}
              <div className="info-item">
                <div className="info-icon address-icon">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div className="info-content">
                  <h4>Адрес</h4>
                  <p>{settings.address}</p>
                  <p className="info-note">Встречи по предварительной записи</p>
                </div>
              </div>

              {/* Соцсети */}
              <div className="info-item social-item">
                <h4>Мы в соцсетях</h4>
                <div className="social-links">
                  <a
                    href={settings.instagram}
                    className="social-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 0 12.324 0 6.162 6.162 0 0 0-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.405a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z" />
                    </svg>
                    <span>Instagram</span>
                  </a>
                  <a
                    href={settings.vk}
                    className="social-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                    </svg>
                    <span>VK</span>
                  </a>
                  <a
                    href={settings.telegram}
                    className="social-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.916.49-1.306.48-.43-.008-1.26-.244-1.875-.444-.758-.246-1.36-.377-1.309-.796.036-.218.323-.442.89-.668 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                    </svg>
                    <span>Telegram</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Правая колонка - форма */}
          <div className="contacts-form-wrapper">
            <h3 className="form-title">Заявка на оформление</h3>

            {formStatus.submitted && (
              <div className="form-success">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <p>Спасибо! Мы свяжемся с вами в ближайшее время.</p>
              </div>
            )}

            {formStatus.error && (
              <div className="form-error">
                <p>{formStatus.error}</p>
              </div>
            )}

            <form className="contacts-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Ваше имя *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Анна"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="anna@example.com"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Телефон *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="+7 (999) 123-45-67"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="eventType">Тип мероприятия</label>
                  <select
                    id="eventType"
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleChange}
                  >
                    <option value="wedding">Свадьба</option>
                    <option value="anniversary">Юбилей</option>
                    <option value="corporate">Корпоратив</option>
                    <option value="other">Другое</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="date">Предполагаемая дата</label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="message">Пожелания</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Расскажите о вашей идее..."
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary submit-btn"
                disabled={formStatus.loading}
              >
                {formStatus.loading ? "Отправка..." : "Обсудить праздник"}
              </button>
            </form>
          </div>
        </div>

        {/* Карта */}
        <div className="contacts-map">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d38291.260439632344!2d24.398807731120595!3d53.142437290925535!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46df9cdc3e995c81%3A0xc75a78abc7288353!2z0JLQvtC70LrQvtCy0YvRgdC6LCDQk9GA0L7QtNC90LXQvdGB0LrQsNGPINC-0LHQu9Cw0YHRgtGM!5e0!3m2!1sru!2sby!4v1772458217996!5m2!1sru!2sby"
            title="Карта"
            allowFullScreen=""
            loading="lazy"
            className="map-iframe"
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default Contacts;
