import React, { useState, useEffect, useRef } from "react";
import "../App.css";
import { dailyCombo, dailyReward, dollarCoin } from "../images";
import BottomTab from "../components/BottomTab";
import { usePlayerStore } from "../store/player";
import Points from "../components/Points";
import usePlayer from "../_hooks/usePlayer";
import Header from "../components/Header";
import { Sheet } from "react-modal-sheet";
import { useNavigate } from "react-router-dom";
import { calculateTimeLeft } from "../lib/utils";

const Home: React.FC = () => {
  const {
    query: { data: playerData, isLoading },
  } = usePlayer();
  const navigate = useNavigate();
  // console.log("player data from react query", playerData);
  // console.log("energy remaining", playerData?.tap_earnings?.available_taps);
  const {
    setPoints,
    energy: initialEnergy,
    passiveEarnModal,
    setPassiveEarnModal,
    passiveEarning,
    setTaps,
    clicks,
    setClicks,
    setClicksWhenAnimationEnd,
    // route,
  } = usePlayerStore();
  // console.log("clicks", clicks);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const intervalRef = useRef<any>(null); // useRef to store interval ID
  const [isPaused, setIsPaused] = useState(false);
  // const [taps, setTaps] = useState(0);
  // const [clicks, setClicks] = useState<{ id: number; x: number; y: number }[]>(
  //   []
  // );

  const [energy, setEnergy] = useState(
    initialEnergy
    // playerData?.tap_earnings?.available_taps
  );
  // console.log("energy", energy);
  const pointsToAdd = playerData?.tap_earnings?.per_tap;
  // const profitPerHour = playerData?.passive_earnings?.per_hour;

  const [dailyRewardTimeLeft, setDailyRewardTimeLeft] = useState("");
  const [, setDailyCipherTimeLeft] = useState("");
  const [dailyComboTimeLeft, setDailyComboTimeLeft] = useState("");

  // TODO: energy logic, maybe move to app.tsx
  useEffect(() => {
    setEnergy(playerData?.tap_earnings?.available_taps);
  }, [playerData?.tap_earnings?.available_taps]);

  useEffect(() => {
    const updateCountdowns = () => {
      setDailyRewardTimeLeft(calculateTimeLeft(17));
      setDailyCipherTimeLeft(calculateTimeLeft(19));
      setDailyComboTimeLeft(calculateTimeLeft(17));
    };

    updateCountdowns();
    const interval = setInterval(updateCountdowns, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

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
    if (intervalRef?.current) clearInterval(intervalRef?.current);
    if (energy > 0 && energy >= playerData?.tap_earnings?.per_tap) {
      for (let touch = 0; touch < e.touches.length; touch++) {
        const touchId = parseInt(`${Date.now()}${touch}`);
        // for (let touch = 0; touch < touches.length; touch++) {
        setIsPaused(true);
        setEnergy((prev: number) => (prev > 0 ? prev - pointsToAdd : 0));
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

        // console.log("setPoints ", points, pointsToAdd);
        setPoints(pointsToAdd);
        setTaps(1);
        if (!clicks.some((item: { id: number }) => item.id === touchId)) {
          setClicks({ id: touchId, x: pageX, y: pageY });
        }
      }
    }
  };

  const energyPercentage = (energy / playerData?.tap_earnings?.max_taps) * 100;
  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        setEnergy((prevEnergy: number) => {
          if (prevEnergy < playerData?.tap_earnings?.max_taps) {
            return (
              prevEnergy + (playerData?.tap_earnings?.recovery_per_seconds || 3)
            );
          }
          return prevEnergy;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [playerData, isPaused]);

  useEffect(() => {
    if (isPaused) {
      intervalRef.current = setInterval(() => {
        setEnergy((prevEnergy: number) => {
          if (prevEnergy < playerData?.tap_earnings?.max_taps) {
            return (
              prevEnergy + (playerData?.tap_earnings?.recovery_per_seconds || 3)
            );
          }
          return prevEnergy;
        });
      }, 1000);
      setIsPaused(false);
    }
  }, [energy]);

  const formatCardsPriceInfo = (profit: number) => {
    if (profit >= 1000000000) return `${(profit / 1000000000).toFixed(2)}B`;
    if (profit >= 1000000) return `${(profit / 1000000).toFixed(2)}M`;
    if (profit >= 1000) return `${(profit / 1000).toFixed(2)}K`;
    return `${profit}`;
  };

  if (isLoading) return null;
  return (
    <div className={`bg-black flex justify-center fixed w-full z-0`}>
      <>
        <div className="w-full bg-[#fff3b2] text-white h-screen font-bold flex flex-col max-w-xl">
          <Header />

          <div className="flex-grow mt-4 bg-[#451e0f] rounded-t-[48px] relative top-glow z-0">
            <div className="absolute top-[2px] left-0 right-0 bottom-0 bg-[#fff3b2] rounded-t-[46px]">
              <div className="px-4 mt-6 flex justify-between gap-2">
                <div
                  onClick={() => navigate("/earn")}
                  className="bg-[#451e0f] rounded-lg px-4 py-2 w-full relative"
                >
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
                {/* <div className="bg-[#272a2f] rounded-lg px-4 py-2 w-full relative">
                  <div className="dot"></div>
                  <img
                  src={dailyCipher}
                  alt="Daily Cipher"
                  className="mx-auto w-12 h-12"
                />
                <p className="text-[10px] text-center text-white mt-1">
                  Daily cipher
                </p>
                <p className="text-[10px] font-medium text-center text-gray-400 mt-2">
                  {dailyCipherTimeLeft}
                </p>
                </div> */}
                <div
                  onClick={() => navigate("/mine")}
                  className="bg-[#451e0f] rounded-lg px-4 py-2 w-full relative"
                >
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

              <Points />

              <div className="px-2 w-50 mt-auto flex flex-col items-center justify-center">
                <div
                  className="w-[14rem] h-[14rem] p-4 rounded-full circle-outer"
                  onTouchStart={handleCardClick}
                >
                  <div className="w-full h-full rounded-full circle-inner">
                    <img
                      src={playerData?.level?.current_level_image_url || ""}
                      alt={playerData?.level?.current_level_name || "Chipmunk"}
                      className="w-full h-full"
                    />
                    {/* <img src="https://drive.google.com/thumbnail?id=188oXT8FnUj1byookWrvnw2_W0uswTT8d&sz=w1000" alt="None"/> */}
                    {/* <img src="https://drive.google.com/file/d/188oXT8FnUj1byookWrvnw2_W0uswTT8d/view"/> */}
                  </div>
                </div>
                <div className="text-[#451e0f] px-4 w-full flex flex-col gap-2">
                  <div className="flex w-full items-center justify-between">
                    <span className="text-[15px]">Energy</span>
                    <span className="text-[15px] font-semibold">
                      {energy} / {playerData?.tap_earnings?.max_taps}
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
        </div>

        <Sheet
          isOpen={passiveEarnModal}
          snapPoints={[0.5]}
          initialSnap={0}
          disableDrag={false}
          onClose={() => passiveEarnModal(false)}
          style={{
            zIndex: passiveEarnModal ? "9999999" : "-1",
            visibility: passiveEarnModal ? "visible" : "hidden",
          }}
        >
          <Sheet.Container>
            <Sheet.Header className="bg-[#451e0f]">
              <div className="w-full flex justify-end px-4">
                <button
                  className="text-white text-lg font-bold"
                  onClick={() => setPassiveEarnModal(false)}
                >
                  x
                </button>
              </div>
            </Sheet.Header>
            <Sheet.Content className="bg-[#451e0f] text-white">
              {/* Your sheet content goes here */}
              <div className="flex flex-1 p-4 flex-col w-full justify-center items-center gap-5">
                <div className="flex flex-1 flex-col justify-center gap-1 items-center">
                  <p className="text-3xl font-bold">Passive Profit</p>
                  <div className="flex flex-1 items-center space-x-4">
                    <img
                      src={dollarCoin}
                      alt="Dollar Coin"
                      className="w-16 h-16"
                    />
                    <p className="text-3xl text-white font-semibold">
                      +{formatCardsPriceInfo(passiveEarning)}
                    </p>
                  </div>
                </div>
                <button
                  className="h-20 w-full bg-[#904728] rounded-lg px-4 py-2"
                  onClick={() => setPassiveEarnModal(false)}
                >
                  Thank you, Chipmunk
                </button>
              </div>
            </Sheet.Content>
          </Sheet.Container>
          <Sheet.Backdrop onTap={() => setPassiveEarnModal(false)} />
        </Sheet>
        <BottomTab />
        {clicks.map(
          (click: {
            id: React.Key | null | undefined;
            y: number;
            x: number;
          }) => (
            <div
              key={click.id}
              className="absolute text-3xl font-bold opacity-0 text-white pointer-events-none"
              style={{
                top: `${click.y - 42}px`,
                left: `${click.x - 28}px`,
                animation: `float 1s ease-out`,
              }}
              onAnimationEnd={() => {
                setClicksWhenAnimationEnd(
                  clicks.filter(
                    (c: { id: React.Key | null | undefined }) =>
                      c.id !== click.id
                  )
                );
              }}
            >
              +{pointsToAdd}
            </div>
          )
        )}
      </>
    </div>
  );
};

export default Home;
