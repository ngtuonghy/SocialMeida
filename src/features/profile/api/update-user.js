import { api } from "~/lib/api-client";

export const updateUser = async (params, body) => {
	const response = await api.patch(`/v1/users/${params.userId}`, body);
	return response.data;
};
