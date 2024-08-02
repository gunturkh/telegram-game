import React, { useState, useEffect } from "react";
import WebApp from "@twa-dev/sdk";
import "../App.css";
import Hamster from "../icons/Hamster";
import {
  binanceLogo,
  dailyCipher,
  dailyCombo,
  dailyReward,
  dollarCoin,
  mainCharacter,
} from "../images";
import Info from "../icons/Info";
import Settings from "../icons/Settings";
import BottomTab from "../components/BottomTab";
import { usePlayerStore } from "../store/player";
// import { useAuthStore } from '../store/auth';
// const API_URL = import.meta.env.VITE_API_URL
// const __DEV__ = import.meta.env.DEV
const Home: React.FC = () => {
  const levelNames = [
    "Baby", // From 0 to 4999 coins
    "Toddler", // From 5000 coins to 24,999 coins
    "Teen", // From 25,000 coins to 99,999 coins
    "Student", // From 100,000 coins to 999,999 coins
    "Scholar", // From 1,000,000 coins to 2,000,000 coins
    "Adult", // From 2,000,000 coins to 10,000,000 coins
    "Employee", // From 10,000,000 coins to 50,000,000 coins
    "Manager", // From 50,000,000 coins to 100,000,000 coins
    "General Manager", // From 100,000,000 coins to 1,000,000,000 coins
    "Businessman", // From 1,000,000,000 coins to 5,000,000,000
    "Chairman", // From 5,000,000,000 coins to ∞
  ];

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const levelMinPoints = [
    0, // Baby
    5000, // Toddler
    25000, // Teen
    100000, // Student
    1000000, // Scholar
    2000000, // Adult
    10000000, // Employee
    50000000, // Manager
    100000000, // General Manager
    1000000000, // Businessman
    5000000000, // Chairman
  ];

  const maxEnergy = 1000;

  // const { setToken, setAuthData } = useAuthStore()
  const { playerData } = usePlayerStore();
  console.log("playerData", playerData);
  const [levelIndex, setLevelIndex] = useState(0);
  const [points, setPoints] = useState(playerData?.point);
  const [clicks, setClicks] = useState<{ id: number; x: number; y: number }[]>(
    []
  );
  const [energy, setEnergy] = useState(maxEnergy);
  const pointsToAdd = playerData?.points_per_click;
  const profitPerHour = playerData?.profit_per_hour;

  const [dailyRewardTimeLeft, setDailyRewardTimeLeft] = useState("");
  const [dailyCipherTimeLeft, setDailyCipherTimeLeft] = useState("");
  const [dailyComboTimeLeft, setDailyComboTimeLeft] = useState("");

  const calculateTimeLeft = (targetHour: number) => {
    const now = new Date();
    const target = new Date(now);
    target.setUTCHours(targetHour, 0, 0, 0);

    if (now.getUTCHours() >= targetHour) {
      target.setUTCDate(target.getUTCDate() + 1);
    }

    const diff = target.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    const paddedHours = hours.toString().padStart(2, "0");
    const paddedMinutes = minutes.toString().padStart(2, "0");

    return `${paddedHours}:${paddedMinutes}`;
  };

  useEffect(() => {
    const updateCountdowns = () => {
      setDailyRewardTimeLeft(calculateTimeLeft(0));
      setDailyCipherTimeLeft(calculateTimeLeft(19));
      setDailyComboTimeLeft(calculateTimeLeft(12));
    };

    updateCountdowns();
    const interval = setInterval(updateCountdowns, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  // const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleCardClick = (e: any) => {
    console.log("e.touches.length", e?.touches.length);
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    // const touches = [
    //   {
    //     clientX: 205,
    //     clientY: 450,
    //     pageX: 205,
    //     pageY: 450,
    //   },
    //   {
    //     clientX: 280,
    //     clientY: 400,
    //     pageX: 280,
    //     pageY: 400,
    //   },
    //   {
    //     clientX: 200,
    //     clientY: 560,
    //     pageX: 200,
    //     pageY: 560,
    //   },
    // ]
    if (energy > 0) {
      for (let touch = 0; touch < e.touches.length; touch++) {
        const touchId = parseInt(`${Date.now()}${touch}`);
        // for (let touch = 0; touch < touches.length; touch++) {
        setEnergy((prev) => (prev > 0 ? prev - pointsToAdd : 0));
        // console.log('now', touch, parseInt(`${Date.now()}${touch}`))
        const { clientX, clientY, pageX, pageY } = e.touches[touch];
        // console.log('clientX, clientY', clientX, clientY)
        // const { clientX, clientY } = touches[touch];
        // console.log('pageX, pageY', pageX, pageY)
        const x = clientX - rect.left - rect.width / 2;
        const y = clientY - rect.top - rect.height / 2;
        card.style.transform = `perspective(1000px) rotateX(${
          -y / 10
        }deg) rotateY(${x / 10}deg)`;
        setTimeout(() => {
          card.style.transform = "";
        }, 100);

        setPoints((prev: number) => prev + pointsToAdd);
        if (!clicks.some((item) => item.id === touchId)) {
          setClicks((prev) => [...prev, { id: touchId, x: pageX, y: pageY }]);
        }
        // setClicks((prev)=> [...prev, { id: parseInt(`${Date.now()}${touch}`), x: touches[touch].pageX, y: touches[touch].pageY }]);
        // console.log('clicks', [...clicks, { id: parseInt(`${Date.now()}${touch}`), x: touches[touch].pageX, y: touches[touch].pageY }])
      }
    }
  };

  useEffect(() => {
    console.log("clicks", clicks);
  }, [clicks]);

  const handleAnimationEnd = (id: number) => {
    setClicks((prevClicks) => prevClicks.filter((click) => click.id !== id));
  };

  const calculateProgress = () => {
    if (levelIndex >= levelNames.length - 1) {
      return 100;
    }
    const currentLevelMin = levelMinPoints[levelIndex];
    const nextLevelMin = levelMinPoints[levelIndex + 1];
    const progress =
      ((points - currentLevelMin) / (nextLevelMin - currentLevelMin)) * 100;
    return Math.min(progress, 100);
  };

  // useEffect(() => {
  //   const currentLevelMin = levelMinPoints[levelIndex];
  //   const nextLevelMin = levelMinPoints[levelIndex + 1];
  //   if (points >= nextLevelMin && levelIndex < levelNames.length - 1) {
  //     setLevelIndex(levelIndex + 1);
  //   } else if (points < currentLevelMin && levelIndex > 0) {
  //     setLevelIndex(levelIndex - 1);
  //   }
  // }, [points, levelIndex, levelMinPoints, levelNames.length]);

  const formatProfitPerHour = (profit: number) => {
    if (profit >= 1000000000) return `+${(profit / 1000000000).toFixed(2)}B`;
    if (profit >= 1000000) return `+${(profit / 1000000).toFixed(2)}M`;
    if (profit >= 1000) return `+${(profit / 1000).toFixed(2)}K`;
    return `+${profit}`;
  };

  useEffect(() => {
    const pointsPerSecond = Math.floor(profitPerHour / 3600);
    const interval = setInterval(() => {
      setPoints((prevPoints: number) => prevPoints + pointsPerSecond);
    }, 1000);
    return () => clearInterval(interval);
  }, [profitPerHour]);

  const energyPercentage = (energy / maxEnergy) * 100;
  useEffect(() => {
    const interval = setInterval(() => {
      setEnergy((prevEnergy) => {
        if (prevEnergy < maxEnergy) {
          return prevEnergy + 1;
        }
        return prevEnergy;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-black flex justify-center">
      <div className="w-full bg-black text-white h-screen font-bold flex flex-col max-w-xl">
        <div className="px-4 z-10">
          <div className="flex items-center space-x-2 pt-4">
            <div className="p-1 rounded-lg bg-[#1d2025]">
              <Hamster size={24} className="text-[#d4d4d4]" />
            </div>
            <div
              onClick={() =>
                WebApp.showAlert(
                  `Telegram ID: ${WebApp?.initDataUnsafe?.user?.id}, Username: ${WebApp?.initDataUnsafe?.user?.username}, First Name: ${WebApp?.initDataUnsafe?.user?.first_name}, Last Name: ${WebApp?.initDataUnsafe?.user?.last_name}`
                )
              }
            >
              <p className="text-sm">
                {WebApp?.initDataUnsafe?.user?.username} (CEO)
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between space-x-4 mt-1">
            <div className="flex items-center w-1/3">
              <div className="w-full">
                <div className="flex justify-between">
                  <p className="text-sm">
                    {levelNames[playerData?.level?.current_level]}
                  </p>
                  <p className="text-sm">
                    {playerData?.level?.current_level}{" "}
                    <span className="text-[#95908a]">
                      / {levelNames.length}
                    </span>
                  </p>
                </div>
                <div className="flex items-center mt-1 border-2 border-[#43433b] rounded-full">
                  <div className="w-full h-2 bg-[#43433b]/[0.6] rounded-full">
                    <div
                      className="progress-gradient h-2 rounded-full"
                      // style={{ width: `${calculateProgress()}%` }}
                      style={{
                        width: `${playerData?.level?.next_level_percentage}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center w-2/3 border-2 border-[#43433b] rounded-full px-4 py-[2px] bg-[#43433b]/[0.6] max-w-64">
              <img src={binanceLogo} alt="Exchange" className="w-8 h-8" />
              <div className="h-[32px] w-[2px] bg-[#43433b] mx-2"></div>
              <div className="flex-1 text-center">
                <p className="text-xs text-[#85827d] font-medium">
                  Hourly Profit
                </p>
                <div className="flex items-center justify-center space-x-1">
                  <img
                    src={dollarCoin}
                    alt="Dollar Coin"
                    className="w-[18px] h-[18px]"
                  />
                  <p className="text-sm">
                    {formatProfitPerHour(profitPerHour)}
                  </p>
                  <Info size={20} className="text-[#43433b]" />
                </div>
              </div>
              <div className="h-[32px] w-[2px] bg-[#43433b] mx-2"></div>
              <Settings className="text-white" />
            </div>
          </div>
        </div>

        <div className="flex-grow mt-4 bg-[#f3ba2f] rounded-t-[48px] relative top-glow z-0">
          <div className="absolute top-[2px] left-0 right-0 bottom-0 bg-[#1d2025] rounded-t-[46px]">
            <div className="px-4 mt-6 flex justify-between gap-2">
              <div className="bg-[#272a2f] rounded-lg px-4 py-2 w-full relative">
                <div className="dot"></div>
                <img
                  src={dailyReward}
                  alt="Daily Reward"
                  className="mx-auto w-12 h-12"
                />
                <p className="text-[10px] text-center text-white mt-1">
                  Daily reward
                </p>
                <p className="text-[10px] font-medium text-center text-gray-400 mt-2">
                  {dailyRewardTimeLeft}
                </p>
              </div>
              <div className="bg-[#272a2f] rounded-lg px-4 py-2 w-full relative">
                <div className="dot"></div>
                {/* <img
                  src={dailyCipher}
                  alt="Daily Cipher"
                  className="mx-auto w-12 h-12"
                />
                <p className="text-[10px] text-center text-white mt-1">
                  Daily cipher
                </p>
                <p className="text-[10px] font-medium text-center text-gray-400 mt-2">
                  {dailyCipherTimeLeft}
                </p> */}
              </div>
              <div className="bg-[#272a2f] rounded-lg px-4 py-2 w-full relative">
                <div className="dot"></div>
                <img
                  src={dailyCombo}
                  alt="Daily Combo"
                  className="mx-auto w-12 h-12"
                />
                <p className="text-[10px] text-center text-white mt-1">
                  Daily combo
                </p>
                <p className="text-[10px] font-medium text-center text-gray-400 mt-2">
                  {dailyComboTimeLeft}
                </p>
              </div>
            </div>

            <div className="px-4 mt-4 flex justify-center">
              <div className="px-4 py-2 flex items-center space-x-2">
                <img src={dollarCoin} alt="Dollar Coin" className="w-10 h-10" />
                <p className="text-4xl text-white">
                  {points?.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="px-4 mt-4 flex justify-center">
              <div
                className="w-60 h-60 p-4 rounded-full circle-outer"
                onTouchStart={handleCardClick}
              >
                <div className="w-full h-full rounded-full circle-inner">
                  <img
                    src={mainCharacter}
                    alt="Main Character"
                    className="w-full h-full"
                  />
                  {/* <img src="https://drive.google.com/thumbnail?id=188oXT8FnUj1byookWrvnw2_W0uswTT8d&sz=w1000" alt="None"/> */}
                  {/* <img src="https://drive.google.com/file/d/188oXT8FnUj1byookWrvnw2_W0uswTT8d/view"/> */}
                </div>
              </div>
            </div>
            <div className="px-4 w-full flex flex-col gap-2">
              <div className="flex w-full items-center justify-between">
                <span className="text-[15px]">Energy</span>
                <span className="text-[15px] font-semibold">
                  {energy} / {maxEnergy}
                </span>
              </div>
              <div className="w-full relative rounded-full h-[16px] bg-[#012237] border border-[#073755]">
                <div
                  className="absolute left-0 h-full rounded-full bg-gradient-to-r from-[#dc7b0c] to-[#fff973]"
                  style={{ width: `${energyPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BottomTab />

      {clicks.map((click) => (
        <div
          key={click.id}
          className="absolute text-3xl font-bold opacity-0 text-white pointer-events-none"
          style={{
            top: `${click.y - 42}px`,
            left: `${click.x - 28}px`,
            animation: `float 1s ease-out`,
          }}
          onAnimationEnd={() => handleAnimationEnd(click.id)}
        >
          +{pointsToAdd}
        </div>
      ))}
    </div>
  );
};

export default Home;
