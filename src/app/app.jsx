import React, { useEffect, useMemo, useState } from "react";
import { AppProvider } from "./app-provider";
import { createRouter } from "./routes";

import { RouterProvider } from "react-router-dom";
import { socket } from "~/socket";
import Cookies from "js-cookie";

const AppRouter = () => {
	const router = useMemo(() => createRouter(), []);

	return (
		<RouterProvider router={router} fallbackElement={<div>Loading</div>} />
	);
};

const app = () => {
	useEffect(() => {
		const userId = Cookies.get("userId");
		socket.on("connect", () => {
			socket.emit("addUser", userId);
		});

		return () => {
			socket.disconnect();
		};
	}, []);

	return (
		<AppProvider>
			<AppRouter />
		</AppProvider>
	);
};

export default app;
