import env from "~/config/env";
import { api } from "~/lib/api-client";
const serverUrl = env.serverPort;

export const getReplies = async (postId) => {
	try {
		const res = await fetch(`${serverUrl}api/v1/comments/${postId}/replies`, {
			credentials: "include",
		}).then((res) => res.json());
		return res;
	} catch {
		throw new Error("Failed to get replies");
	}
};

export const deleteComment = async (commentId) => {
	try {
		const response = await fetch(`${serverUrl}api/v1/comments/${commentId}`, {
			method: "DELETE", // or 'PUT'
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
		}).then((response) => response.json());
		return response;
	} catch (error) {
		console.error("Error delete comment:", error);
		throw new Error("Failed to delete comment");
	}
};

// NOTE: comment
export const createComment = async (data) => {
	try {
		const response = await fetch(`${serverUrl}api/v1/comments`, {
			method: "POST", // or 'PUT'
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},

			body: JSON.stringify(data),
		}).then((response) => response.json());
		// console.log("profile", profile);
		return response;
	} catch (error) {
		console.error("Error create comment:", error);
		throw new Error("Failed to create comment");
	}
};

export const getComments = async (postId, limit = 5, offset = 0, commentId) => {
	try {
		const res = await api.get(`/api/v1/comments/${postId}`, {
			params: { limit, offset, commentId },
		});
		return res.data;
	} catch {
		console.error("Error get comments:", error);
		throw new Error("Failed to get comments");
	}
};

export const createNotification = async (data) => {
	try {
		const response = await fetch(`${serverUrl}api/v1/notifications`, {
			method: "POST", // or 'PUT'
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},

			body: JSON.stringify(data),
		}).then((response) => response.json());
		// console.log("profile", profile);
		return response;
	} catch (error) {
		console.error("Error create comment:", error);
		throw new Error("Failed to create comment");
	}
};
