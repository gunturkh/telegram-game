import WebApp from "@twa-dev/sdk";
import usePlayer from "../../_hooks/usePlayer";
import { coin, dollarCoin } from "../../images";
import { useState } from "react";
import { usePlayerStore } from "../../store/player";
import { formatProfitPerHour, numberWithDots } from "../../lib/utils";
import { Tooltip } from "react-tooltip";
import { __DEV__ } from "../../utils/constants";
import { useNavigate } from "react-router-dom";
import useSound from "use-sound";

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
  const { setDailyComboRewardModal } = usePlayerStore();
  const [playSound] = useSound('click.wav');
  const profitPerHour = playerData?.passive_earnings?.per_hour;

  return (
    <div className="font-figtree px-4 z-10">
      <div className="flex items-center space-x-2 pt-4">
        <div className="p-1 rounded-lg border-[#e8af00]">
          <img src={coin} alt={"Chipmunk Coin"} className="w-8 h-8" />
        </div>
        <div
        // onClick={() =>
        //   WebApp.showAlert(`referral: ${WebApp.initDataUnsafe.start_param}`)
        // }
        >
          <p className="text-sm text-white">
            {`${WebApp?.initDataUnsafe?.user?.first_name} ${WebApp?.initDataUnsafe?.user?.last_name}`} (DTW)
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
          onClick={() => {
            playSound();
            navigate("/level");
          }}
        >
          <div className="w-full">
            <div className="flex flex-col justify-start w-full">
              <p className="text-white text-xs">
                {playerData?.level?.current_level_name}
              </p>
              <p className="text-white text-xs">
                {playerData?.level?.current_level}{" "}
                <span className="text-white">/ {levelNames.length}</span>
              </p>
            </div>
            <div className="flex items-center mt-1 border-2 border-white rounded-full">
              <div className="w-full h-2 bg-[#151515] rounded-full">
                <div
                  className="bg-gradient-to-r from-[#e8af00] to-[#e3932a] h-2 rounded-full"
                  // style={{ width: `${calculateProgress()}%` }}
                  style={{
                    width: `${playerData?.level?.next_level_percentage}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center w-1/2 border-2 border-white rounded-full px-4 py-[2px] bg-[#fff]/[0.2] max-w-64">
          <img
            onClick={() => {
              playSound();
              if (__DEV__) {
                console.log("trigger modal daily combo");
                setDailyComboRewardModal(true);
              }
            }}
            src={playerData?.level?.current_level_image_url || ""}
            alt={playerData?.level?.current_level_name || "Chipmunk"}
            className="w-10 h-10"
          />
          <div className="h-[32px] w-[2px] bg-white mx-2"></div>
          <div
            className="flex-1 text-left"
            data-tooltip-id="profit-per-hour"
            data-tooltip-content={numberWithDots(profitPerHour) as string}
            data-tooltip-place="bottom"
          >
            <p className="text-xs text-[#e8af00] font-medium">Hourly Profit</p>
            <div className="flex items-center justify-start space-x-1">
              <img
                src={dollarCoin}
                alt="Dollar Coin"
                className="w-[18px] h-[18px]"
              />
              <p className="text-sm">{formatProfitPerHour(profitPerHour)}</p>
              {/* <Info size={20} className="text-[#451e0f]" /> */}
            </div>
          </div>
          <Tooltip id="profit-per-hour" />
          {/* <div className="h-[32px] w-[2px] bg-[#451e0f] mx-2"></div>
          <div
            onClick={() => {
              if (__DEV__) resetDailyCombo();
            }}
          >
            <img
              src={playerData?.level?.current_level_image_url || ""}
              alt={playerData?.level?.current_level_name || "Chipmunk"}
              className="w-8 h-8"
            />
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default Header;
