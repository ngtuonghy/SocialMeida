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
  return (
    <Box to={dataT.url}>
      <Avatar src={dataT.avatar_url} />
      <p>{dataT.text}</p>
    </Box>
  );
}
const PopNotification = () => {
  useEffect(() => {
    socket.on("get-notification", (data) => {
      // console.log(data);
      // console.log("check noti");
      toast(<CountDisplay dataT={data.data} />, {
        position: "bottom-left",
        closeOnClick: true,
      });
    });
  }, []);

  return (
    <>
      <ToastContainer autoClose={8000} />
    </>
  );
};

export default PopNotification;
