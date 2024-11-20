import React, {createContext, useState, useContext, useEffect} from "react";

const AuthContext = createContext();

const SESSION_TIMEOUT = 30*60*100;

export const AuthProvider = ({children}) =>{
    const initialAuthState = Boolean(sessionStorage.getItem("isAuthenticated"));
    const [isAuthenticated, setIsAuthenticated] = useState(initialAuthState);
    
    useEffect(()=>{
      const checkSession = () =>{
        const sessionStart = sessionStorage.getItem("sessionStart");
        if(sessionStart){
          const sessionAge = Date.now() - parseInt(sessionStart);
          if(sessionAge > SESSION_TIMEOUT){
            logout();
          }
          else{
            setIsAuthenticated(true);
          }
        }
      };

      const interval = setInterval(checkSession, 60000);

      const resetSession =()=>{
        sessionStorage.setItem("sessionStart", Date.now().toString());
      };

      document.addEventListener("click", resetSession);
      document.addEventListener("mousemove", resetSession);
      document.addEventListener("keypress", resetSession);

      return ()=> {
        clearInterval(interval);
        document.removeEventListener("click", resetSession);
        document.removeEventListener("mousemove", resetSession);
        document.removeEventListener("keypress", resetSession);
      };
    }, []);

    const login = () => {
        setIsAuthenticated(true);
        sessionStorage.setItem("isAuthenticated", "true");
        sessionStorage.setItem("sessionStart", Date.now().toString());
      };

      const logout = () => {
        setIsAuthenticated(false);
        sessionStorage.clear();
      };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
        {children}
      </AuthContext.Provider>
    );
};

export const useAuth = () =>useContext(AuthContext);