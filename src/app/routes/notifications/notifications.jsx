import React, {} from "react";
import styled from "styled-components";
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
