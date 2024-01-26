import clsx from "clsx";
import Cookies from "js-cookie";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const setUserCookie = (user) => {
  Cookies.set("user", JSON.stringify(user), {
    expires: 1,
  });
};

export const getUserCookie = () => {
  return Cookies.get("user");
};

export const removeUserCookie = () => {
  return Cookies.remove("user");
};

export const setTokenCookie = (token) => {
  Cookies.set("token", token, { expires: 1 });
};

export const getTokenCookie = () => {
  return Cookies.get("token");
};

export const removeTokenCookie = () => {
  return Cookies.remove("token");
};
