import * as changeCase from "change-case";
export const convertKeysToCamelCase = (obj) => {
	if (Array.isArray(obj)) {
		return obj.map((item) => convertKeysToCamelCase(item));
	} else if (obj !== null && obj !== undefined && obj.constructor === Object) {
		return Object.keys(obj).reduce((acc, key) => {
			acc[changeCase.camelCase(key)] = convertKeysToCamelCase(obj[key]);
			return acc;
		}, {});
	}
	return obj;
};

export const convertKeysToSnakeCase = (obj) => {
	if (Array.isArray(obj)) {
		return obj.map((item) => convertKeysToSnakeCase(item));
	} else if (obj !== null && obj !== undefined && obj.constructor === Object) {
		return Object.keys(obj).reduce((acc, key) => {
			acc[changeCase.snakeCase(key)] = convertKeysToSnakeCase(obj[key]);
			return acc;
		}, {});
	}
	return obj;
};
