import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Notification from "~/features/notification/components/notification-item";
import toastify from "~/lib/toastify";
import { Button } from "~/components/ui/button";
import { IoCheckmarkDone } from "react-icons/io5";
import { getNotification, updateNotification } from "../api/notification-api";
import InfiniteScroll from "react-infinite-scroll-component";
import NotificationLoading from "./notification-loading";
import useUser from "~/hooks/use-user";

const SItem = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;
const Action = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  margin-bottom: 10px;
  gap: 10px;
`;
const ActionItem = styled.div`
  margin-left: auto;
`;

const Notifications = () => {
	const showToast = toastify();
	const [notifications, setNotifications] = useState([]);
	const [loading, setLoading] = useState(false);
	const user = useUser();
	const [filter, setFilter] = useState("all");
	const [hasMore, setHasMore] = useState({ filter: "all", more: true });
	const [offset, setOffset] = useState(10);

	useEffect(() => {
		fetch();
	}, [filter]);

	const fetch = async () => {
		setLoading(true);
		const res = await getNotification(
			{ userId: user.userId },
			{ isReaded: filter === "all" ? true : false, limit: 10, offset: 0 },
		);

		if (res.code === 200) {
			setNotifications(res.data);
			setLoading(false);

			if (filter !== hasMore.filter) {
				setHasMore({ filter: filter, more: true });
			}
			if (res.data.length <= 0) {
				setHasMore({ filter: filter, more: false });
			}
		}
	};

	const fetchMore = async () => {
		const res = await getNotification(
			{ userId: user.userId },
			{ isReaded: filter === "all" ? true : false, limit: 10, offset: offset },
		);

		if (res.code === 200) {
			setNotifications([...notifications, ...res.data]);
			setOffset(offset + 10);
			if (res.data.length <= 0) {
				setHasMore({ filter: filter, more: false });
			}
		} else {
			showToast("Failed to fetch notifications", { type: "error" });
		}
	};

	const markAllAsRead = async (notifications) => {
		try {
			await Promise.all(
				notifications.map((notification) => {
					if (notification.isReaded === false) {
						// Mark the notification as read in the database
						return updateNotification({
							userId: notification.userId,
							notificationId: notification.notificationId,
						});
					}
					return Promise.resolve();
				}),
			);

			// Update the local notifications array to mark all as read
			setNotifications(
				notifications.map((notification) => ({
					...notification,
					isReaded: true,
				})),
			);

			// Show success message
			showToast("All notifications have been marked as read", {
				type: "success",
			});
		} catch (error) {
			// Show error message
			showToast("Failed to mark all notifications as read", { type: "error" });
		}
	};
	const onClickDelete = (notificationId) => {
		// console.log(notificationId);
		setNotifications(
			notifications.filter(
				(notification) => notification.notificationId !== notificationId,
			),
		);
	};
	const handleSetFilter = (filter) => {
		setFilter(filter);
		setOffset(10);
	};
	return (
		<SItem>
			<Action>
				<Button
					variant={`${filter === "all" ? "" : "outlined"}`}
					onClick={() => handleSetFilter("all")}
					size="small"
				>
					All
				</Button>
				<Button
					size="small"
					variant={`${filter === "all" ? "outlined" : ""}`}
					onClick={() => handleSetFilter("unread")}
				>
					Unread
				</Button>
				<ActionItem>
					<Button
						disabled={notifications
							.map((notification) => notification.isReaded)
							.every((read) => read === true)}
						onClick={() => markAllAsRead(notifications)}
						startIcon={<IoCheckmarkDone size={20} />}
						size="small"
						variant={"text"}
					>
						Mark all as read
					</Button>
				</ActionItem>
			</Action>
			{loading ? (
				<NotificationLoading />
			) : notifications.length === 0 ? (
				<p>You have no notifications</p>
			) : (
				<InfiniteScroll
					style={{ overflow: "hidden" }}
					dataLength={notifications.length}
					next={fetchMore}
					hasMore={hasMore.more}
					loader={<NotificationLoading />}
				>
					{notifications.map((notification) => (
						<Notification
							key={notification.id}
							notification={notification}
							onClickDelete={onClickDelete}
						/>
					))}
				</InfiniteScroll>
			)}
		</SItem>
	);
};

export default Notifications;
