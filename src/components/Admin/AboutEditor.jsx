import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import "./AboutEditor.css";

const AboutEditor = () => {
  const [aboutData, setAboutData] = useState({
    name: "Алексей и Елена",
    profession: "Свадебные декораторы",
    description: [
      "Мы — семейная пара, которая превращает обычные залы в волшебные пространства.",
    ],
    quote: "Каждый проект мы делаем с душой, как для себя.",
    skills: [
      { name: "Оформление свадебных залов", percent: 98 },
      { name: "Создание фотозон", percent: 95 },
    ],
    stats: [
      { number: "150+", label: "Свадеб" },
      { number: "300+", label: "Праздников" },
    ],
    main_photo: "/images/about/couple.jpg",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    checkSession();

    fetchAboutData();
  }, []);

  const checkSession = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    console.log("Текущая сессия:", session);
    if (!session) {
      alert("Вы не авторизованы! Перенаправление на страницу входа...");
      window.location.href = "/admin/login";
    }
  };

  const fetchAboutData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("about")
        .select("*")
        .eq("id", 1)
        .maybeSingle(); // Вместо .single() используем maybeSingle()

      if (error && error.code !== "PGRST116") throw error;

      if (data) {
        // Если данные есть, обновляем состояние, но с защитой от undefined
        setAboutData({
          name: data.name || aboutData.name,
          profession: data.profession || aboutData.profession,
          description: data.description || aboutData.description,
          quote: data.quote || aboutData.quote,
          skills: data.skills || aboutData.skills,
          stats: data.stats || aboutData.stats,
          main_photo: data.main_photo || aboutData.main_photo,
        });
      }
    } catch (error) {
      console.error("Ошибка загрузки:", error);
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

  const uploadPhoto = async () => {
    if (!selectedFile) return aboutData.main_photo;

    try {
      setUploading(true);
      const fileExt = selectedFile.name.split(".").pop();
      const fileName = `about/${Date.now()}_team.${fileExt}`;

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

      let photoUrl = aboutData.main_photo;
      if (selectedFile) {
        photoUrl = await uploadPhoto();
      }

      const { error } = await supabase.from("about").upsert({
        id: 1,
        ...aboutData,
        main_photo: photoUrl,
      });

      if (error) throw error;

      alert("Данные сохранены!");
      setSelectedFile(null);
      setPreviewUrl("");
      await fetchAboutData();
    } catch (error) {
      console.error("Ошибка сохранения:", error);
      alert("Ошибка при сохранении");
    } finally {
      setSaving(false);
    }
  };

  const handleDescriptionChange = (index, value) => {
    const newDescription = [...aboutData.description];
    newDescription[index] = value;
    setAboutData({ ...aboutData, description: newDescription });
  };

  const addDescription = () => {
    setAboutData({
      ...aboutData,
      description: [...aboutData.description, ""],
    });
  };

  const removeDescription = (index) => {
    if (aboutData.description.length > 1) {
      const newDescription = aboutData.description.filter(
        (_, i) => i !== index,
      );
      setAboutData({ ...aboutData, description: newDescription });
    }
  };

  const handleSkillChange = (index, field, value) => {
    const newSkills = [...aboutData.skills];
    newSkills[index] = { ...newSkills[index], [field]: value };
    setAboutData({ ...aboutData, skills: newSkills });
  };

  const addSkill = () => {
    setAboutData({
      ...aboutData,
      skills: [...aboutData.skills, { name: "", percent: 90 }],
    });
  };

  const removeSkill = (index) => {
    const newSkills = aboutData.skills.filter((_, i) => i !== index);
    setAboutData({ ...aboutData, skills: newSkills });
  };

  const handleStatChange = (index, field, value) => {
    const newStats = [...aboutData.stats];
    newStats[index] = { ...newStats[index], [field]: value };
    setAboutData({ ...aboutData, stats: newStats });
  };

  const addStat = () => {
    setAboutData({
      ...aboutData,
      stats: [...aboutData.stats, { number: "", label: "" }],
    });
  };

  const removeStat = (index) => {
    const newStats = aboutData.stats.filter((_, i) => i !== index);
    setAboutData({ ...aboutData, stats: newStats });
  };

  if (loading) {
    return <div className="loading-spinner">Загрузка...</div>;
  }

  return (
    <div className="about-editor">
      <h2>📝 Редактирование страницы "О нас"</h2>

      <div className="editor-section">
        <h3>Основная информация</h3>

        <div className="form-group">
          <label>Название (Имена)</label>
          <input
            type="text"
            value={aboutData.name || ""}
            onChange={(e) =>
              setAboutData({ ...aboutData, name: e.target.value })
            }
            placeholder="Алексей и Елена"
          />
        </div>

        <div className="form-group">
          <label>Профессия / Должность</label>
          <input
            type="text"
            value={aboutData.profession || ""}
            onChange={(e) =>
              setAboutData({ ...aboutData, profession: e.target.value })
            }
            placeholder="Свадебные декораторы"
          />
        </div>

        <div className="form-group">
          <label>Цитата</label>
          <textarea
            value={aboutData.quote || ""}
            onChange={(e) =>
              setAboutData({ ...aboutData, quote: e.target.value })
            }
            placeholder="Каждый проект мы делаем с душой..."
            rows="3"
          />
        </div>
      </div>

      <div className="editor-section">
        <h3>Описание (абзацы)</h3>
        {aboutData.description.map((text, index) => (
          <div key={index} className="description-item">
            <textarea
              value={text}
              onChange={(e) => handleDescriptionChange(index, e.target.value)}
              placeholder={`Абзац ${index + 1}`}
              rows="3"
            />
            <button
              className="remove-btn"
              onClick={() => removeDescription(index)}
              disabled={aboutData.description.length === 1}
            >
              ✕
            </button>
          </div>
        ))}
        <button className="add-btn" onClick={addDescription}>
          + Добавить абзац
        </button>
      </div>

      <div className="editor-section">
        <h3>Фото команды</h3>
        <div className="photo-upload">
          <div className="current-photo">
            <img
              src={
                previewUrl || aboutData.main_photo || "/images/about/couple.jpg"
              }
              alt="Команда"
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

      <div className="editor-section">
        <h3>Навыки</h3>
        {aboutData.skills && aboutData.skills.length > 0 ? (
          aboutData.skills.map((skill, index) => (
            <div key={index} className="skill-row">
              <input
                type="text"
                value={skill.name}
                onChange={(e) =>
                  handleSkillChange(index, "name", e.target.value)
                }
                placeholder="Название навыка"
              />
              <input
                type="number"
                value={skill.percent}
                onChange={(e) =>
                  handleSkillChange(index, "percent", parseInt(e.target.value))
                }
                min="0"
                max="100"
                placeholder="%"
              />
              <button className="remove-btn" onClick={() => removeSkill(index)}>
                ✕
              </button>
            </div>
          ))
        ) : (
          <p>Нет навыков</p>
        )}

        {/* Статистика */}
        {aboutData.stats && aboutData.stats.length > 0 ? (
          aboutData.stats.map((stat, index) => (
            <div key={index} className="stat-row">
              {/* ... */}
            </div>
          ))
        ) : (
          <p>Нет статистики</p>
        )}
        <button className="add-btn" onClick={addSkill}>
          + Добавить навык
        </button>
      </div>

      <div className="editor-section">
        <h3>Статистика</h3>
        {aboutData.stats.map((stat, index) => (
          <div key={index} className="stat-row">
            <input
              type="text"
              value={stat.number}
              onChange={(e) =>
                handleStatChange(index, "number", e.target.value)
              }
              placeholder="Число (150+)"
            />
            <input
              type="text"
              value={stat.label}
              onChange={(e) => handleStatChange(index, "label", e.target.value)}
              placeholder="Подпись"
            />
            <button className="remove-btn" onClick={() => removeStat(index)}>
              ✕
            </button>
          </div>
        ))}
        <button className="add-btn" onClick={addStat}>
          + Добавить статистику
        </button>
      </div>

      <div className="editor-actions">
        <button
          className="save-btn"
          onClick={handleSave}
          disabled={saving || uploading}
        >
          {saving ? "Сохранение..." : "💾 Сохранить все изменения"}
        </button>
      </div>
    </div>
  );
};

export default AboutEditor;
