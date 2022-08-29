import { useContext } from "react";
import { UserContext, UserProvider } from "./UserContext";

export default function useAuth() {
  return useContext(UserContext);
}
