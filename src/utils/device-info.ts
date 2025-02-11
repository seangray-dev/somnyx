export function getBrowserInfo() {
  const userAgent = window.navigator.userAgent;
  const browsers = [
    { name: "Chrome", value: "Chrome" },
    { name: "Firefox", value: "Firefox" },
    { name: "Safari", value: "Safari" },
    { name: "Opera", value: "Opera" },
    { name: "Edge", value: "Edge" },
    { name: "IE", value: "IE" },
  ];

  for (const browser of browsers) {
    if (userAgent.indexOf(browser.name) > -1) {
      return browser.value;
    }
  }
  return "Unknown";
}

export function getOSInfo() {
  const userAgent = window.navigator.userAgent;
  const os = [
    { name: "Windows", value: "Windows" },
    { name: "Mac", value: "MacOS" },
    { name: "Linux", value: "Linux" },
    { name: "Android", value: "Android" },
    { name: "iOS", value: "iOS" },
  ];

  for (const system of os) {
    if (userAgent.indexOf(system.name) > -1) {
      return system.value;
    }
  }
  return "Unknown";
}

export function getScreenResolution() {
  return `${window.screen.width}x${window.screen.height}`;
}

export function getDeviceType() {
  const userAgent = window.navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(userAgent)) {
    return "Tablet";
  }
  if (
    /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
      userAgent
    )
  ) {
    return "Mobile";
  }
  return "Desktop";
}
