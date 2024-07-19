import env from "~/config/env";
import { api } from "~/lib/api-client";
const serverUrl = env.serverPort;

export const getReplies = async (params) => {
	try {
		const res = await api.get(
			`/v1/posts/${params.postId}/comments/${params.commentId}/replies`,
		);
		return res.data;
	} catch {
		throw new Error("Failed to get replies");
	}
};

export const deleteComment = async (params) => {
	try {
		const res = await api.delete(
			`/v1/posts/${params.postId}/comments/${params.commentId}`,
		);
		res.data;
	} catch (error) {
		console.error("Error delete comment:", error);
		throw new Error("Failed to delete comment");
	}
};

// NOTE: comment
export const createComment = async (params, body) => {
	try {
		const res = await api.post(`/v1/posts/${params.postId}/comments`, body);
		return res.data;
	} catch (error) {
		console.error("Error create comment:", error);
		throw new Error("Failed to create comment");
	}
};

export const getComments = async (params, query) => {
	try {
		const limit = query.limit || 5;
		const offset = query.offset || 0;
		const commentId = query.commentId || null;
		const res = await api.get(`/v1/posts/${params.postId}/comments`, {
			params: { limit, offset, commentId },
		});
		return res.data;
	} catch (error) {
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
