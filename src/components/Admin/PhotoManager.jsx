import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import "./PhotoManager.css";

const PhotoManager = () => {
  const [photos, setPhotos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(true);

  // Категории для фото
  const categories = [
    "Свадьба",
    "Юбилей",
    "Фотозона",
    "Выездная регистрация",
    "Корпоратив",
  ];

  // Данные для новой загрузки
  const [newPhoto, setNewPhoto] = useState({
    title: "",
    category: categories[0],
    description: "",
  });

  // Загружаем список фото при монтировании
  useEffect(() => {
    fetchPhotos();
  }, []);

  // Получение всех фото из базы
  const fetchPhotos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("photos")
        .select("*")
        .order("order", { ascending: false });

      if (error) throw error;
      setPhotos(data || []);
    } catch (error) {
      console.error("Ошибка загрузки фото:", error);
      alert("Не удалось загрузить список фото");
    } finally {
      setLoading(false);
    }
  };

  // Обработка выбора файла
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Проверка размера (макс 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Файл слишком большой. Максимальный размер 5MB");
        return;
      }

      // Проверка типа файла
      if (!file.type.startsWith("image/")) {
        alert("Можно загружать только изображения");
        return;
      }

      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Загрузка фото
  const handleUpload = async () => {
    if (!selectedFile || !newPhoto.title) {
      alert("Выберите фото и введите название");
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // 1. Создаем уникальное имя файла
      const fileExt = selectedFile.name.split(".").pop();
      const fileName = `photos/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

      // 2. Загружаем в Storage с отслеживанием прогресса
      const { error: uploadError, data } = await supabase.storage
        .from("photos")
        .upload(fileName, selectedFile, {
          cacheControl: "3600",
          upsert: false,
          onUploadProgress: (progress) => {
            const percent = (progress.loaded / progress.total) * 100;
            setUploadProgress(percent);
          },
        });

      if (uploadError) throw uploadError;

      // 3. Получаем публичный URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("photos").getPublicUrl(fileName);

      // 4. Сохраняем данные в базу
      const { error: dbError } = await supabase.from("photos").insert([
        {
          title: newPhoto.title,
          category: newPhoto.category,
          description: newPhoto.description,
          url: publicUrl,
          storage_path: fileName,
          order: Date.now(), // для сортировки
        },
      ]);

      if (dbError) throw dbError;

      // 5. Обновляем список фото
      await fetchPhotos();

      // 6. Очищаем форму
      setSelectedFile(null);
      setPreviewUrl("");
      setNewPhoto({
        title: "",
        category: categories[0],
        description: "",
      });
      setUploadProgress(100);

      // Скрываем прогресс через секунду
      setTimeout(() => setUploadProgress(0), 1000);
    } catch (error) {
      console.error("Ошибка загрузки:", error);
      alert("Ошибка при загрузке: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  // Удаление фото
  const handleDelete = async (photo) => {
    if (!window.confirm(`Удалить фото "${photo.title}"?`)) return;

    try {
      // 1. Удаляем файл из Storage
      if (photo.storage_path) {
        const { error: storageError } = await supabase.storage
          .from("photos")
          .remove([photo.storage_path]);

        if (storageError) throw storageError;
      }

      // 2. Удаляем запись из базы данных
      const { error: dbError } = await supabase
        .from("photos")
        .delete()
        .eq("id", photo.id);

      if (dbError) throw dbError;

      // 3. Обновляем список
      await fetchPhotos();
    } catch (error) {
      console.error("Ошибка удаления:", error);
      alert("Не удалось удалить фото");
    }
  };

  // Обновление информации о фото
  const handleUpdate = async (photo) => {
    const newTitle = prompt("Введите новое название:", photo.title);
    if (!newTitle || newTitle === photo.title) return;

    try {
      const { error } = await supabase
        .from("photos")
        .update({ title: newTitle })
        .eq("id", photo.id);

      if (error) throw error;

      await fetchPhotos();
    } catch (error) {
      console.error("Ошибка обновления:", error);
      alert("Не удалось обновить название");
    }
  };

  return (
    <div className="photo-manager">
      <h2>📸 Управление фотографиями</h2>

      {/* Форма загрузки */}
      <div className="upload-section">
        <h3>Загрузить новое фото</h3>

        <div className="upload-form">
          <div className="form-left">
            <div className="form-group">
              <label>Название *</label>
              <input
                type="text"
                value={newPhoto.title}
                onChange={(e) =>
                  setNewPhoto({ ...newPhoto, title: e.target.value })
                }
                placeholder="Например: Свадьба в загородном клубе"
                disabled={uploading}
              />
            </div>

            <div className="form-group">
              <label>Категория</label>
              <select
                value={newPhoto.category}
                onChange={(e) =>
                  setNewPhoto({ ...newPhoto, category: e.target.value })
                }
                disabled={uploading}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Описание (необязательно)</label>
              <textarea
                value={newPhoto.description}
                onChange={(e) =>
                  setNewPhoto({ ...newPhoto, description: e.target.value })
                }
                placeholder="Краткое описание фото"
                rows="3"
                disabled={uploading}
              />
            </div>

            <div className="form-group">
              <label>Выберите файл</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                disabled={uploading}
              />
              <small className="file-hint">
                Максимальный размер: 5MB. Поддерживаются: JPG, PNG, WebP
              </small>
            </div>

            {uploadProgress > 0 && (
              <div className="upload-progress">
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <span>{Math.round(uploadProgress)}% загружено</span>
              </div>
            )}

            <button
              className="upload-btn"
              onClick={handleUpload}
              disabled={uploading || !selectedFile || !newPhoto.title}
            >
              {uploading ? "Загрузка..." : "📤 Загрузить фото"}
            </button>
          </div>

          <div className="form-right">
            {previewUrl ? (
              <div className="image-preview">
                <h4>Предпросмотр:</h4>
                <img src={previewUrl} alt="Preview" />
              </div>
            ) : (
              <div className="preview-placeholder">
                <p>👆 Выберите файл для предпросмотра</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Список загруженных фото */}
      <div className="photos-list">
        <h3>Загруженные фото ({photos.length})</h3>

        {loading ? (
          <div className="loading-spinner">Загрузка...</div>
        ) : (
          <div className="photos-grid">
            {photos.map((photo) => (
              <div key={photo.id} className="photo-card">
                <img src={photo.url} alt={photo.title} />
                <div className="photo-info">
                  <h4>{photo.title}</h4>
                  <p className="photo-category">{photo.category}</p>
                  {photo.description && (
                    <p className="photo-description">{photo.description}</p>
                  )}
                  <div className="photo-actions">
                    <button
                      className="edit-btn"
                      onClick={() => handleUpdate(photo)}
                      title="Редактировать название"
                    >
                      ✏️
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(photo)}
                      title="Удалить фото"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && photos.length === 0 && (
          <p className="no-photos">
            Пока нет загруженных фото. Загрузите первое фото!
          </p>
        )}
      </div>
    </div>
  );
};

export default PhotoManager;
