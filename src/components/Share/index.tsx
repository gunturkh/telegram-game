import WebApp from "@twa-dev/sdk";

function Share() {
  // console.log('location', location)
  return (
    <div className="fixed bottom-[5.5rem] left-1/2 transform -translate-x-1/2 w-[calc(100%-2rem)] max-w-xl  flex justify-around items-center z-50 rounded-3xl text-xs gap-1">
      <div
        className={`text-center w-4/5 bg-[#5a60ff] text-white py-4 rounded-md animate-pulse`}
        // onClick={() => navigate("/")}
      >
        <p className="mt-1">Invite a friend</p>
      </div>
      <div
        className={`text-center w-1/5 bg-[#5a60ff] text-white py-4 rounded-md`}
        onClick={() => {
          if (WebApp) {
            WebApp.openLink(
              `https://t.me/chipmunk_kombat_bot/chipmunk?startapp=testreferral`
            );
          }
        }}
      >
        <p className="mt-1">Copy</p>
      </div>
    </div>
  );
}

export default Share;
