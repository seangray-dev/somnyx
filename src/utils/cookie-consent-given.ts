export function cookieConsentGiven() {
  if (typeof window === "undefined") {
    return "undecided";
  }

  if (!localStorage.getItem("somnyx_cookie_consent")) {
    return "undecided";
  }
  return localStorage.getItem("somnyx_cookie_consent");
}
