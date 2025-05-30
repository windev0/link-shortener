export const isLoggedIn = (): boolean => {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  return isLoggedIn == "true";
};
