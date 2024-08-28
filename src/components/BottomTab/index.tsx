import Coins from "../../icons/Coins";
import Friends from "../../icons/Friends";
import Mine from "../../icons/Mine";
import { useLocation, useNavigate } from "react-router-dom";
import usePlayer from "../../_hooks/usePlayer";
import { usePlayerStore } from "../../store/player";

function BottomTab() {
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;
  const {
    query: { data: playerData },
  } = usePlayer();
  const { setRoute } = usePlayerStore();
  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-[calc(100%-2rem)] max-w-xl bg-[#451e0f] flex justify-around items-center z-50 rounded-3xl text-xs">
      <div
        className={`text-center text-[#fadd79] w-1/5 ${
          pathname === "/" && "bg-[#904728] m-1 p-2 rounded-2xl"
        }`}
        onClick={() => {
          navigate("/");
          setRoute("/");
        }}
      >
        <img
          src={playerData?.level?.current_level_image_url || ""}
          alt="Exchange"
          className="w-8 h-8 mx-auto"
        />
        <p className="mt-1">Main</p>
      </div>
      <div
        className={`text-center text-[#fadd79] w-1/5 ${
          pathname === "/mine" && "bg-[#904728] m-1 p-2 rounded-2xl"
        }`}
        onClick={() => {
          navigate("/mine");
          setRoute("/mine");
        }}
      >
        <Mine className="w-8 h-8 mx-auto" />
        <p className="mt-1">Farm</p>
      </div>
      <div
        className={`text-center text-[#fadd79] w-1/5 ${
          pathname === "/friends" && "bg-[#904728] m-1 p-2 rounded-2xl"
        }`}
        onClick={() => {
          navigate("/friends");
          setRoute("/friends");
        }}
      >
        <Friends className="w-8 h-8 mx-auto" />
        <p className="mt-1">Friends</p>
      </div>
      <div
        className={`text-center text-[#fadd79] w-1/5 ${
          pathname === "/earn" && "bg-[#904728] m-1 p-2 rounded-2xl"
        }`}
        onClick={() => {
          navigate("/earn");
          setRoute("/earn");
        }}
      >
        <Coins className="w-8 h-8 mx-auto" />
        <p className="mt-1">Earn</p>
      </div>
      {/* <div className="text-center text-[#85827d] w-1/5">
                <img src={hamsterCoin} alt="Airdrop" className="w-8 h-8 mx-auto" />
                <p className="mt-1">Shop</p>
            </div> */}
    </div>
  );
}

export default BottomTab;
