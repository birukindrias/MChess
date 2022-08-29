import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./pages/App";
import Game from "./pages/Game";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import ChooseTimeFormat from "./pages/ChooseTimeFormat";
import { UserProvider } from "./hooks/UserContext";
import ProfilePage from "./pages/ProfilePage";
import CreateOnlineGame from "./pages/CreateOnlineGame";
import OnlineGame from "./pages/OnlineGame";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Home />} />
            <Route path="game/offline" element={<Game running={true} />} />
            <Route path="game/:gameId" element={<OnlineGame />} />
            <Route path="tfChoose" element={<ChooseTimeFormat />} />
            <Route path="register" element={<Register />} />
            <Route path="login" element={<Login />} />
            <Route path="logout" element={<Logout />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="online" element={<CreateOnlineGame />} />
          </Route>
        </Routes>
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
