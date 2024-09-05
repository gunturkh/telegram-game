import { Toaster } from "react-hot-toast";
import BottomTab from "../components/BottomTab";
import Share from "../components/Share";
import { dollarCoin, gift } from "../images";
import usePlayer from "../_hooks/usePlayer";
import { balanceFormatter, kFormatter } from "../lib/utils";
import { __DEV__ } from "../utils/constants";

const LEVELS = [
  "Baby",
  "Toddler",
  "Student",
  "Scholar",
  "Adult",
  "Employee",
  "Manager",
  "General Manager",
  "Businessman",
  "Chairman",
];
const dummy = Array.from({ length: 50 }, (_, i) => ({
  first_name: `John ${i}`,
  last_name: `Doe ${i}`,
  level: (i % 10) + 1,
  earn_passive_per_hour: i * 100,
  balance_coins: i * 10000,
  referral_bonus_coins: i * 50000,
}));
const FriendsPage = () => {
  const {
    queryReferral: { data },
    queryInfo: { data: infoData },
  } = usePlayer();

  const refferalData =
    __DEV__ && infoData?.telegram_id === "465670876" ? dummy : data?.stats;
  // console.log("referral stats", data);
  return (
    <div className="bg-[#fff3b2] flex flex-col justify-start min-h-screen h-100%">
      <div className="flex flex-col justify-center items-center text-[#451e0f] py-8 gap-4">
        <div className="text-4xl font-bold">Invite Friends</div>
        <div className="text-md font-light">
          You and your friends will receive bonuses
        </div>
      </div>
      <div className="flex flex-col justify-center items-center text-white p-8 gap-4">
        <div className="w-full items-center flex gap-2 bg-[#451e0f] rounded-md p-2 mx-4 ">
          <img src={gift} alt="Referral Gift" className="mx-2 w-12 h-12" />
          <div className="flex flex-col ">
            <div className="text-md font-bold">Invite A Friend</div>
            <div className="flex justify-start items-center gap-1">
              <div className="flex flex-col">
                <div className="text-xs flex items-center gap-2">
                  <img
                    src={dollarCoin}
                    alt="Dollar Coin"
                    className="w-[12px] h-[12px]"
                  />
                  <p className="text-yellow-400 font-semibold">+10,000</p>
                  for you
                </div>
                <div className="text-xs flex items-center gap-2">
                  <img
                    src={dollarCoin}
                    alt="Dollar Coin"
                    className="w-[12px] h-[12px]"
                  />
                  <p className="text-yellow-400 font-semibold">+5,000</p>
                  for your friends
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-start items-start text-[#451e0f] px-8 py-2">
        <div className="text-md font-semibold">Friends List</div>
      </div>
      <div className="flex flex-col justify-center items-center text-white px-8 gap-4 mb-40">
        {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          refferalData.map((s: any) => {
            return (
              <div className="w-full justify-between flex gap-2 bg-[#451e0f] rounded-md p-2 mx-4 ">
                <div className="flex flex-col px-2 ">
                  <div className="text-sm font-bold">{`${s.first_name} ${s.last_name}`}</div>
                  <div className="flex justify-start items-center gap-1">
                    <div className="text-[0.65rem] font-thin">{` ${
                      LEVELS[s.level - 1]
                    } : `}</div>{" "}
                    <img
                      src={dollarCoin}
                      alt="Dollar Coin"
                      className="w-[12px] h-[12px]"
                    />
                    <div className="text-xs flex items-center gap-2">
                      <p className="text-yellow-400 font-semibold">
                        {kFormatter(s.earn_passive_per_hour)}
                      </p>
                      <p className="text-neutral-500">
                        ({balanceFormatter(s.balance_coins)})
                      </p>
                    </div>
                  </div>
                </div>
                <div className="text-xs flex items-center gap-2">
                  <img src={dollarCoin} alt="Dollar Coin" className="w-5 h-5" />
                  <p className="text-yellow-400 font-semibold">
                    +{kFormatter(s.referral_bonus_coins)}
                  </p>
                </div>
              </div>
            );
          })
        }
      </div>
      <Share />
      <BottomTab />
      <Toaster position="top-left" />
    </div>
  );
};

export default FriendsPage;
