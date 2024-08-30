import { dollarCoin } from "../images";
import usePlayer from "../_hooks/usePlayer";
import { balanceFormatter, kFormatter } from "../lib/utils";
import { Slide } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";

const spanStyle = {
  padding: "20px",
  background: "#efefef",
  color: "#000000",
};

const divStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundSize: "cover",
  height: "400px",
};
const slideImages = [
  {
    url: "https://images.unsplash.com/photo-1509721434272-b79147e0e708?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80",
    caption: "Slide 1",
  },
  {
    url: "https://images.unsplash.com/photo-1506710507565-203b9f24669b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1536&q=80",
    caption: "Slide 2",
  },
  {
    url: "https://images.unsplash.com/photo-1536987333706-fc9adfb10d91?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80",
    caption: "Slide 3",
  },
];

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
const LevelPage = () => {
  const {
    queryReferral: { data },
  } = usePlayer();
  // console.log("referral stats", data);
  return (
    <div className="bg-[#fff3b2] flex flex-col justify-start min-h-screen h-100%">
      <Slide transitionDuration={200}>
        {slideImages.map((slideImage, index) => (
          <div key={index}>
            <div
              style={{ ...divStyle, backgroundImage: `url(${slideImage.url})` }}
            >
              <span style={spanStyle}>{slideImage.caption}</span>
            </div>
          </div>
        ))}
      </Slide>
      <div className="flex flex-col justify-center items-center text-[#451e0f] py-8 gap-4">
        <div className="flex flex-col justify-center items-center text-center p-8 gap-4">
          <div className="flex flex-col ">
            <div className="text-md font-bold">Toddler</div>
            <div className="text-md font-bold">From 5K</div>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-start items-start text-[#451e0f] px-8 py-2">
        <div className="text-md font-semibold">Rank</div>
      </div>
      <div className="flex flex-col justify-center items-center text-white px-8 gap-4">
        {data &&
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data?.stats?.map((s: any) => {
            return (
              <div className="w-full justify-between flex gap-2 bg-[#451e0f] rounded-md p-2 mx-4 ">
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
    </div>
  );
};

export default LevelPage;
