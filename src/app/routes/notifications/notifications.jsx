import React, { useEffect, useState } from "react";
import env from "~/config/env";
const serverUrl = env.serverPort;
import { useSelector } from "react-redux";
import styled from "styled-components";
import NotificationItem from "~/features/notification/components/notification-item";
import { useAsync } from "~/hooks/use-async";
import Notifications from "~/features/notification/components/notifications";
const SBox = styled.div`
  padding: 10px;
  width: 100%;
  min-height: calc(100vh - var(--header-height));
`;
const SItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const NotificationsPage = () => {
  return (
    <SBox>
      <h2>Notifications</h2>
      <Notifications />
    </SBox>
  );
};

export default NotificationsPage;
