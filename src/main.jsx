import React from "react";
import ReactDOM from "react-dom/client";
import Root from "./App.jsx"; // Теперь импортируем Root, а не App
import "./styles/global.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
);
