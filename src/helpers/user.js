const USER = "user";

export const setUser = (user) => {
  localStorage.setItem(USER, JSON.stringify(user));
};

export const clearUser = () => {
  localStorage.removeItem(USER);
};

export const getUser = () => {
  const user = localStorage.getItem(USER) ?? "";
  if (user) {
    return JSON.parse(user);
  } else {
    return null;
  }
};
