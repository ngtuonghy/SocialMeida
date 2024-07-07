import Axios from "axios";
import env from "~/config/env";

export const api = Axios.create({
  baseURL: env.apiUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
