import { createContext, useEffect, useState } from "react";
import {
  getUserByIdRequest,
  signInRequest,
  signUpRequest,
  verifyTokenRequest,
} from "../../api/auth";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

export const userContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [alerts, setAlerts] = useState({ error: "", success: "" });
  const navigate = useNavigate();

  async function signUpSeller(data) {
    try {
      const res = await signUpRequest(data);
      if (res.data.message) {
        setAlerts({ ...alerts, success: res.data.message });
        navigate('/signIn')
      }
    } catch (error) {
      setAlerts({ ...alerts, error: error.response.data.error });
    }
  }
  async function signUpBuyer(data) {
    try {
      const res = await signUpRequest(data);
      if (res.data.message) {
        setAlerts({ ...alerts, success: res.data.message });
      }
    } catch (error) {
      setAlerts({ ...alerts, error: error.response.data.error });
    }
  }
  async function signIn(data) {
    try {
      const res = await signInRequest(data);
      if (res.data.user.role === 'comprador') {
        navigate("/");
      }else if(res.data.user.role === 'vendedor') {
        navigate('/dashboardSeller')
      }
      setIsAuth(true)
    } catch (error) {
      setAlerts({ ...alerts, error: error.response.data.error });
    }
  }
  async function getUserById(id){
    try {
      const res = await getUserByIdRequest(id)
      setUserData(res.data.user)
      // console.log(res.data.user)
      setIsLoading(false)
    } catch (error) {
      console.log('a ocurrido el siguiente error', error.response.data.error)
    }
  }
  function logout() {
    Cookies.remove("token");
    setIsAuth(false);
    setUserData(null);
    setIsLoading(false);
    navigate('/signIn')
  }

  useEffect(() => {
    async function checkLogin() {
      const token = Cookies.get("token");
      if (!token) {
        setIsAuth(false);
        setIsLoading(false);
      } else {
        try {
          const res = await verifyTokenRequest(token);
          if (res.data) {
            setIsAuth(true);
            setUserData(res.data.user);
          } else {
            setIsAuth(false);
            setUserData(null);
          }
        } catch (error) {
          setIsAuth(false);
          setUserData(null);
        } finally {
          setIsLoading(false);  // Que SOLO se ponga en false al final
        }
      }
    }
    checkLogin();
  }, []);
  return (
    <userContext.Provider
      value={{
        signUpSeller,
        signUpBuyer,
        signIn,
        getUserById,
        logout,
        isAuth,
        userData,
        isLoading,
        alerts,
        setAlerts
      }}
    >
      {children}
    </userContext.Provider>
  );
};
