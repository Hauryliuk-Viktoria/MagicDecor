import React from "react";
import Header from "./components/UI/Header";
import Hero from "./components/UI/Hero";
import About from "./components/About/About";
import InfiniteGallery from "./components/Gallery/InfiniteGallery";
import Contacts from "./components/Contacts/Contacts";
import Footer from "./components/UI/Footer";
import "./styles/global.css";

function App() {
  return (
    <div className="app">
      <Header />
      <main>
        <Hero />
        <About />
        <InfiniteGallery />
        <Contacts />
      </main>
      <Footer />
    </div>
  );
}

export default App;
