import React, { useContext } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Game from "./Game";
import Home from "./Home";
import Register from "./Register";
import Login from "./Login";
import Logout from "./Logout";
import ChooseTimeFormat from "./ChooseTimeFormat";
import { UserProvider } from "./UserContext";
import ProfilePage from "./ProfilePage";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Home />} />
            <Route path="game" element={<Game running={true} />} />
            <Route path="tfChoose" element={<ChooseTimeFormat />} />
            <Route path="register" element={<Register />} />
            <Route path="login" element={<Login />} />
            <Route path="logout" element={<Logout />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
        </Routes>
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
