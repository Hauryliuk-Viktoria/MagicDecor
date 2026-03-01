// import React from "react";
// import { signOut } from "firebase/auth";
// import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/admin/login");
    } catch (error) {
      console.error("Ошибка выхода:", error);
    }
  };

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <h1>MagicDecor Admin</h1>
        <button onClick={handleLogout} className="logout-btn">
          Выйти
        </button>
      </header>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>📸 Управление фото</h3>
          <p>Загрузка, удаление и сортировка фотографий</p>
          <button className="card-btn">Перейти</button>
        </div>

        <div className="dashboard-card">
          <h3>📝 Редактирование текстов</h3>
          <p>Изменение информации на странице "О нас"</p>
          <button className="card-btn">Перейти</button>
        </div>

        <div className="dashboard-card">
          <h3>⚙️ Настройки</h3>
          <p>Общие настройки сайта</p>
          <button className="card-btn">Перейти</button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
