export const formatPrice = (price: number | string) => {
  if (price === "Free") return price;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(price));
};
