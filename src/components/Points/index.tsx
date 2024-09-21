import { useEffect } from "react";
import { dollarCoin } from "../../images";
import { usePlayerStore } from "../../store/player";
import usePlayer from "../../_hooks/usePlayer";

function Points() {
  const { points, setPoints } = usePlayerStore();
  const {
    query: { data: playerData, isLoading },
  } = usePlayer();
  const profitPerHour = playerData?.passive_earnings?.per_hour;
  // console.log("points", points);
  // console.log("playerData inside points", playerData);
  useEffect(() => {
    const pointsPerSecond = profitPerHour / 3600;
    // console.log("pointsPerSecond", pointsPerSecond);
    const interval = setInterval(() => {
      setPoints(pointsPerSecond);
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerData]);


  return (
    <div className="px-4 mt-4 mb-4 flex justify-center font-figtree font-bold">
      <div className="px-4 py-2 flex items-center space-x-2">
        <img src={dollarCoin} alt="Dollar Coin" className="w-10 h-10" />
        {isLoading ? (
          <p className="text-4xl text-white">-</p>
        ) : (
          <p className="text-4xl text-white">
            {Math.floor(points)?.toLocaleString()}
          </p>
        )}
      </div>
    </div>
  );
}

export default Points;
