import { Toaster } from "react-hot-toast";
import BottomTab from "../components/BottomTab";
import Share from "../components/Share";
import { dollarCoin, gift } from "../images";

const FriendsPage = () => {
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
      <Share />
      <BottomTab />
      <Toaster position="top-left" />
    </div>
  );
};

export default FriendsPage;
