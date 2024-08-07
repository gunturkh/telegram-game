import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import MinePage from "./pages/Mine";
import { useAuthStore } from "./store/auth";
import WebApp from "@twa-dev/sdk";
import LoadingScreen from "./components/LoadingScreen";
import { __DEV__, API_URL } from "./utils/constants";
import usePlayer from "./_hooks/usePlayer";
// import { useQuery } from "@tanstack/react-query";
// import { serverAPI } from "./lib/axios";

const App: React.FC = () => {
  const {
    query: { data, isLoading },
  } = usePlayer();

  console.log("player data", data, isLoading);
  const { setAuthToken } = useAuthStore();
  const [loading, setLoading] = useState(false);
  console.log("env", import.meta.env.VITE_API_URL);

  useEffect(() => {
    const telegramData = __DEV__
      ? {
          id: 465670876,
          username: "gunturkh",
          first_name: "-",
          last_name: "-",
        }
      : WebApp?.initDataUnsafe?.user;
    const playerLogin = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            telegram_id: `${telegramData?.id}`,
            username: telegramData?.username,
            first_name: telegramData?.first_name,
            last_name: telegramData?.last_name,
          }),
        });
        const result = await response.json();
        console.log("result");
        if (result.status) {
          setLoading(false);
          console.log("login result", result.data);
          setAuthToken(result?.data?.token);
        }
        if (!result.status) {
          setLoading(false);
          console.log("login error", result.message);
        }
      } catch (error) {
        setLoading(false);
        console.log("login error", error);
      }
    };

    playerLogin();
  }, [setAuthToken]);

  // useEffect(() => {
  //   const getPlayerData = async () => {
  //     try {
  //       setLoading(true);
  //       const response = await fetch(`${API_URL}`, {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });
  //       const result = await response.json();
  //       console.log("result");
  //       if (result.status) {
  //         setLoading(false);
  //         console.log("getPlayerData result", result.data);
  //         setPlayerData(result.data);
  //       }
  //       if (!result.status) {
  //         setLoading(false);
  //         console.log("getPlayerData error", result.message);
  //       }
  //     } catch (error) {
  //       setLoading(false);
  //       console.log("getPlayerData error", error);
  //     }
  //   };
  //   if (token) getPlayerData();
  // }, [setPlayerData, token]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/mine" element={<MinePage />} />
      </Routes>
    </Router>
  );
};

export default App;
