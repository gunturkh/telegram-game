import { Toaster } from "react-hot-toast";
import BottomTab from "../components/BottomTab";
import {
  calendar,
  dollarCoin,
  tap,
  energy,
  // boost,
  limit,
  // gift
} from "../images";
import usePlayer, { Task } from "../_hooks/usePlayer";
import { Sheet } from "react-modal-sheet";
import { useMemo, useRef, useState } from "react";
import { kFormatter, numberWithCommas } from "../lib/utils";
import WebApp from "@twa-dev/sdk";
import { Toast } from "primereact/toast";
import { useAuthStore } from "../store/auth";
import { API_URL } from "../utils/constants";
import Points from "../components/Points";
export const Result = ({
  status,
}: {
  status: "initial" | "success" | "fail" | "uploading";
}) => {
  if (status === "success") {
    return <p>✅ Uploaded successfully!</p>;
  } else if (status === "fail") {
    return <p>❌ Upload failed!</p>;
  } else if (status === "uploading") {
    return <p>⏳ Uploading started...</p>;
  } else {
    return null;
  }
};
const BoostPage = () => {
  const { token } = useAuthStore();
  console.log("token earn", token);
  const toast = useRef<Toast>(null);
  const {
    queryTasks: { data },
    queryBoost: { data: boostData },
    mutationCheckTask: { mutate },
    mutationBoost: { mutate: mutateBoost },
  } = usePlayer();
  console.log("boostData", boostData);
  const [open, setOpen] = useState(false);
  const [boosterType, setBoosterType] = useState("daily_booster");
  const [sheetContent, setSheetContent] = useState<Task | undefined>(undefined);
  const [status, setStatus] = useState<
    "initial" | "success" | "fail" | "uploading"
  >("initial");
  const [, setImage] = useState<string>("");
  // console.log("tasks", data);
  const dailyReward = useMemo(
    () => data?.filter((d) => d.type === "daily_booster")?.[0],
    [data]
  );
  // const taskList = useMemo(
  //   () => data?.filter((d) => d.type !== "daily_booster"),
  //   [data]
  // );

  // console.log("dailyReward", dailyReward);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFileUpload = async (event: any) => {
    console.log("event", event);
    console.log("file event", event.target.files[0]);
    setStatus("uploading");
    try {
      const formData = new FormData();
      if (event.target.files[0]) {
        formData.append("image", event.target.files[0]);
        console.log("image", formData.get("image"));
        // const response = await http.post("/media/images", {image: formData.get('image')});
        const response = await fetch(`${API_URL}/media/images`, {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // const response = await http.get("/media/images");
        const result = await response.json();
        console.log("result", result);
        setImage(result?.data);
        setStatus("success");
      }
    } catch (error) {
      console.error(error);
      setStatus("fail");
    }
  };
  const claimedStyle = (index: number, days: number, is_completed: boolean) => {
    console.log("is_completed", is_completed);
    if (index + 1 < days) return " border-green-400 opacity-100 bg-green-800";
    if (index + 1 === days) {
      if (is_completed) return "border-green-400 opacity-100 bg-green-800";
      return "border-yellow-400 opacity-100";
    }
    return "opacity-20";
  };

  const DailyRewardSheetContent = () => {
    return (
      <>
        <div className="flex p-4 flex-col w-full justify-center items-center gap-5">
          <img
            src={calendar}
            alt="Referral Gift"
            className="mx-auto w-24 h-24"
          />
          <div className="text-4xl font-bold text-white">Daily reward</div>
          <div className="text-md text-center font-light">
            Accrue coins for logging into the game daily without skipping
          </div>
          <div className="grid grid-cols-4 grid-rows-4 w-full gap-2">
            {dailyReward?.rewards_by_day?.map((r, rIdx) => {
              return (
                <div
                  key={r?.day_count}
                  className={`flex flex-col justify-start items-center gap-1 border ${claimedStyle(
                    rIdx,
                    dailyReward?.days,
                    dailyReward?.is_completed
                  )}  rounded-3xl p-1`}
                >
                  <div className="text-xs flex items-center gap-2">
                    Day {r?.day_count}
                  </div>
                  <img src={dollarCoin} alt="Dollar Coin" className="w-4 h-4" />
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
              setOpen(false);
            }}
          >
            <p>{dailyReward?.is_completed ? "Come back tomorrow" : "Claim"}</p>
          </div>
        </div>
      </>
    );
  };

  const TaskSubmissionStatus = ({
    status,
  }: {
    status: "not_completed" | "pending_approval" | "rejected" | "completed";
  }) => {
    switch (status) {
      case "not_completed":
        return <div className="px-8 py-2 text-center"> Not Completed</div>;
      case "pending_approval":
        return <div className="px-8 py-2 text-center">Pending Approval</div>;
      case "rejected":
        return <div className="px-8 py-2 text-center">Rejected</div>;
      case "completed":
        return <div className="px-8 py-2 text-center">Completed</div>;

      default:
        return <div className="px-8 py-2 text-center"> Not Completed</div>;
    }
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const RewardSheetContent = ({ content }: { content: any }) => {
    const description = (id: string) => {
      switch (id) {
        case "boost_earnings_taps":
          return "Increase the amount of coins you can earn per tap";
        case "boost_available_taps":
          return "Recharge your energy to the maximum and do another round of mining";
        case "boost_max_taps":
          return "Increase the amount of energy";

        default:
          return "Increase the amount of coins you can earn per tap";
      }
    };
    return (
      <>
        {" "}
        <div className="flex p-4 flex-col w-full justify-center items-center gap-5">
          <BoosterImage id={content.id} size="large" />
          <div className="text-4xl text-center font-bold">{content?.name}</div>
          <div className="text-md text-center font-light">
            {description(content?.id)}
          </div>

          {content?.type === "with_link" && content?.modal_link_url && (
            <div
              className={`text-center w-full bg-[#904728]/80 text-white py-4 rounded-md`}
              onClick={() => {
                WebApp.openLink(content.modal_link_url as string);
              }}
            >
              <p>{content?.modal_link_button || "Join"}</p>
            </div>
          )}

          <div className="flex items-center gap-2">
            <img src={dollarCoin} alt="Dollar Coin" className="w-8 h-8" />
            <div className="text-2xl font-bold flex items-center gap-2">
              {`${content?.price ? `${numberWithCommas(content?.price)}` : "Free"}`}
            </div>
          </div>
          <div className="text-2xl font-bold flex items-center gap-2">
            {`${content?.level ? `${content?.level} lvl` : ""}`}
          </div>
        </div>
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 w-[calc(100%-2rem)] max-w-xl  flex justify-around items-center z-50 rounded-3xl text-3xl gap-1">
          <div
            className={`text-center w-full bg-[#904728]/80 text-white py-4 rounded-md`}
            onClick={() => {
              mutateBoost({
                boost_id: content?.id as string,
              });
              setOpen(false);
            }}
          >
            <p>Go Ahead</p>
          </div>
        </div>
      </>
    );
  };

  const BoosterImage = ({
    id,
    size = "normal",
  }: {
    id: string;
    size?: "normal" | "large";
  }) => {
    switch (id) {
      case "boost_full_available_taps":
        return (
          <img
            src={energy}
            alt={id}
            className={`mx-4 ${size === "normal" ? "w-12 h-12" : "w-24 h-24"}`}
          />
        );
      case "boost_earnings_taps":
        return (
          <img
            src={tap}
            alt={id}
            className={`mx-4 ${size === "normal" ? "w-12 h-12" : "w-24 h-24"}`}
          />
        );
      case "boost_max_taps":
        return (
          <img
            src={limit}
            alt={id}
            className={`mx-4 ${size === "normal" ? "w-12 h-12" : "w-24 h-24"}`}
          />
        );
      default:
        return (
          <img
            src={energy}
            alt={id}
            className={`mx-4 ${size === "normal" ? "w-12 h-12" : "w-24 h-24"}`}
          />
        );
    }
  };
  const DynamicSheetContent = ({
    type,
    content,
  }: {
    type: string;
    content?: Task;
  }) => {
    if (type === "daily_booster") {
      return <DailyRewardSheetContent />;
    }
    if (content) {
      return <RewardSheetContent content={content} />;
    } else return null;
  };

  return (
    <div className="bg-[#fff3b2] flex flex-col justify-start min-h-screen h-100%">
      <Toast ref={toast}></Toast>
      <div className="py-8 font-bold">
        <Points />
      </div>

      <div className="px-4 text-[#451e0f] text-md font-semibold">Boosters</div>

      <div className="h-screen mb-10">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {boostData?.map((b: any) => {
          return (
            <div
              key={b.id}
              onClick={() => {
                setOpen(true);
                setBoosterType(b.id);
                setSheetContent(b);
              }}
              className="flex flex-col justify-center items-center text-white px-4 py-1 gap-4"
            >
              <div
                className={`w-full flex gap-2 ${
                  b.is_completed ? "bg-[#451e0f] opacity-60" : "bg-[#451e0f]"
                } rounded-md p-2 mx-4 `}
              >
                <BoosterImage id={b.id} />
                <div className="flex flex-col w-full ">
                  <div className="text-md font-bold capitalize">{b.name}</div>
                  {b.quota && (
                    <div className="flex justify-start items-center gap-1">
                      <div className="text-lg flex items-center gap-2">
                        <p className="text-yellow-400 font-semibold">
                          {b.used} / {b.quota}
                        </p>
                      </div>
                    </div>
                  )}
                  {b.price && (
                    <div className="flex justify-start items-center gap-1">
                      <img
                        src={dollarCoin}
                        alt="Dollar Coin"
                        className="w-4 h-4"
                      />
                      <div className="text-lg flex items-center gap-2">
                        <p className="text-yellow-400 font-semibold">
                          {numberWithCommas(b.price)} : lvl {b.level}
                        </p>
                        {b.is_completed && (
                          <p className="text-green-400 font-semibold">
                            Completed
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
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
          <Sheet.Header className="bg-[#451e0f]">
            <div className="w-full flex justify-end px-4">
              <button
                className="text-white text-lg font-bold"
                onClick={() => setOpen(false)}
              >
                x
              </button>
            </div>
          </Sheet.Header>
          <Sheet.Content className="bg-[#451e0f] text-white overflow-scroll">
            {/* Your sheet content goes here */}
            <DynamicSheetContent type={boosterType} content={sheetContent} />

            {sheetContent && sheetContent?.status && (
              <TaskSubmissionStatus status={sheetContent.status} />
            )}
            {sheetContent?.requires_admin_approval &&
              (sheetContent?.status === "not_completed" ||
                sheetContent?.status === "rejected") && (
                <div className="px-8">
                  <label className={`text-xs`}>
                    Please Upload your Screenshot of completing the task
                  </label>
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    // className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-white mb-3 leading-tight focus:outline-none focus:shadow-outline"
                    className="text-sm text-stone-500
                  file:mr-5 file:py-1 file:px-3 file:border-[1px]
                  file:text-xs file:font-medium
                  file:bg-stone-50 file:text-stone-700
                  hover:file:cursor-pointer hover:file:bg-blue-50
                  hover:file:text-blue-700"
                  />
                  <Result status={status} />
                </div>
              )}

            {sheetContent?.requires_admin_approval &&
              sheetContent?.status === "pending_approval" && (
                <div className="text-md text-center font-light">
                  Pending Approval from System
                </div>
              )}
          </Sheet.Content>
        </Sheet.Container>
        <Sheet.Backdrop onTap={() => setOpen(false)} />
      </Sheet>
    </div>
  );
};

export default BoostPage;
