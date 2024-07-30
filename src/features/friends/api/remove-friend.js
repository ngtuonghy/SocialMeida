import { api } from "~/lib/api-client";

export const removeFriend = async (userId, friend) => {
	const response = await api.delete(`/v1/users/${userId}/friends/${friend}`);
	return response.data;
};
