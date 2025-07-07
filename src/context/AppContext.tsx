import React, { createContext, useState, ReactNode, useEffect } from "react";
import { OrderDetails } from "../utils/type";

interface AppContextProps {
  userInfo: any;
  saveUserInfo: (userData: any) => void;
  isLogin: boolean;
  saveIsLogin: (flag: boolean) => void;
  currentOrder: OrderDetails | null;
  setCurrentOrder: (order: OrderDetails | null) => void;
}

export const AppContext = createContext<AppContextProps>({
  userInfo: null,
  saveUserInfo: () => { },
  isLogin: false,
  saveIsLogin: () => { },
  currentOrder: null,
  setCurrentOrder: () => { },
});

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [userInfo, setUserInfo] = useState<any>(() => {
    const saved = localStorage.getItem("userInfo");
    return saved ? JSON.parse(saved) : null;
  });
  const [currentOrder, setCurrentOrderState] = useState<OrderDetails | null>(() => {
    const saved = localStorage.getItem("currentOrder");
    return saved ? JSON.parse(saved) : null;
  });
  const setCurrentOrder = (order: OrderDetails | null) => {
    setCurrentOrderState(order);
    if (order) {
      localStorage.setItem("currentOrder", JSON.stringify(order));
    } else {
      localStorage.removeItem("currentOrder");
    }
  };
  const saveUserInfo = (userData: any) => {
    setUserInfo(userData);
    localStorage.setItem("userInfo", JSON.stringify(userData));
  };

  const [isLogin, setIsLogin] = useState<boolean>(() => {
    const saved = localStorage.getItem("isLogin");
    return saved === "true";
  });

  const saveIsLogin = (flag: boolean) => {
    setIsLogin(flag);
    localStorage.setItem("isLogin", String(flag));
  };

  return (
    <AppContext.Provider
      value={{
        userInfo,
        saveUserInfo,
        isLogin,
        saveIsLogin,
        currentOrder,
        setCurrentOrder,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
