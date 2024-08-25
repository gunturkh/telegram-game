import { Toaster } from "react-hot-toast";
import BottomTab from "../components/BottomTab";
import Share from "../components/Share";
import { dollarCoin, gift } from "../images";
import usePlayer from "../_hooks/usePlayer";
import { balanceFormatter, kFormatter } from "../lib/utils";

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
const FriendsPage = () => {
  const {
    queryReferral: { data },
  } = usePlayer();
  console.log("referral stats", data);
  return (
    <div className="bg-black flex flex-col justify-start min-h-screen h-100%">
      <div className="flex flex-col justify-center items-center text-white py-8 gap-4">
        <div className="text-4xl font-bold">Invite friends!</div>
        <div className="text-md font-light">
          You and your friends will receive bonuses
        </div>
      </div>
      <div className="flex flex-col justify-center items-center text-white p-8 gap-4">
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
      </div>

      <div className="flex flex-col justify-start items-start text-white px-8 py-2">
        <div className="text-md font-semibold">Friends List</div>
      </div>
      <div className="flex flex-col justify-center items-center text-white px-8 gap-4">
        {data &&
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data?.stats?.map((s: any) => {
            return (
              <div className="w-full justify-between flex gap-2 bg-[#272a2f] rounded-md p-2 mx-4 ">
                <div className="flex flex-col px-2 ">
                  <div className="text-sm font-bold">{`${s.first_name} ${s.last_name}`}</div>
                  <div className="flex justify-start items-center gap-1">
                    <div className="text-xs font-thin">{` ${
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
          })}
      </div>
      <Share />
      <BottomTab />
      <Toaster position="top-left" />
    </div>
  );
};

export default FriendsPage;
