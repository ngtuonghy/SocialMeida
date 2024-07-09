import env from "~/config/env";
import { api } from "~/lib/api-client";

const serverUrl = env.serverPort;

export const getProfile = async (identifier, userIdentifier) => {
	try {
		const res = await api.get(`/api/v1/users/${identifier}`, {
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
		const response = await fetch(`${serverUrl}api/v1/users/updateProfile`, {
			method: "PUT", // or 'PUT'
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},

			body: JSON.stringify(profile),
		}).then((response) => response.json());
		console.log("profile", profile);
		return response;
	} catch (error) {
		console.error("Error updateProfile:", error);
		throw new Error("Failed to update profile");
	}
};
