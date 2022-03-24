import { Outlet } from "react-router-dom";
import "./assets/css/App.css";
import NavBar from "./NavBar";

function App() {
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
}

export default App;
