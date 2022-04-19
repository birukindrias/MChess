import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import useAuth from "./useAuth";

export default function Logout() {
  const { setToken } = useAuth();

  useEffect(() => {
    setToken("");
    localStorage.clear();
  }, []);

  return <Navigate to="/" replace={true} />;
}
