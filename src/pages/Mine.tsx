/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { Sheet } from "react-modal-sheet";
import toast, { Toaster } from "react-hot-toast";
import "../App.css";
import { dailyCombo, dailyReward, dollarCoin } from "../images";
import BottomTab from "../components/BottomTab";
// import { useAuthStore } from "../store/auth";
// import { API_URL } from "../utils/constants";
// import { ICard } from "../utils/types";
// import Modal from "react-responsive-modal";
import usePlayer from "../_hooks/usePlayer";
import Points from "../components/Points";
import Header from "../components/Header";

const MinePage: React.FC = () => {
  const levelNames = [
    "Bronze", // From 0 to 4999 coins
    "Silver", // From 5000 coins to 24,999 coins
    "Gold", // From 25,000 coins to 99,999 coins
    "Platinum", // From 100,000 coins to 999,999 coins
    "Diamond", // From 1,000,000 coins to 2,000,000 coins
    "Epic", // From 2,000,000 coins to 10,000,000 coins
    "Legendary", // From 10,000,000 coins to 50,000,000 coins
    "Master", // From 50,000,000 coins to 100,000,000 coins
    "GrandMaster", // From 100,000,000 coins to 1,000,000,000 coins
    "Lord", // From 1,000,000,000 coins to ∞
  ];

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const levelMinPoints = [
    0, // Bronze
    5000, // Silver
    25000, // Gold
    100000, // Platinum
    1000000, // Diamond
    2000000, // Epic
    10000000, // Legendary
    50000000, // Master
    100000000, // GrandMaster
    1000000000, // Lord
  ];

  type Card = {
    id: number;
    icon_url: string | undefined;
    name: string;
    current: {
      profit_per_hour: number;
      level: number;
    };
    upgrade: { upgrade_price: number };
  };

  // const { token } = useAuthStore();
  // const [cards, setCards] = useState<ICard[]>([]);
  const {
    queryCards: { data: cards },
    mutationCardUpgrade: { mutate },
  } = usePlayer();
  const [cardCategories, setCardCategories] = useState<string[]>([]);
  const [buyCardData, setBuyCardData] = useState<Card>({
    id: 0,
    icon_url: "",
    name: "",
    upgrade: { upgrade_price: 0 },
    current: { profit_per_hour: 0, level: 0 },
  });

  const [levelIndex, setLevelIndex] = useState(6);
  const [points, setPoints] = useState(22749365);
  const profitPerHour = 126420;

  const [mineTab, setMineTab] = useState<number>(0);
  const [open, setOpen] = useState(false);

  // const onOpenModal = () => setOpen(true);
  // const onCloseModal = () => setOpen(false);

  const [dailyRewardTimeLeft, setDailyRewardTimeLeft] = useState("");
  const [, setDailyCipherTimeLeft] = useState("");
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
    // const cardCategories = cards.reduce((acc, currentValue) => {
    //   if (acc.includes(currentValue?.category?.name)) return acc
    //   else {
    //     acc.push(currentValue?.category?.name)
    //     return acc
    //   }
    // }, [])
    const categories = cards?.reduce(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (acc: any[], currentValue: { category: { name: any } }) => {
        const categoryName = currentValue?.category?.name;
        if (categoryName && !acc.includes(categoryName)) {
          acc.push(categoryName);
        }
        return acc;
      },
      [] as string[]
    );
    console.log("categories", categories);
    setCardCategories(categories);
  }, [cards]);

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
  //   const card = e.currentTarget;
  //   const rect = card.getBoundingClientRect();
  //   const x = e.clientX - rect.left - rect.width / 2;
  //   const y = e.clientY - rect.top - rect.height / 2;
  //   card.style.transform = `perspective(1000px) rotateX(${-y / 10}deg) rotateY(${x / 10}deg)`;
  //   setTimeout(() => {
  //     card.style.transform = '';
  //   }, 100);

  //   setPoints(points + pointsToAdd);
  //   setClicks([...clicks, { id: Date.now(), x: e.pageX, y: e.pageY }]);
  // };

  useEffect(() => {
    const currentLevelMin = levelMinPoints[levelIndex];
    const nextLevelMin = levelMinPoints[levelIndex + 1];
    if (points >= nextLevelMin && levelIndex < levelNames.length - 1) {
      setLevelIndex(levelIndex + 1);
    } else if (points < currentLevelMin && levelIndex > 0) {
      setLevelIndex(levelIndex - 1);
    }
  }, [points, levelIndex, levelMinPoints, levelNames.length]);

  const formatCardsPriceInfo = (profit: number) => {
    if (profit >= 1000000000) return `${(profit / 1000000000).toFixed(2)}B`;
    if (profit >= 1000000) return `${(profit / 1000000).toFixed(2)}M`;
    if (profit >= 1000) return `${(profit / 1000).toFixed(2)}K`;
    return `+${profit}`;
  };

  useEffect(() => {
    const pointsPerSecond = Math.floor(profitPerHour / 3600);
    const interval = setInterval(() => {
      setPoints((prevPoints) => prevPoints + pointsPerSecond);
    }, 1000);
    return () => clearInterval(interval);
  }, [profitPerHour]);

  const handleUpgradeCard = async (cardId: number) => {
    try {
      mutate({ card_id: cardId });

      setOpen(false);
      // toast.success(`Success: Buy ${cardId} `, {
      //   style: {
      //     borderRadius: "10px",
      //     background: "#333",
      //     color: "#fff",
      //   },
      // });
    } catch ({ error }: any) {
      console.log("error", error);
    }
  };

  return (
    <div className="bg-black flex justify-center">
      <div className="w-full bg-black text-white h-screen font-bold flex flex-col max-w-xl">
        <Header />

        <div className="flex-grow mt-4 bg-[#f3ba2f] rounded-t-[48px] relative top-glow z-0">
          <div className="absolute top-[2px] left-0 right-0 bottom-0 bg-[#1d2025] rounded-t-[46px] h-max">
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
                {/* <img src={dailyCipher} alt="Daily Cipher" className="mx-auto w-12 h-12" />
                <p className="text-[10px] text-center text-white mt-1">Daily cipher</p>
                <p className="text-[10px] font-medium text-center text-gray-400 mt-2">{dailyCipherTimeLeft}</p> */}
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

            <Points />

            {/* <div className="px-4 mt-4 flex justify-center">
              <div className="px-4 py-2 flex items-center space-x-2">
                <img src={dollarCoin} alt="Dollar Coin" className="w-10 h-10" />
                <p className="text-4xl text-white">{points.toLocaleString()}</p>
              </div>
            </div> */}

            <div className="max-w-xl bg-[#272a2f] flex justify-around items-center z-50 rounded-3xl text-xs">
              {cardCategories?.length > 0 ? (
                cardCategories?.map((c, cIdx) => {
                  return (
                    <div
                      className={`text-center text-[#85827d] w-1/5 ${
                        mineTab === cIdx && "bg-[#1c1f24] m-1 p-2 rounded-2xl"
                      }`}
                      onClick={() => setMineTab(cIdx)}
                    >
                      <p className="mt-1">{c}</p>
                    </div>
                  );
                })
              ) : (
                <div className="w-full m-1 p-4 rounded-2xl"></div>
              )}
            </div>
            {/* <Modal open={open} onClose={onCloseModal} center>
              <h2>Simple centered modal</h2>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
                pulvinar risus non risus hendrerit venenatis. Pellentesque sit
                amet hendrerit risus, sed porttitor quam.
              </p>
            </Modal> */}
            <div className="flex flex-wrap flex-row mt-6 mb-40">
              {cards
                ?.filter(
                  (c: { category: { name: string } }) =>
                    c.category.name === cardCategories?.[mineTab]
                )
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .map((c: Card, cIdx: any) => {
                  return (
                    <div
                      key={`${cardCategories[mineTab]}-card-${cIdx}`}
                      className="w-1/2  rounded-xl p-1"
                      onClick={() => {
                        if (c.upgrade) {
                          setOpen(true);
                          setBuyCardData(c);
                        } else
                          toast.error("Card not upgradable", {
                            style: {
                              borderRadius: "10px",
                              background: "#333",
                              color: "#fff",
                            },
                          });
                      }}
                    >
                      <div className="flex flex-col bg-[#272a2f] rounded-2xl h-full">
                        <div className="flex flex-row items-center p-3">
                          <img src={c.icon_url} className="mx-auto w-12 h-12" />
                          <div className="flex flex-col gap-1 ml-4">
                            <p className="text-xs font-normal flex-1">
                              {c.name}
                            </p>
                            <p className="text-xs font-thin">Profit per hour</p>
                            <div className="flex items-center space-x-1">
                              <img
                                src={dollarCoin}
                                alt="Dollar Coin"
                                className="w-3 h-3"
                              />
                              <p className="text-sm text-white">
                                {formatCardsPriceInfo(
                                  c.current.profit_per_hour
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-row w-full items-center border-t-[0.5px] border-gray-500">
                          <p className="text-xs font-semibold p-4 border-r-[0.5px] border-gray-500">
                            lvl {c.current.level}
                          </p>
                          <div className="flex items-center space-x-1 flex-1 p-4">
                            <img
                              src={dollarCoin}
                              alt="Dollar Coin"
                              className="w-4 h-4"
                            />
                            <p className="text-md text-white">
                              {c?.upgrade?.upgrade_price
                                ? formatCardsPriceInfo(
                                    c?.upgrade?.upgrade_price
                                  )
                                : ""}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
            {/* <div className="px-4 mt-4 flex justify-center">
              <div
                className="w-60 h-60 p-4 rounded-full circle-outer"
                onClick={handleCardClick}
              >
                <div className="w-full h-full rounded-full circle-inner">
                  <img src={mainCharacter} alt="Main Character" className="w-full h-full" />
                </div>
              </div>
            </div> */}
            <Sheet
              isOpen={open}
              snapPoints={[0.5]}
              initialSnap={0}
              disableDrag={false}
              onClose={() => setOpen(false)}
            >
              <Sheet.Container>
                <Sheet.Header className="bg-[#1d2025]" />
                <Sheet.Content className="bg-[#1d2025] text-white">
                  {/* Your sheet content goes here */}
                  <div className="flex p-4 flex-col w-full justify-center items-center gap-5">
                    <img
                      src={buyCardData.icon_url}
                      className="mx-auto w-12 h-12"
                    />
                    <h1>{buyCardData?.name ?? "-"}</h1>
                    <div className="flex items-center space-x-1">
                      <img
                        src={dollarCoin}
                        alt="Dollar Coin"
                        className="w-3 h-3"
                      />
                      <p className="text-sm text-white">
                        {formatCardsPriceInfo(
                          buyCardData.current.profit_per_hour
                        )}
                      </p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <img
                        src={dollarCoin}
                        alt="Dollar Coin"
                        className="w-6 h-6"
                      />
                      <p className="text-sm text-white">
                        {buyCardData?.upgrade?.upgrade_price
                          ? formatCardsPriceInfo(
                              buyCardData?.upgrade?.upgrade_price
                            )
                          : ""}
                      </p>
                    </div>
                    <button
                      className="flex-1 w-full bg-blue-500 rounded-lg px-4 py-2"
                      onClick={() => handleUpgradeCard(buyCardData.id)}
                    >
                      {" "}
                      Buy{" "}
                    </button>
                  </div>
                </Sheet.Content>
              </Sheet.Container>
              <Sheet.Backdrop onTap={() => setOpen(false)} />
            </Sheet>
          </div>
        </div>
      </div>

      <BottomTab />
      <Toaster position="top-left" />
    </div>
  );
};

export default MinePage;
