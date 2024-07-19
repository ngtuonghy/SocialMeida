import { api } from "~/lib/api-client";

export const deleteNotification = async (params) => {
	try {
		const res = await api.delete(
			`/v1/users/${params.userId}/notifications/${params.notificationId}`,
		);
		return res.data;
	} catch (error) {
		console.error("Error delete comment:", error);
		throw new Error("Failed to delete comment");
	}
};
export const updateNotification = async (params) => {
	try {
		const res = await api.patch(
			`/v1/users/${params.userId}/notifications/${params.notificationId}`,
		);
		return res.data;
	} catch (error) {
		console.error("Error update notification:", error);
		throw new Error("Failed to update notification");
	}
};
// NOTE: comment
export const createNotification = async (params, body) => {
	try {
		const res = await api.post(
			`/v1/users/${params.userId}/notifications`,
			body,
		);
		return res.data;
	} catch (error) {
		console.error("Error create comment:", error);
		throw new Error("Failed to create comment");
	}
};

export const getNotification = async (params, query) => {
	try {
		const isReaded = query.isReaded || false;
		const limit = query.limit || 10;
		const offset = query.offset || 0;
		const response = await api.get(`/v1/users/${params.userId}/notifications`, {
			params: {
				isReaded,
				limit,
				offset,
			},
		});
		return response.data;
	} catch (error) {
		console.error("Error get comments:", error);
		throw new Error("Failed to get comments");
	}
};
