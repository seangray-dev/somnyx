import { formatDistance } from "date-fns";

export const timeAgo = (date: string) => {
  const now = new Date();
  const pastDate = new Date(date);
  return formatDistance(pastDate, now, { addSuffix: true });
};

export const formatDateForURL = (dateString: string) => {
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
};
