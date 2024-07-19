import { io } from "socket.io-client";
import env from "./config/env";

const URL = env.APP_BASE_API_URL || "undefined";

export const socket = io(URL, {
	withCredentials: true,
});
