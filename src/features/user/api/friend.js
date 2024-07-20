import { api } from "~/lib/api-client";

export const addFriend = async (params) => {
	const response = await api.post(
		`/v1/users/${params.userId}/friends/${params.friend}`,
	);
	return response.data;
};

export const acceptFriendRequest = async (params) => {
	const response = await api.post(
		`/v1/users/${params.userId}/friends/${params.friend}`,
	);
	return response.data;
};

export const removeFriend = async (params) => {
	const response = await api.delete(
		`/v1/users/${params.userId}/friends/${params.friend}`,
	);
	return response.data;
};

export const getFriends = async (params, query) => {
	const response = await api.get(
		`/v1/users/${params.userId}/friends${query.status ? `?status=${query.status}` : ""}`,
	);
	return response.data;
};
