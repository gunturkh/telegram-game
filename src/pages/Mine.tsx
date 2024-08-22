/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { Sheet } from "react-modal-sheet";
import toast, { Toaster } from "react-hot-toast";
import "../App.css";
import { dollarCoin, questionMark } from "../images";
import BottomTab from "../components/BottomTab";
import usePlayer from "../_hooks/usePlayer";
import Points from "../components/Points";
import Header from "../components/Header";
import Lock from "../icons/Lock";

const MinePage: React.FC = () => {
  type Card = {
    id: number;
    name: string;
    image: string | undefined;
    level: number;
    category_id: number;
    profit_per_hour: number;
    upgrade: {
      level: number;
      price: number;
      profit_per_hour: number;
      profit_per_hour_delta: number;
      is_available: boolean;
      condition: { id: number; level: number; name: string } | null;
    };
  };

  // const { token } = useAuthStore();
  // const [cards, setCards] = useState<ICard[]>([]);
  const {
    queryCards: { data: cardsData },
    mutationCardUpgrade: { mutate },
  } = usePlayer();
  // console.log("cardsData", cardsData);
  const { cards = [], categories = [] } = cardsData || {};
  // console.log("cards", cards);
  // console.log("categories", categories);
  // console.log('data', data)
  // const { data: cardsData } = data || {};
  // console.log("cardsData", cardsData);
  // const { cards, categories } = cardsData;
  // console.log("cards", cards);
  // console.log("categories", categories);
  // const [cardCategories, setCardCategories] = useState<string[]>([]);
  const [buyCardData, setBuyCardData] = useState<Card>({
    id: 0,
    name: "",
    image: "",
    level: 0,
    category_id: 0,
    profit_per_hour: 0,
    upgrade: {
      price: 0,
      level: 0,
      profit_per_hour: 0,
      profit_per_hour_delta: 0,
      is_available: false,
      condition: null,
    },
  });

  const [mineTab, setMineTab] = useState<number>(0);
  const [open, setOpen] = useState(false);

  // const [setDailyRewardTimeLeft] = useState("");
  const [, setDailyCipherTimeLeft] = useState("");
  // const [setDailyComboTimeLeft] = useState("");

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

  // useEffect(() => {
  //   // const cardCategories = cards.reduce((acc, currentValue) => {
  //   //   if (acc.includes(currentValue?.category?.name)) return acc
  //   //   else {
  //   //     acc.push(currentValue?.category?.name)
  //   //     return acc
  //   //   }
  //   // }, [])
  //   // const categories = cards?.reduce(
  //   //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //   //   (acc: any[], currentValue: { category: { name: any } }) => {
  //   //     const categoryName = currentValue?.category?.name;
  //   //     if (categoryName && !acc.includes(categoryName)) {
  //   //       acc.push(categoryName);
  //   //     }
  //   //     return acc;
  //   //   },
  //   //   [] as string[]
  //   // );
  //   const mappedCategories =
  //   setCardCategories();
  // }, [categories]);

  useEffect(() => {
    const updateCountdowns = () => {
      // setDailyRewardTimeLeft(calculateTimeLeft(0));
      setDailyCipherTimeLeft(calculateTimeLeft(19));
      // setDailyComboTimeLeft(calculateTimeLeft(12));
    };

    updateCountdowns();
    const interval = setInterval(updateCountdowns, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const formatCardsPriceInfo = (profit: number) => {
    if (profit >= 1000000000) return `${(profit / 1000000000).toFixed(2)}B`;
    if (profit >= 1000000) return `${(profit / 1000000).toFixed(2)}M`;
    if (profit >= 1000) return `${(profit / 1000).toFixed(2)}K`;
    return `${profit}`;
  };

  const handleUpgradeCard = async (cardId: number) => {
    try {
      mutate({ card_id: cardId });
      setOpen(false);
    } catch ({ error }: any) {
      console.log("error", error);
    }
  };
  console.log("open", open);

  return (
    <div className="bg-black flex justify-center">
      <div className="w-full bg-black text-white h-screen font-bold flex flex-col max-w-xl">
        <Header />

        <div className="flex-grow mt-4 bg-[#f3ba2f] rounded-t-[48px] relative top-glow z-0">
          <div className="absolute top-[2px] left-0 right-0 bottom-0 bg-[#1d2025] rounded-t-[46px] h-max">
            <div className="px-4 mt-6 flex justify-between gap-2">
              <div className="bg-[#272a2f] rounded-lg px-4 py-2 w-full relative">
                <img
                  src={questionMark}
                  alt="Daily Combo"
                  className="mx-auto w-12 h-12"
                />
              </div>
              <div className="bg-[#272a2f] rounded-lg px-4 py-2 w-full relative">
                <img
                  src={questionMark}
                  alt="Daily Combo"
                  className="mx-auto w-12 h-12"
                />
              </div>
              <div className="bg-[#272a2f] rounded-lg px-4 py-2 w-full relative">
                <img
                  src={questionMark}
                  alt="Daily Combo"
                  className="mx-auto w-12 h-12"
                />
              </div>
            </div>

            <Points />

            <div className="max-w-xl bg-[#272a2f] flex justify-around items-center z-50 rounded-3xl text-xs">
              {categories?.length > 0 ? (
                categories?.map((c: any, cIdx: number) => {
                  return (
                    <div
                      className={`text-center text-[#85827d] w-1/5 ${
                        mineTab === cIdx && "bg-[#1c1f24] m-1 p-2 rounded-2xl"
                      }`}
                      onClick={() => setMineTab(cIdx)}
                      key={c.name}
                    >
                      <p className="mt-1">{c.name}</p>
                    </div>
                  );
                })
              ) : (
                <div className="w-full m-1 p-4 rounded-2xl"></div>
              )}
            </div>
            <div className="flex flex-wrap flex-row mt-6 mb-40">
              {cards
                ?.filter(
                  (c: { category_id: number }) =>
                    c.category_id === categories?.[mineTab]?.id
                )
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .map((c: Card, cIdx: any) => {
                  return (
                    <div
                      key={`${categories[mineTab]?.name}-card-${cIdx}`}
                      className="w-1/2  rounded-xl p-1"
                      onClick={async () => {
                        if (c?.upgrade) {
                          console.log("card upgrade modal opened", c);
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
                          {!c?.upgrade?.is_available && (
                            <div className="w-16 h-16">
                              <div className="flex items-center justify-center rounded-xl bg-neutral-500/30 w-16 h-16">
                                <img
                                  src={c.image}
                                  className="absolute mx-auto w-10 h-10"
                                />
                                <Lock
                                  size={24}
                                  className="absolute text-[#43433b]"
                                  containerClassName="flex h-full justify-center items-center"
                                />
                              </div>
                            </div>
                          )}
                          {c?.upgrade?.is_available && (
                            <img src={c.image} className=" mx-auto w-12 h-12" />
                          )}
                          <div className="flex flex-col gap-1 ml-4">
                            <p className="text-xs font-normal flex-1">
                              {c.name}
                            </p>
                            <p className="text-xs text-neutral-400 font-thin">
                              Profit per hour
                            </p>
                            <div className="flex items-center space-x-1">
                              <img
                                src={dollarCoin}
                                alt="Dollar Coin"
                                className="w-3 h-3"
                              />
                              {c?.upgrade?.is_available && c?.level > 0 ? (
                                <p className="text-sm text-white">
                                  {formatCardsPriceInfo(c.profit_per_hour)}
                                </p>
                              ) : c?.upgrade?.is_available && c?.level === 0 ? (
                                <p className="text-sm text-neutral-500">
                                  +
                                  {formatCardsPriceInfo(
                                    c.upgrade?.profit_per_hour
                                  )}
                                </p>
                              ) : null}
                              {!c?.upgrade?.is_available && (
                                <p className="text-sm text-neutral-500">
                                  {formatCardsPriceInfo(
                                    c.upgrade?.profit_per_hour_delta
                                  )}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-row w-full items-center border-t-[0.5px] border-gray-500">
                          <p
                            className={`text-xs font-semibold p-4 border-r-[0.5px] border-gray-500 ${
                              c?.level > 0 ? "text-white" : "text-neutral-500"
                            }`}
                          >
                            lvl {c.level}
                          </p>
                          <div className="flex items-center space-x-1 flex-1 p-4">
                            <img
                              src={dollarCoin}
                              alt="Dollar Coin"
                              className="w-4 h-4"
                            />
                            <div className="text-md text-white">
                              {c.upgrade?.is_available && c?.upgrade?.price ? (
                                formatCardsPriceInfo(c?.upgrade?.price)
                              ) : (
                                <span className="text-xs font-thin">
                                  <p className="font-semibold">
                                    {c?.upgrade?.condition?.name}
                                  </p>{" "}
                                  lvl {c?.upgrade?.condition?.level}
                                </span>
                              )}
                            </div>
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
              style={{
                zIndex: open ? "9999999" : "-1",
                visibility: open ? "visible" : "hidden",
              }}
            >
              <Sheet.Container>
                <Sheet.Header className="bg-[#1d2025]">
                  <div className="w-full flex justify-end px-4">
                    <button
                      className="text-white text-lg font-bold"
                      onClick={() => setOpen(false)}
                    >
                      x
                    </button>
                  </div>
                </Sheet.Header>
                <Sheet.Content className="bg-[#1d2025] text-white">
                  {/* Your sheet content goes here */}
                  <div className="flex p-4 flex-col w-full justify-center items-center gap-5">
                    <img
                      src={buyCardData.image}
                      className="mx-auto w-12 h-12"
                    />
                    <h1 className="text-lg font-bold">
                      {buyCardData?.name ?? "-"}
                    </h1>
                    <div className="flex flex-col justify-center gap-1 items-center">
                      <p className="text-xs font-thin">Profit per hour</p>
                      <div className="flex items-center space-x-1">
                        <img
                          src={dollarCoin}
                          alt="Dollar Coin"
                          className="w-3 h-3"
                        />
                        <p className="text-xs text-white font-semibold">
                          +{" "}
                          {formatCardsPriceInfo(
                            buyCardData?.upgrade?.profit_per_hour_delta
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <img
                        src={dollarCoin}
                        alt="Dollar Coin"
                        className="w-6 h-6"
                      />
                      <p className="text-md font-bold text-white">
                        {buyCardData?.upgrade?.profit_per_hour
                          ? formatCardsPriceInfo(
                              buyCardData?.upgrade?.profit_per_hour
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
