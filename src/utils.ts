import { differenceInMinutes, format, isSameDay } from "date-fns";

export const getMinutesAgo = (date: string) => {
  let d = new Date(date);
  let mins = differenceInMinutes(new Date(), d);

  if (mins < 1) {
    return "now";
  }

  if (mins > 60) {
    //check if same day
    if (isSameDay(new Date(), d)) {
      return format(d, "hh:mm aaa");
    }
    return format(d, "dd/MM/yyyy hh:mm aaa");
  }

  return `${mins} min${mins > 1 ? "s" : ""} ago`;
};
