import { createContext, useState, useContext } from "react";

const AuthContext = createContext({
  currentUser: null,
  token: null,
  setCurrentUser: () => {},
  setToken: () => {}
});

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [token, _setToken] = useState(localStorage.getItem("ACCESS_TOKEN"))

  const setToken = (token) => {
    _setToken(token)
    if (token) {
      localStorage.setItem("ACCESS_TOKEN", token)
    } else {
      localStorage.removeItem("ACCESS_TOKEN")
    }
  };

  const value = {
    currentUser,
    token,
    setCurrentUser,
    setToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
    return useContext(AuthContext)
}