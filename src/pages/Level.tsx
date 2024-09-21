import {
  dollarCoin,
  baby,
  toddler,
  student,
  scholar,
  adult,
  employee,
  manager,
  generalmanager,
  businessman,
  chairman,
  rightarrow,
  leftarrow,
} from "../images";
import { balanceFormatter, kFormatter, numberWithDots } from "../lib/utils";
import { Slide } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import http from "../lib/axios";
import { AxiosError } from "axios";
import usePlayer from "../_hooks/usePlayer";
import LoadingScreen from "../components/LoadingScreen";

const divStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundSize: "contain",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center center",
  height: "200px",
};
const slideImages = [
  {
    url: baby,
  },
  {
    url: toddler,
  },
  {
    url: student,
  },
  {
    url: scholar,
  },
  {
    url: adult,
  },
  {
    url: employee,
  },
  {
    url: manager,
  },
  {
    url: generalmanager,
  },
  {
    url: businessman,
  },
  {
    url: chairman,
  },
];

// const LEVELS = [
//   "Baby",
//   "Toddler",
//   "Student",
//   "Scholar",
//   "Adult",
//   "Employee",
//   "Manager",
//   "General Manager",
//   "Businessman",
//   "Chairman",
// ];
const LevelPage = () => {
  // const {
  //   queryRank: { data: rank },
  // } = usePlayer();
  // console.log("rank", rank);
  const {
    query: { data: playerData, isLoading: playerIsLoading },
  } = usePlayer();
  console.log("player", playerData);
  const [index, setIndex] = useState<number>(
    playerData?.level?.current_level - 1
  );

  const {
    data: rank,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["rank", index],
    queryFn: async () => {
      try {
        const response = await http.get(
          `/rank${index >= 0 ? `?level=${index + 1}` : ""}`
        );
        setIndex(response?.data?.data?.level - 1);
        return response.data?.data;
      } catch (error) {
        if (error instanceof AxiosError) {
          throw new Error("Axios Error");
        }

        throw new Error("Unknown Error");
      }
    },
  });
  console.log("index", index);
  // console.log("referral stats", data);
  return (
    <div className="bg-[#212121] flex flex-col justify-start min-h-screen h-100% font-figtree">
      {playerIsLoading ? (
        <LoadingScreen />
      ) : (
        <div className="p-6">
          <Slide
            defaultIndex={index as number}
            transitionDuration={200}
            onChange={(from, to) => {
              console.log("slide from: ", from, "to: ", to);
              setIndex(to);
            }}
            nextArrow={<img src={rightarrow} alt="Next" className="w-8 h-8" />}
            prevArrow={
              <img src={leftarrow} alt="Previous" className="w-8 h-8" />
            }
          >
            {slideImages.map((item, i) => (
              <div key={`rank-${rank?.level_name}-${i}`}>
                <div
                  style={{
                    ...divStyle,
                    backgroundImage: `url(${item.url})`,
                  }}
                ></div>
              </div>
            ))}
          </Slide>
          <div className="flex flex-col justify-center items-center py-1 gap-4">
            <div className="flex flex-col justify-center items-center text-center p-8 gap-4">
              <div className="flex flex-col ">
                <div className="text-lg font-bold text-[#e8af00]">
                  {rank?.level_name}
                </div>
                <div className="text-md font-medium text-white">
                  Spending From {numberWithDots(rank?.level_minimum_score)}
                </div>
                {rank?.my_rank && (
                  <span className="text-md font-medium text-white">
                    My rank:{" "}
                    <span className="text-[#e8af00] font-bold">
                      {rank?.my_rank}
                    </span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="bg-[#151515] h-screen flex flex-col">
        <div className="border-t-2 w-5/6 mx-auto border-[#e8af00] sticky top-0 z-10"></div>
        <div className="overflow-y-auto overflow-x-hidden no-scrollbar flex-grow">
          {isLoading || isFetching ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#e8af00]"></div>
              <span className="ml-3 text-[#e8af00] text-md font-semibold">Loading...</span>
            </div>
          ) : (
            <>
              {rank?.top_users?.length > 0 && (
                <div className="flex flex-col justify-start items-start text-[#e8af00] px-8 py-2 mt-8">
                  <div className="text-md font-semibold">Rank</div>
                </div>
              )}
              <div className="flex flex-col justify-center items-center text-white px-8 gap-4 mb-[500px] overflow-y-auto overflow-x-hidden no-scrollbar">
                {rank &&
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  rank?.top_users?.map((s: any) => {
                    return (
                      <div className="w-full justify-between flex gap-2 bg-[#303030] border border-[#b7b7b7] rounded-2xl p-2 mx-4 ">
                        <div className="flex flex-col px-2 ">
                          <div className="text-sm font-bold">{`${s.first_name} ${s.last_name}`}</div>
                          <div className="flex justify-start items-center gap-1">
                            {/* <div className="text-xs font-thin">{` ${
                        LEVELS[s.level - 1]
                      } : `}</div>{" "} */}
                            <img
                              src={dollarCoin}
                              alt="Dollar Coin"
                              className="w-[12px] h-[12px]"
                            />
                            <div className="text-xs flex items-center gap-2">
                              <p className="text-yellow-400 font-semibold">
                                {kFormatter(s.passive_per_hour)}
                              </p>
                              <p className="text-neutral-500">
                                ({balanceFormatter(s.spending_amount)})
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="text-2xl flex items-center gap-2 mr-3">
                          {/* <img src={dollarCoin} alt="Dollar Coin" className="w-5 h-5" /> */}
                          <p className="text-yellow-400 font-semibold">
                            {s.rank}
                          </p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LevelPage;
