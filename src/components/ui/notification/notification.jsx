import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Avatar from "~/components/ui/avatar/avatar";
import { socket } from "~/socket";
import styled from "styled-components";
import Link from "~/components/ui/link/link";
const Box = styled(Link)`
  display: flex;
  position: relative;
  gap: 10px;
`;
function CountDisplay({ dataT }) {
	console.log(dataT.notificationUrl);
	return (
		<Box>
			<Avatar src={dataT.avatarUrl} />
			<p>{dataT.notificationData.content}</p>
		</Box>
	);
}
const Notification = () => {
	useEffect(() => {
		socket.on("get-notification", (data) => {
			console.log(data);
			toast(<CountDisplay dataT={data} />, {
				position: "bottom-left",
				closeOnClick: true,
			});
		});
		return () => {
			socket.off("get-notification");
		};
	}, []);

	return (
		<>
			<ToastContainer autoClose={8000} />
		</>
	);
};

export default Notification;
