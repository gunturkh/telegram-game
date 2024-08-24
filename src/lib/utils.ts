export const stringToBoolean = (value: string) => {
  switch (value.toLowerCase()) {
    case "true":
      return true;

    case "false":
      return false;

    default:
      return null;
  }
};

export const formatShortCurrency = ({
  num,
  locale,
  currency,
}: {
  num: number;
  locale: "en-US" | "id-ID";
  currency: "USD" | "IDR";
}) => {
  return num.toLocaleString(locale, {
    notation: "compact",
    compactDisplay: "short",
    currency,
    style: "currency",
  });
};

export const formatPrice = ({
  price,
  currency = "USD",
}: {
  price: number;
  currency?: string;
}) => {
  return price?.toLocaleString("en-US", {
    currency,
    style: "currency",
  });
};

export function kFormatter(num: number): string {
  return Math.abs(num) > 999
    ? Math.sign(num) * Number((Math.abs(num) / 1000).toFixed(1)) + "K"
    : Math.sign(num) * Math.abs(num) + "";
}

export function numberWithCommas(x: number) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const calculateTimeLeft = (targetHour: number, showSeconds?: boolean) => {
  const now = new Date();
  const target = new Date(now);
  target.setUTCHours(targetHour, 0, 0, 0);

  if (now.getUTCHours() >= targetHour) {
    target.setUTCDate(target.getUTCDate() + 1);
  }

  const diff = target.getTime() - now.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  const paddedHours = hours.toString().padStart(2, "0");
  const paddedMinutes = minutes.toString().padStart(2, "0");
  if (showSeconds) {
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    const paddedSeconds = seconds.toString().padStart(2, "0");
    return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
  } else return `${paddedHours}:${paddedMinutes}`;
};

export const calculateTimeLeftUsingTimestamp = (targetTimestamp: number) => {
  const now = new Date();
  const target = new Date(targetTimestamp);

  // If the target time is in the past, move it to the next day
  if (now >= target) {
    target.setUTCDate(target.getUTCDate() + 1);
  }

  const diff = target.getTime() - now.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  const paddedHours = hours.toString().padStart(2, "0");
  const paddedMinutes = minutes.toString().padStart(2, "0");
  const paddedSeconds = seconds.toString().padStart(2, "0");

  return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
};
