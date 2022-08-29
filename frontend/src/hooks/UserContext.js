import { createContext, useEffect, useState } from "react";

export const UserContext = createContext({});

export function UserProvider(props) {
  const [token, setToken] = useState(localStorage.getItem("chessUserToken"));
  const [user, setUser] = useState({});

  useEffect(() => {
    fetch("/api/me/", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      if (response.ok) {
        response.json().then((response) => {
          setUser(response);
        });
      } else {
        setUser("");
      }
    });
  }, [token]);

  return (
    <UserContext.Provider value={{ user, token, setToken }}>
      {props.children}
    </UserContext.Provider>
  );
}
