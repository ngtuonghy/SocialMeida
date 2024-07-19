import Axios from "axios";
import env from "~/config/env";
import { convertKeysToCamelCase, convertKeysToSnakeCase } from "./change-case";

export const api = Axios.create({
	baseURL: env.apiUrl,
	withCredentials: true,
	headers: {
		"Content-Type": "application/json",
	},
});

api.interceptors.response.use(
	(response) => {
		if (response.data && typeof response.data === "object") {
			response.data = convertKeysToCamelCase(response.data);
		}
		return response;
	},
	(error) => {
		return Promise.reject(error);
	},
);

api.interceptors.request.use((config) => {
	if (config.data && typeof config.data === "object") {
		config.data = convertKeysToSnakeCase(config.data);
	}
	return config;
});
