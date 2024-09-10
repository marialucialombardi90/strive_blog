import { useState, createContext, useEffect } from "react";
import { me } from "../data/fetch.js";

export const AuthContext = createContext();

export default function AuthContextProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [authorInfo, setAuthorInfo] = useState();
  const getMe = async () => {
    try {
      const meInfo = await me();
      setAuthorInfo(meInfo);
    } catch (error) {
      if (error.message === "401") {
        localStorage.removeItem("token");
        setToken(null);
      }
    }
  };
  useEffect(() => {
    if (token) getMe(); //la me vuole come auth il token, quindi senza il token si rompe il backend
  }, [token]);
  const value = { token, setToken, authorInfo, setAuthorInfo };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
