import WebApp from "@twa-dev/sdk";
import usePlayer from "../../_hooks/usePlayer";
import toast from "react-hot-toast";

function Share() {
  const {
    queryInfo: { data },
  } = usePlayer();
  // console.log('location', location)
  return (
    <div className="fixed bottom-[5.5rem] left-1/2 transform -translate-x-1/2 w-[calc(100%-2rem)] font-figtree max-w-xl  flex justify-around items-center z-50 rounded-3xl text-lg gap-1">
      <div
        className={`text-center w-4/5 bg-[#303030] border-2 border-[#e8af00] text-[#e8af00] py-4 rounded-2xl animate-pulse`}
        onClick={() => {
          const url = `https://t.me/chipmunk_kombat_bot/chipmunk?startapp=${data?.referral_code}`;
          if (WebApp) {
            WebApp.openTelegramLink(`https://t.me/share/url?url=${url}`);
          }
        }}
      >
        <p className="mt-1">Invite a friend</p>
      </div>
      <div
        className={`text-center w-1/5 bg-[#e8af00] border border-[#e8af00] text-black py-4 rounded-2xl`}
        onClick={async () => {
          const url = `https://t.me/chipmunk_kombat_bot/chipmunk?startapp=${data?.referral_code}`;
          if ("clipboard" in navigator) {
            await navigator.clipboard.writeText(url);
          } else {
            document.execCommand("copy", true, url);
          }
          toast.success("Text Copied to clipboard", {
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          });
        }}
      >
        <p className="mt-1">Copy</p>
      </div>
    </div>
  );
}

export default Share;
