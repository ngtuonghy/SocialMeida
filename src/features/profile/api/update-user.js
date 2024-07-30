import { api } from "~/lib/api-client";

export const updateUser = async (params, body) => {
	const response = await api.patch(`/v1/users/${params.userId}`, body);
	return response.data;
};

export const addFriend = async (params) => {
	const response = await api.post(
		`/v1/users/${params.userId}/friends/${params.friendId}`,
	);
	return response.data;
};
