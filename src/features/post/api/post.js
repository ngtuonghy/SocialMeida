import { api } from "~/lib/api-client";

export const getPost = async (limit = 5, offset = 0, username) => {
	try {
		// console.log(limit, offset);
		const res = await api.get(`/v1/posts`, {
			params: { limit, offset, username },
		});
		return res.data;
	} catch {
		throw new Error("Failed to get post");
	}
};

export const createPost = async (body) => {
	try {
		const res = await api.post(`/v1/posts`, body);
		return res.data;
	} catch (error) {
		throw new Error("Failed to create post");
	}
};

export const deletePost = async (params) => {
	try {
		const res = await api.delete(`/v1/posts/${params.postId}`);
		return res.data;
	} catch (error) {
		throw new Error("Failed to delete post");
	}
};
export const getPostById = async (postId) => {
	try {
		const res = await api.get(`/v1/posts/${postId}`);
		return res.data;
	} catch (error) {
		throw new Error("Failed to get post by id");
	}
};

export const updatePost = async (data) => {
	try {
		const res = await api.patch(`/v1/posts/${data.postId}`, data);
		return res.data;
	} catch (error) {
		throw new Error("Failed to update post");
	}
};

// NOTE: reaction
export const updateReaction = async (params, body) => {
	try {
		const response = await api.patch(
			`/v1/posts/${params.postId}/reactions`,
			body,
		);
		return response.data;
	} catch (error) {
		throw new Error("Failed to update post");
	}
};

export const updateVotePost = async (params, body) => {
	try {
		const response = await api.patch(
			`/v1/posts/${params.postId}/users/${params.userId}/votes`,
			body,
		);
		return response.data;
	} catch (error) {
		throw new Error("Failed to update post");
	}
};

export const getVotePost = async (params) => {
	try {
		const response = await api.get(`/v1/posts/${params.postId}/votes`);
		return response.data;
	} catch (error) {
		throw new Error("Failed to get vote post");
	}
};
