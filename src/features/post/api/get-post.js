import { api } from "~/lib/api-client";

export const getOnePost = async (postId) => {
	try {
		const res = await api.get(`/v1/posts/${postId}`);
		return res.data;
	} catch (error) {
		throw new Error("Failed to get post by id");
	}
};
