import { getHours } from "date-fns";

export default function getGreeting() {
  const currentHour = getHours(new Date());

  if (currentHour < 12) {
    return "Good Morning";
  } else if (currentHour < 18) {
    return "Good Afternoon";
  } else {
    return "Good Evening";
  }
}
