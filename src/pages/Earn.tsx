import { Toaster } from "react-hot-toast";
import BottomTab from "../components/BottomTab";
import {
  calendar,
  dollarCoin,
  // gift
} from "../images";
import usePlayer from "../_hooks/usePlayer";
import { Sheet } from "react-modal-sheet";
import { useMemo, useState } from "react";
import { kFormatter } from "../lib/utils";

const EarnPage = () => {
  const {
    queryTasks: { data },
    mutationCheckTask: { mutate },
  } = usePlayer();
  const [open, setOpen] = useState(false);
  console.log("tasks", data);
  const dailyReward = useMemo(
    () => data?.filter((d) => d.id === "daily_streak")?.[0],
    [data]
  );
  // const dummy = {
  //   id: "daily_streak",
  //   name: "Daily Reward",
  //   description: null,
  //   total_reward_coins: 6649000,
  //   rewards_by_day: [
  //     {
  //       day_count: 1,
  //       reward_amount: 500,
  //     },
  //     {
  //       day_count: 2,
  //       reward_amount: 1000,
  //     },
  //     {
  //       day_count: 3,
  //       reward_amount: 2500,
  //     },
  //     {
  //       day_count: 4,
  //       reward_amount: 5000,
  //     },
  //     {
  //       day_count: 5,
  //       reward_amount: 15000,
  //     },
  //     {
  //       day_count: 6,
  //       reward_amount: 25000,
  //     },
  //     {
  //       day_count: 7,
  //       reward_amount: 100000,
  //     },
  //     {
  //       day_count: 8,
  //       reward_amount: 500000,
  //     },
  //     {
  //       day_count: 9,
  //       reward_amount: 1000000,
  //     },
  //     {
  //       day_count: 10,
  //       reward_amount: 5000000,
  //     },
  //   ],
  //   reward_coins: 500,
  //   remain_seconds: 6032,
  //   days: 2,
  //   is_completed: false,
  // };

  console.log("dailyReward", dailyReward);

  const claimedStyle = (index: number, days: number, is_completed: boolean) => {
    console.log("is_completed", is_completed);
    if (index + 1 < days) return " border-green-400 opacity-100 bg-green-800";
    if (index + 1 === days) {
      if (is_completed) return "border-green-400 opacity-100 bg-green-800";
      return "border-yellow-400 opacity-100";
    }
    return "opacity-20";
  };
  return (
    <div className="bg-black flex flex-col justify-start min-h-screen h-100%">
      <div className="flex flex-col justify-center items-center text-white py-8 gap-4">
        <img src={dollarCoin} alt="Dollar Coin" className="w-50 h-50" />
        <div className="text-4xl font-bold">Earn more coins</div>
        <div className="text-md font-light">
          You and your friends will receive bonuses
        </div>
      </div>

      <div className="px-4 text-white text-md font-semibold">Daily Tasks</div>

      <div
        onClick={() => setOpen(true)}
        className="flex flex-col justify-center items-center text-white p-4 gap-4"
      >
        <div className="w-full flex gap-2 bg-[#272a2f] rounded-md p-2 mx-4 ">
          <img
            src={calendar}
            alt="Referral Gift"
            className="mx-auto w-12 h-12"
          />
          <div className="flex flex-col ">
            <div className="text-md font-bold">Daily Reward</div>
            <div className="flex justify-start items-center gap-1">
              <img
                src={dollarCoin}
                alt="Dollar Coin"
                className="w-[12px] h-[12px]"
              />
              <div className="text-xs flex items-center gap-2">
                <p className="text-yellow-400 font-semibold">+5,000</p>
                for you and your friends
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="px-4 text-white text-md font-semibold">Tasks list</div>

      <div className="flex flex-col justify-center items-center text-white p-4 gap-4">
        <div className="w-full flex gap-2 bg-[#272a2f] rounded-md p-2 mx-4 ">
          <img src={gift} alt="Referral Gift" className="mx-auto w-12 h-12" />
          <div className="flex flex-col ">
            <div className="text-md font-bold">Invite a friend</div>
            <div className="flex justify-start items-center gap-1">
              <img
                src={dollarCoin}
                alt="Dollar Coin"
                className="w-[12px] h-[12px]"
              />
              <div className="text-xs flex items-center gap-2">
                <p className="text-yellow-400 font-semibold">+5,000</p>
                for you and your friends
              </div>
            </div>
          </div>
        </div>
      </div> */}

      <BottomTab />
      <Toaster position="top-left" />
      <Sheet
        isOpen={open}
        // snapPoints={[0.5]}
        // initialSnap={0}
        // disableDrag={false}
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
          <Sheet.Content className="bg-[#1d2025] text-white overflow-scroll">
            {/* Your sheet content goes here */}
            <div className="flex p-4 flex-col w-full justify-center items-center gap-5">
              <img
                src={calendar}
                alt="Referral Gift"
                className="mx-auto w-24 h-24"
              />
              <div className="text-4xl font-bold">Daily reward</div>
              <div className="text-md text-center font-light">
                Accrue coins for logging into the game daily without skipping
              </div>
              <div className="grid grid-cols-4 grid-rows-4 w-full gap-2">
                {dailyReward?.rewards_by_day?.map((r, rIdx) => {
                  return (
                    <div
                      className={`flex flex-col justify-start items-center gap-2 border ${claimedStyle(
                        rIdx,
                        dailyReward?.days,
                        dailyReward?.is_completed
                      )}  rounded-xl p-4`}
                    >
                      <div className="text-xs flex items-center gap-2">
                        Day {r?.day_count}
                      </div>
                      <img
                        src={dollarCoin}
                        alt="Dollar Coin"
                        className="w-6 h-6"
                      />
                      <div className="text-xs font-bold flex items-center gap-2">
                        {kFormatter(r?.reward_coins)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 w-[calc(100%-2rem)] max-w-xl  flex justify-around items-center z-50 rounded-3xl text-3xl gap-1">
              <div
                className={`text-center w-full ${
                  dailyReward?.is_completed
                    ? "bg-neutral-200/20"
                    : "bg-green-500/80"
                } text-white py-4 rounded-md`}
                onClick={() => {
                  mutate({ task_id: dailyReward?.id as string });
                }}
              >
                <p>
                  {dailyReward?.is_completed ? "Come back tomorrow" : "Claim"}
                </p>
              </div>
            </div>
          </Sheet.Content>
        </Sheet.Container>
        <Sheet.Backdrop onTap={() => setOpen(false)} />
      </Sheet>
    </div>
  );
};

export default EarnPage;
