import Hamster from "../../icons/Hamster";
import WebApp from "@twa-dev/sdk";
import usePlayer from "../../_hooks/usePlayer";
import { dollarCoin } from "../../images";
import Info from "../../icons/Info";
import Settings from "../../icons/Settings";
import { useState } from "react";

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
  const [msg] = useState(false);
  const {
    query: { data: playerData },
  } = usePlayer();
  const profitPerHour = playerData?.passive_earnings?.per_hour;
  const formatProfitPerHour = (profit: number) => {
    if (profit >= 1000000000) return `+${(profit / 1000000000).toFixed(2)}B`;
    if (profit >= 1000000) return `+${(profit / 1000000).toFixed(2)}M`;
    if (profit >= 1000) return `+${(profit / 1000).toFixed(2)}K`;
    return `+${profit}`;
  };
  return (
    <div className="px-4 z-10">
      <div className="flex items-center space-x-2 pt-4">
        <div className="p-1 rounded-lg bg-[#1d2025]">
          <Hamster size={24} className="text-[#d4d4d4]" />
        </div>
        <div
          onClick={() =>
            WebApp.showAlert(`referral: ${WebApp.initDataUnsafe.start_param}`)
          }
        >
          <p className="text-sm">
            {WebApp?.initDataUnsafe?.user?.username} (CEO)
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
        <div className="flex items-center w-1/3">
          <div className="w-full">
            <div className="flex justify-between">
              <p className="text-sm">{playerData?.level?.current_level_name}</p>
              <p className="text-sm">
                {playerData?.level?.current_level}{" "}
                <span className="text-[#95908a]">/ {levelNames.length}</span>
              </p>
            </div>
            <div className="flex items-center mt-1 border-2 border-[#43433b] rounded-full">
              <div className="w-full h-2 bg-[#43433b]/[0.6] rounded-full">
                <div
                  className="progress-gradient h-2 rounded-full"
                  // style={{ width: `${calculateProgress()}%` }}
                  style={{
                    width: `${playerData?.level?.next_level_percentage}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center w-2/3 border-2 border-[#43433b] rounded-full px-4 py-[2px] bg-[#43433b]/[0.6] max-w-64">
          <img
            src={playerData?.level?.current_level_image_url || ""}
            alt={playerData?.level?.current_level_name || "Chipmunk"}
            className="w-8 h-8"
          />
          <div className="h-[32px] w-[2px] bg-[#43433b] mx-2"></div>
          <div className="flex-1 text-center">
            <p className="text-xs text-[#85827d] font-medium">Hourly Profit</p>
            <div className="flex items-center justify-center space-x-1">
              <img
                src={dollarCoin}
                alt="Dollar Coin"
                className="w-[18px] h-[18px]"
              />
              <p className="text-sm">{formatProfitPerHour(profitPerHour)}</p>
              <Info size={20} className="text-[#43433b]" />
            </div>
          </div>
          <div className="h-[32px] w-[2px] bg-[#43433b] mx-2"></div>
          <Settings className="text-white" />
        </div>
      </div>
    </div>
  );
}

export default Header;
