import { api } from "~/lib/api-client";

export const acceptFriendRequest = async (userId, friend) => {
	const response = await api.patch(`/v1/users/${userId}/friends/${friend}`);
	return response.data;
};
