import { io } from "socket.io-client";
import env from "./config/env";

// "undefined" means the URL will be computed from the `window.location` object
const URL = env.serverPort;
export const socket = io(URL);
