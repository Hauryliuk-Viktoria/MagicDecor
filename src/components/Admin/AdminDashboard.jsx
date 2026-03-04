import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import PhotoManager from "./PhotoManager";
import AboutEditor from "./AboutEditor";
import SettingsEditor from "./SettingsEditor"; // Импортируем новый компонент
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("photos");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    } catch (error) {
      console.error("Ошибка получения пользователя:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/admin/login");
    } catch (error) {
      console.error("Ошибка выхода:", error);
      alert("Не удалось выйти");
    }
  };

  if (loading) {
    return <div className="loading-spinner">Загрузка...</div>;
  }

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <div className="header-left">
          <h1>MagicDecor Admin</h1>
          {user && <span className="welcome-text">{user.email}</span>}
        </div>
        <button onClick={handleLogout} className="logout-btn">
          Выйти
        </button>
      </header>

      <div className="dashboard-tabs">
        <button
          className={`tab-btn ${activeTab === "photos" ? "active" : ""}`}
          onClick={() => setActiveTab("photos")}
        >
          📸 Фотографии
        </button>
        <button
          className={`tab-btn ${activeTab === "about" ? "active" : ""}`}
          onClick={() => setActiveTab("about")}
        >
          👥 О нас
        </button>
        <button
          className={`tab-btn ${activeTab === "settings" ? "active" : ""}`}
          onClick={() => setActiveTab("settings")}
        >
          ⚙️ Настройки
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === "photos" && <PhotoManager />}
        {activeTab === "about" && <AboutEditor />}
        {activeTab === "settings" && <SettingsEditor />}
      </div>
    </div>
  );
};

export default AdminDashboard;
