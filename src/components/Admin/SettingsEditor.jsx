import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import "./SettingsEditor.css";

const SettingsEditor = () => {
  const [settings, setSettings] = useState({
    hero_title: "",
    hero_subtitle: "",
    hero_image: "",
    phone: "",
    email: "",
    address: "",
    work_hours: "",
    instagram: "",
    vk: "",
    telegram: "",
    map_lat: "",
    map_lng: "",
    map_address: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("settings")
        .select("*")
        .eq("id", 1)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setSettings(data);
      }
    } catch (error) {
      console.error("Ошибка загрузки настроек:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Файл слишком большой. Максимальный размер 2MB");
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const uploadHeroImage = async () => {
    if (!selectedFile) return settings.hero_image;

    try {
      setUploading(true);
      const fileExt = selectedFile.name.split(".").pop();
      const fileName = `hero/${Date.now()}_hero.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("photos")
        .upload(fileName, selectedFile, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("photos").getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error("Ошибка загрузки фото:", error);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      let heroImageUrl = settings.hero_image;
      if (selectedFile) {
        heroImageUrl = await uploadHeroImage();
      }

      const { error } = await supabase.from("settings").upsert({
        id: 1,
        ...settings,
        hero_image: heroImageUrl,
      });

      if (error) throw error;

      alert("Настройки сохранены!");
      setSelectedFile(null);
      setPreviewUrl("");
      await fetchSettings();
    } catch (error) {
      console.error("Ошибка сохранения:", error);
      alert("Ошибка при сохранении");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return <div className="loading-spinner">Загрузка...</div>;
  }

  return (
    <div className="settings-editor">
      <h2>⚙️ Настройки сайта</h2>

      {/* Hero секция */}
      <div className="editor-section">
        <h3>Главный экран (Hero)</h3>

        <div className="form-group">
          <label>Заголовок</label>
          <input
            type="text"
            value={settings.hero_title}
            onChange={(e) => handleChange("hero_title", e.target.value)}
            placeholder="Создаем сказку для вашего праздника"
          />
        </div>

        <div className="form-group">
          <label>Подзаголовок</label>
          <input
            type="text"
            value={settings.hero_subtitle}
            onChange={(e) => handleChange("hero_subtitle", e.target.value)}
            placeholder="Оформление свадеб, юбилеев и фотозон под ключ"
          />
        </div>

        <div className="form-group">
          <label>Фоновое изображение</label>
          <div className="photo-upload">
            <div className="current-photo">
              <img
                src={previewUrl || settings.hero_image}
                alt="Hero"
                onError={(e) => {
                  e.target.src = "/images/hero/wedding-decor.jpg";
                }}
              />
            </div>
            <div className="upload-controls">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                disabled={uploading}
              />
              {uploading && <span>Загрузка...</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Контактная информация */}
      <div className="editor-section">
        <h3>Контактная информация</h3>

        <div className="form-row">
          <div className="form-group">
            <label>Телефон</label>
            <input
              type="text"
              value={settings.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="+7 (999) 123-45-67"
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={settings.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="info@magicdecor.ru"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Адрес</label>
          <input
            type="text"
            value={settings.address}
            onChange={(e) => handleChange("address", e.target.value)}
            placeholder="Москва, ул. Декоративная, 15"
          />
        </div>

        <div className="form-group">
          <label>Часы работы</label>
          <input
            type="text"
            value={settings.work_hours}
            onChange={(e) => handleChange("work_hours", e.target.value)}
            placeholder="Ежедневно с 10:00 до 21:00"
          />
        </div>
      </div>

      {/* Социальные сети */}
      <div className="editor-section">
        <h3>Социальные сети</h3>

        <div className="form-group">
          <label>Instagram (полная ссылка)</label>
          <input
            type="text"
            value={settings.instagram}
            onChange={(e) => handleChange("instagram", e.target.value)}
            placeholder="https://instagram.com/magicdecor"
          />
        </div>

        <div className="form-group">
          <label>VK (полная ссылка)</label>
          <input
            type="text"
            value={settings.vk}
            onChange={(e) => handleChange("vk", e.target.value)}
            placeholder="https://vk.com/magicdecor"
          />
        </div>

        <div className="form-group">
          <label>Telegram (полная ссылка)</label>
          <input
            type="text"
            value={settings.telegram}
            onChange={(e) => handleChange("telegram", e.target.value)}
            placeholder="https://t.me/magicdecor"
          />
        </div>
      </div>

      {/* Карта */}
      <div className="editor-section">
        <h3>Карта</h3>

        <div className="form-row">
          <div className="form-group">
            <label>Широта (lat)</label>
            <input
              type="text"
              value={settings.map_lat}
              onChange={(e) => handleChange("map_lat", e.target.value)}
              placeholder="55.755825"
            />
          </div>

          <div className="form-group">
            <label>Долгота (lng)</label>
            <input
              type="text"
              value={settings.map_lng}
              onChange={(e) => handleChange("map_lng", e.target.value)}
              placeholder="37.617633"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Адрес на карте (для метки)</label>
          <input
            type="text"
            value={settings.map_address}
            onChange={(e) => handleChange("map_address", e.target.value)}
            placeholder="Москва, ул. Декоративная, 15"
          />
        </div>
      </div>

      <div className="editor-actions">
        <button
          className="save-btn"
          onClick={handleSave}
          disabled={saving || uploading}
        >
          {saving ? "Сохранение..." : "💾 Сохранить все настройки"}
        </button>
      </div>
    </div>
  );
};

export default SettingsEditor;
