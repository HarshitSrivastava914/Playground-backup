export const isMobileDevice = (): boolean => {
  if (typeof window === "undefined") return false;

  // User-Agent check for mobile devices
  const mobileRegex =
    /Android|iPhone|iPad|iPod|Windows Phone|webOS|BlackBerry/i;

  return mobileRegex.test(navigator.userAgent);
};
