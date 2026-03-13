import { createContext, useContext, useEffect, useState } from "react";

const domain = import.meta.env.VITE_BACKEND_API_URL;
const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCurrentUser() {
      try {
        const res = await fetch(`${domain}/account/me`, {
          method: "POST",
          credentials: "include"
        });

        if (!res.ok) throw new Error("Nie udało się pobrać danych użytkownika");

        const data = await res.json();
        setCurrentUser(data);
      } catch (err) {
        console.error("Błąd pobierania użytkownika:", err);
      } finally {
        setLoading(false);
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