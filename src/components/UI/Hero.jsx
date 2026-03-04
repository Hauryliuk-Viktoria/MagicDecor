import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import heroBg from "../../assets/images/about/hero.jpg";

const Hero = () => {
  const [heroData, setHeroData] = useState({
    hero_title: "Создаем сказку для вашего праздника",
    hero_subtitle: "Оформление свадеб, юбилеев и фотозон под ключ",
    hero_image: "/images/hero/wedding-decor.jpg",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHeroData();
  }, []);

  const fetchHeroData = async () => {
    try {
      const { data, error } = await supabase
        .from("settings")
        .select("hero_title, hero_subtitle, hero_image")
        .eq("id", 1)
        .single();

      if (error) throw error;
      if (data) {
        setHeroData(data);
      }
    } catch (error) {
      console.error("Ошибка загрузки Hero данных:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="hero-loading">Загрузка...</div>;
  }

  return (
    <section className="hero">
      <div className="hero-background">
        <img
          src={heroData.hero_image}
          alt="Hero background"
          className="hero-bg-image"
          onError={(e) => {
            e.target.src = { heroBg };
          }}
        />
        <div className="hero-overlay"></div>
      </div>
      <div className="hero-content">
        <h1 className="hero-title">{heroData.hero_title}</h1>
        <p className="hero-subtitle">{heroData.hero_subtitle}</p>
        <div className="hero-buttons">
          <a href="#portfolio" className="btn btn-primary">
            Наши работы
          </a>
          <a href="#contacts" className="btn btn-secondary">
            Обсудить праздник
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
