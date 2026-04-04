import { createContext, useContext, useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

const domain = import.meta.env.VITE_BACKEND_API_URL;
const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCurrentUser() {
      try {
        const res = await fetch(`${domain}/account/me`, {
          method: "POST",
          credentials: "include"
        });

        if (!res.ok) {
          if (res.status == 404) {
            console.log("No user found");
            logout();
          } else if (res.status == 409) {
            console.log("No username found");
            navigate("/set-username");
          } else {
            console.log("Unexpected error");
            logout();
          }
        } else {
          const data = await res.json();
          setCurrentUser(data);
          setLoading(false);
        }
      } catch (err) {
        console.error("Błąd pobierania użytkownika:", err);
      }
    }

    fetchCurrentUser();
  }, []);

  return (
    <UserContext.Provider value={{ currentUser, userLoading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useCurrentUser() {
  return useContext(UserContext);
}