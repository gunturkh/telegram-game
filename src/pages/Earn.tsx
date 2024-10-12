import { Toaster } from "react-hot-toast";
import BottomTab from "../components/BottomTab";
import {
  calendar,
  coupon,
  dollarCoin,
  // gift
} from "../images";
import usePlayer, { Task } from "../_hooks/usePlayer";
import { Sheet } from "react-modal-sheet";
import { useMemo, useRef, useState } from "react";
import { kFormatter } from "../lib/utils";
import WebApp from "@twa-dev/sdk";
import { Toast } from "primereact/toast";
import { useAuthStore } from "../store/auth";
import { API_URL } from "../utils/constants";
import useSound from "use-sound";
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
const EarnPage = () => {
  const { token } = useAuthStore();
  const [playSound] = useSound('click.wav');
  console.log("token earn", token);
  const toast = useRef<Toast>(null);
  const {
    queryTasks: { data },
    mutationCheckTask: { mutate },
  } = usePlayer();
  const [open, setOpen] = useState(false);
  const [rewardType, setRewardType] = useState("daily_check_in");
  const [sheetContent, setSheetContent] = useState<Task | undefined>(undefined);
  const [status, setStatus] = useState<
    "initial" | "success" | "fail" | "uploading"
  >("initial");
  const [image, setImage] = useState<string>("");
  // console.log("tasks", data);
  const dailyReward = useMemo(
    () => data?.filter((d) => d.type === "daily_check_in")?.[0],
    [data]
  );
  const taskList = useMemo(
    () => data?.filter((d) => d.type !== "daily_check_in"),
    [data]
  );

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
            Accrue points & coupons for logging into the game daily without skipping
          </div>
          <div className="grid grid-cols-4 grid-rows-4 w-full gap-2">
            {dailyReward?.rewards_by_day?.map((r, rIdx) => {
              return (
                <div
                  key={r?.day_count}
                  className={`flex flex-col justify-start items-center gap-2 border ${claimedStyle(
                    rIdx,
                    dailyReward?.days,
                    dailyReward?.is_completed
                  )}  rounded-3xl p-1`}
                >
                  <div className="text-xs flex items-center gap-2">
                    Day {r?.day_count}
                  </div>
                  <div className="flex flex-row items-center gap-2">
                    <div className="flex flex-col items-center gap-2">
                      <img src={dollarCoin} alt="Dollar Coin" className="w-4 h-4" />
                      <div className="text-xs font-bold flex items-center gap-2">
                        {kFormatter(r?.reward_coins)}
                      </div>
                    </div>
                    {r?.reward_coupons !== 0 && (
                      <div className="flex flex-col items-center gap-1">
                        <img
                          src={coupon}
                          alt="Coupon"
                          className="w-[20px] h-[20px]"
                        />
                        <div className="text-xs font-bold flex items-center">
                          {kFormatter(r?.reward_coupons / 100)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 w-[calc(100%-2rem)] max-w-xl  flex justify-around items-center z-50 rounded-3xl text-3xl gap-1">
          <div
            className={`text-center w-full ${dailyReward?.is_completed
              ? "bg-neutral-200/20"
              : "bg-green-500/80"
              } text-white py-4 rounded-md`}
            onClick={() => {
              playSound();
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
  const RewardSheetContent = ({ content }: { content: Task }) => {
    const now = Math.floor(Date.now() / 1000);
    const ls = localStorage.getItem(`${content.id}-clicked`);
    const enableCheckButton = () => {
      if (status === "uploading") return false;
      else if (content.is_completed) {
        localStorage.removeItem(`${content.id}-clicked`);
        return false;
      }
      else if (content.type === "invite_friends") return true;
      if (ls) {
        console.log(
          "🚀 ~ enableCheckButton ~ ls 2:",
          `${content.id}-clicked`,
          now >= JSON.parse(ls)
        );
        return now >= JSON.parse(ls);
      } else return false;
    };
    return (
      <>
        {" "}
        <div className="flex p-4 flex-col font-figtree w-full justify-center items-center gap-5">
          <img
            src={content.image}
            alt="Referral Gift"
            className="mx-auto w-24 h-24"
          />
          <div className="text-4xl text-center font-bold">{content?.name}</div>
          <div className="text-md text-center font-light">
            {content?.description}
          </div>

          {content?.type === "with_link" && content?.modal_link_url && (
            <div
              className={`text-center w-full text-xl font-semibold bg-[#e8af00] text-[#212121] py-4 rounded-md`}
              onClick={() => {
                WebApp.openLink(content.modal_link_url as string);
                localStorage.setItem(`${content.id}-clicked`, "0");
              }}
            >
              <p>{content?.modal_link_button || "Join"}</p>
            </div>
          )}

          <div className="flex items-center gap-2">
            <img src={dollarCoin} alt="Dollar Coin" className="w-8 h-8" />
            <div className="text-2xl font-bold flex items-center gap-2">
              +{kFormatter(content?.reward_coins)}
            </div>
          </div>
        </div>
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 w-[calc(100%-2rem)] max-w-xl  flex justify-around items-center z-50 rounded-3xl text-3xl gap-1">
          <div
            className={`text-center w-full ${enableCheckButton() ? "bg-[#e8af00]" : "bg-neutral-200/20"
              } text-[#212121] text-3xl font-semibold py-4 rounded-md`}
            onClick={() => {
              playSound()
              console.log('content', content)
              if (!content.is_completed) {
                console.log('triggered check')
                if (content.type === 'invite_friends') {
                  mutate({
                    task_id: content?.id as string,
                    ...(content?.requires_admin_approval && {
                      image: image,
                    }),
                  });
                  setOpen(false);
                }
                else if (content.type !== 'invite_friends' && ls && now >= JSON.parse(ls)) {
                  mutate({
                    task_id: content?.id as string,
                    ...(content?.requires_admin_approval && {
                      image: image,
                    }),
                  });
                  setStatus("initial");
                  setOpen(false);
                }
                // if (!ls) {
                //   console.log("🚀 ~ RewardSheetContent ~ ls set LS:", ls);
                //   localStorage.setItem(
                //     `${content.id}-clicked`,
                //     "0"
                //     // JSON.stringify(
                //     //   now + (content.reward_delay_seconds as number)
                //     // )
                //   );
                // }
              }
            }}
          >
            <p>Check</p>
          </div>
        </div>
      </>
    );
  };

  const DynamicSheetContent = ({
    type,
    content,
  }: {
    type: string;
    content?: Task;
  }) => {
    if (type === "daily_check_in") {
      return <DailyRewardSheetContent />;
    }
    if (content) {
      return <RewardSheetContent content={content} />;
    } else return null;
  };
  return (
    <div className="bg-[#151515] flex flex-col justify-start min-h-screen h-100% font-figtree">
      <Toast ref={toast}></Toast>
      <div className="flex flex-col justify-center items-center text-white py-8 gap-4">
        <img src={dollarCoin} alt="Dollar Coin" className="w-20 h-20" />
        <div className="text-2xl font-bold text-[#e8af00]">
          Earn more points & coupons
        </div>
        <div className="text-md font-light">
          Complete tasks to receive bonuses
        </div>
        <div className="w-full h-[1px] bg-[#e8af00]"></div>
      </div>

      <div className="px-4 text-[#e8af00] text-md font-semibold">
        Daily Tasks
      </div>

      <div
        onClick={() => {
          playSound();
          setOpen(true);
          setRewardType("daily_check_in");
        }}
        className="flex flex-col justify-center items-center text-white p-4 gap-4"
      >
        <div className="w-full flex gap-2 bg-[#303030] border border-[#b7b7b7] rounded-2xl p-2 mx-4">
          <img src={calendar} alt="Referral Gift" className="mx-4 w-12 h-12" />
          <div className="flex flex-col w-full">
            <div className="text-md font-bold">Daily Reward</div>
            <div className="flex justify-start items-center gap-1">
              <img
                src={dollarCoin}
                alt="Dollar Coin"
                className="w-[12px] h-[12px]"
              />
              <div className="text-xs flex items-center gap-2 w-full">
                <p className="text-yellow-400 font-semibold">
                  +{kFormatter(dailyReward?.reward_coins as number)}
                </p>
                {dailyReward?.rewards_by_day?.[dailyReward.days - 1]?.reward_coupons !== 0 && (
                  <>
                    <p className="text-white font-semibold">&</p>
                    <img
                      src={coupon}
                      alt="Coupon"
                      className="w-[20px] h-[20px]"
                    />
                    <p className="text-yellow-400 font-semibold">
                      +{kFormatter(dailyReward?.rewards_by_day?.[dailyReward.days - 1]?.reward_coupons as number / 100)}
                    </p>
                  </>
                )}
                {dailyReward?.is_completed && (
                  <div className="flex-1 text-right mr-2">
                    <p className="text-[#c4ff55] font-semibold">Completed</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 text-[#e8af00] text-md font-semibold">
        Tasks list
      </div>

      <div className="h-screen mb-10">
        {taskList?.map((t) => {
          return (
            <div
              key={t.id}
              onClick={() => {
                playSound();
                setOpen(true);
                setRewardType(t.id);
                setSheetContent(t);
              }}
              className="flex flex-col w-full justify-center items-center text-white px-4 py-1 gap-4"
            >
              <div
                className={`w-full flex gap-2 ${t.is_completed ? "opacity-60 border border-[#c4ff55]" : ""
                  } bg-[#303030] border border-[#b7b7b7] rounded-2xl p-2 mx-4`}
              >
                <img
                  src={t.image}
                  alt="Referral Gift"
                  className="mx-4 w-12 h-12"
                />
                <div className="flex flex-col w-full ">
                  <div className="text-md font-bold capitalize">{t.name}</div>
                  <div className="flex justify-start items-center gap-1">
                    <img
                      src={dollarCoin}
                      alt="Dollar Coin"
                      className="w-4 h-4"
                    />
                    <div className="text-xs flex items-center gap-2 w-full">
                      <p className="text-yellow-400 font-semibold">
                        +{kFormatter(t.reward_coins)}
                      </p>
                      {t.is_completed && (
                        <div className="flex-1 text-right mr-2">
                          <p className="text-[#c4ff55] font-semibold">
                            Completed
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
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
        onClose={() => {
          playSound();
          setOpen(false);
        }}
        style={{
          zIndex: open ? "9999999" : "-1",
          visibility: open ? "visible" : "hidden",
        }}
      >
        <Sheet.Container>
          <Sheet.Header className="bg-[#151515]">
            <div className="w-full flex justify-end px-4">
              <button
                className="text-white text-lg font-bold"
                onClick={() => {
                  playSound();
                  setOpen(false);
                }}
              >
                x
              </button>
            </div>
          </Sheet.Header>
          <Sheet.Content className="bg-[#151515] text-white overflow-scroll">
            {/* Your sheet content goes here */}
            <DynamicSheetContent type={rewardType} content={sheetContent} />

            {sheetContent &&
              sheetContent?.status &&
              sheetContent?.requires_admin_approval && (
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
        <Sheet.Backdrop onTap={() => {
          playSound();
          setOpen(false);
        }} />
      </Sheet>
    </div>
  );
};

export default EarnPage;
