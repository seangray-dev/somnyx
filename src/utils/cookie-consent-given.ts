export function cookieConsentGiven() {
  if (!localStorage.getItem("somnyx_cookie_consent")) {
    return "undecided";
  }
  return localStorage.getItem("somnyx_cookie_consent");
}
