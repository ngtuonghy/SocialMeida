import env from "~/config/env";
import { api } from "~/lib/api-client";

const serverUrl = env.serverPort;

export const getProfile = async (identifier, userIdentifier) => {
	try {
		const res = await api.get(`/v1/users/${identifier}`, {
			params: { userIdentifier },
		});

		return res.data;
	} catch (error) {
		console.error("Error getProfile:", error);
		throw new Error("Failed to get profile");
	}
};

export const updateProfile = async (profile) => {
	try {
		const response = await api.put(`/v1/users/updateProfile`, profile);
		return response.data;
	} catch (error) {
		console.error("Error updateProfile:", error);
		throw new Error("Failed to update profile");
	}
};
