import Hamster from "../../icons/Hamster";
import WebApp from "@twa-dev/sdk";
import usePlayer from "../../_hooks/usePlayer";
import { dollarCoin } from "../../images";
import Info from "../../icons/Info";
import Settings from "../../icons/Settings";
import { useState } from "react";
import { usePlayerStore } from "../../store/player";
import { formatProfitPerHour, numberWithDots } from "../../lib/utils";
import { Tooltip } from "react-tooltip";
import { __DEV__ } from "../../utils/constants";
import { useNavigate } from "react-router-dom";

const levelNames = [
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
function Header() {
  const navigate = useNavigate();
  const [msg] = useState(false);
  const {
    query: { data: playerData },
  } = usePlayer();
  const { resetDailyCombo, setDailyComboRewardModal } = usePlayerStore();
  const profitPerHour = playerData?.passive_earnings?.per_hour;

  return (
    <div className="px-4 z-10">
      <div className="flex items-center space-x-2 pt-4">
        <div className="p-1 rounded-lg bg-[#451e0f]">
          <Hamster size={24} className="text-[#fff3b2]" />
        </div>
        <div
        // onClick={() =>
        //   WebApp.showAlert(`referral: ${WebApp.initDataUnsafe.start_param}`)
        // }
        >
          <p className="text-sm text-[#451e0f]">
            {WebApp?.initDataUnsafe?.user?.username} (DTW)
          </p>
        </div>
      </div>
      {msg && (
        <div className="">
          <p className="text-sm  text-wrap break-words">
            {window.location.href}
          </p>
        </div>
      )}
      <div className="flex items-center justify-between space-x-4 mt-1">
        <div
          className="flex items-center w-1/3"
          onClick={() => navigate("/level")}
        >
          <div className="w-full">
            <div className="flex justify-between">
              <p className="text-[#451e0f] text-sm">
                {playerData?.level?.current_level_name}
              </p>
              <p className="text-[#451e0f] text-sm">
                {playerData?.level?.current_level}{" "}
                <span className="text-[#451e0f]">/ {levelNames.length}</span>
              </p>
            </div>
            <div className="flex items-center mt-1 border-2 border-[#451e0f] rounded-full">
              <div className="w-full h-2 bg-[#451e0f]/[0.6] rounded-full">
                <div
                  className="bg-gradient-to-r from-[#dc7b0c] to-[#fff973] h-2 rounded-full"
                  // style={{ width: `${calculateProgress()}%` }}
                  style={{
                    width: `${playerData?.level?.next_level_percentage}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center w-2/3 border-2 border-[#451e0f] rounded-full px-4 py-[2px] bg-[#451e0f]/[0.6] max-w-64">
          <img
            onClick={() => {
              if (__DEV__) {
                console.log("trigger modal daily combo");
                setDailyComboRewardModal(true);
              }
            }}
            src={playerData?.level?.current_level_image_url || ""}
            alt={playerData?.level?.current_level_name || "Chipmunk"}
            className="w-8 h-8"
          />
          <div className="h-[32px] w-[2px] bg-[#451e0f] mx-2"></div>
          <div
            className="flex-1 text-center"
            data-tooltip-id="profit-per-hour"
            data-tooltip-content={numberWithDots(profitPerHour) as string}
            data-tooltip-place="bottom"
          >
            <p className="text-xs text-white font-medium">Hourly Profit</p>
            <div className="flex items-center justify-center space-x-1">
              <img
                src={dollarCoin}
                alt="Dollar Coin"
                className="w-[18px] h-[18px]"
              />
              <p className="text-sm">{formatProfitPerHour(profitPerHour)}</p>
              <Info size={20} className="text-[#451e0f]" />
            </div>
          </div>
          <Tooltip id="profit-per-hour" />
          <div className="h-[32px] w-[2px] bg-[#451e0f] mx-2"></div>
          <div
            onClick={() => {
              if (__DEV__) resetDailyCombo();
            }}
          >
            <Settings className="text-white" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
