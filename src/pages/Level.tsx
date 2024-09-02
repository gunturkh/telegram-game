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
    <div className="bg-[#fff3b2] flex flex-col justify-start min-h-screen h-100%">
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
          <div className="flex flex-col justify-center items-center text-[#451e0f] py-1 gap-4">
            <div className="flex flex-col justify-center items-center text-center p-8 gap-4">
              <div className="flex flex-col ">
                <div className="text-md font-bold">{rank?.level_name}</div>
                <div className="text-md font-bold">
                  Spending From {numberWithDots(rank?.level_minimum_score)}
                </div>
                {rank?.my_rank && (
                  <div className="text-md font-bold">
                    My rank: {rank?.my_rank}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {isLoading || isFetching ? (
        <div className="text-md font-semibold px-8">Loading...</div>
      ) : (
        <>
          {rank?.top_users?.length > 0 && (
            <div className="flex flex-col justify-start items-start text-[#451e0f] px-8 py-2">
              <div className="text-md font-semibold">Rank</div>
            </div>
          )}
          <div className="flex flex-col justify-center items-center text-white px-8 gap-4 mb-40">
            {rank &&
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              rank?.top_users?.map((s: any) => {
                return (
                  <div className="w-full justify-between flex gap-2 bg-[#451e0f] rounded-md p-2 mx-4 ">
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
                    <div className="text-lg flex items-center gap-2">
                      {/* <img src={dollarCoin} alt="Dollar Coin" className="w-5 h-5" /> */}
                      <p className="text-yellow-400 font-semibold">{s.rank}</p>
                    </div>
                  </div>
                );
              })}
          </div>
        </>
      )}
    </div>
  );
};

export default LevelPage;
