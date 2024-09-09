import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import MinePage from "./pages/Mine";
import { useAuthStore } from "./store/auth";
import WebApp from "@twa-dev/sdk";
import LoadingScreen from "./components/LoadingScreen";
import { __DEV__, API_URL } from "./utils/constants";
import FriendsPage from "./pages/Friends";
import EarnPage from "./pages/Earn";
import { usePlayerStore } from "./store/player";
import { qr } from "./images";
import { useDebounce } from "@uidotdev/usehooks";
import usePlayer from "./_hooks/usePlayer";
import LevelPage from "./pages/Level";
import { useQueryClient } from "@tanstack/react-query";

const App: React.FC = () => {
  const { setAuthToken } = useAuthStore();
  const { setPassiveEarnModal, taps, resetTaps } = usePlayerStore();
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const {
    mutationTap: { mutateAsync },
  } = usePlayer();
  // console.log("WebApp", WebApp.platform);
  useEffect(() => {
    queryClient.refetchQueries({ queryKey: ["player"], type: "active" });
    setTimeout(() => {
      setLoading(false);
    }, 5000);
  }, []);

  useEffect(() => {
    const telegramData = __DEV__
      ? {
          id: 465670876,
          username: "gunturkh",
          first_name: "-",
          last_name: "-",
          // id: 769049677,
          // username: "tatangdev",
          // first_name: "Tatang",
          // last_name: "",
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
            ...(WebApp?.initDataUnsafe?.start_param && {
              referral_code: WebApp?.initDataUnsafe?.start_param,
            }),
          }),
        });
        const result = await response.json();
        // console.log("result");
        if (result.status) {
          // setLoading(false);
          // console.log("login result", result.data);
          setAuthToken(result?.data?.token);
          setPassiveEarnModal(true);
        }
        if (!result.status) {
          // setLoading(false);
          // console.log("login error", result.message);
        }
      } catch (error) {
        // setLoading(false);
        // console.log("login error", error);
      }
    };

    playerLogin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setAuthToken]);
  const debouncedTaps = useDebounce(taps, 500);
  useEffect(() => {
    if (WebApp) WebApp.expand();
  }, [WebApp]);

  useEffect(() => {
    const sync = async () => {
      if (debouncedTaps) {
        const data = await mutateAsync({
          tap_count: taps,
          timestamp: Math.floor(Date.now() / 1000),
        });
        // console.log("tapsdata", data);
        if (data) {
          resetTaps();
          // resetClicks();
        }
      }
    };
    sync();
  }, [debouncedTaps, mutateAsync]);
  if (
    WebApp &&
    (WebApp.platform === "macos" ||
      WebApp.platform === "tdesktop" ||
      WebApp.platform === "unigram" ||
      WebApp.platform === "weba" ||
      WebApp.platform === "webk" ||
      WebApp.platform === "unknown") &&
    !__DEV__
  ) {
    return (
      <img src={qr} alt="Loading" className="w-full h-screen object-cover " />
    );
  }
  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/mine" element={<MinePage />} />
        <Route path="/friends" element={<FriendsPage />} />
        <Route path="/earn" element={<EarnPage />} />
        <Route path="/level" element={<LevelPage />} />
      </Routes>
      <Home />
    </Router>
  );
};

export default App;
