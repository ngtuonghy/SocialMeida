import { api } from "~/lib/api-client";
export const getFriendsRequest = async (userId) => {
	const response = await api.get(`/v1/users/${userId}/friends`);
	return response.data;
};
