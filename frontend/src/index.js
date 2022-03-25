import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Game from "./Game";
import Home from "./Home";
import ChooseTimeFormat from "./ChooseTimeFormat";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="game" element={<Game running={true} />} />
          <Route path="tfChoose" element={<ChooseTimeFormat />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
