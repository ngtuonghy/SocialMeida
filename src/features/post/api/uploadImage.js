import env from "~/config/env";
import { api } from "~/lib/api-client";
const serverUrl = env.serverPort;

export const signCloudinary = async (upload_preset, publicId) => {
	try {
		const res = await api.post(`/api/v1/cloudinary/signature`, {
			upload_preset,
			publicId,
		});
		return res.data;
	} catch (error) {
		console.error("Error signCloudinary:", error);
		throw new Error("Failed signCloudinary");
	}
};

export const uploadFiles = async (file, preset, id) => {
	const cloudinarySignature = await signCloudinary(preset, id).then(
		(res) => res.data,
	);
	console.log(cloudinarySignature.sign);
	const { signature, timestamp } = cloudinarySignature.sign;
	const formData = new FormData();
	formData.append("file", file);
	formData.append("upload_preset", preset);
	formData.append("api_key", env.uploadImage.cloudnaryApiKey);
	formData.append("public_id", id);
	formData.append("overwrite", true);
	formData.append("timestamp", timestamp);
	formData.append("signature", signature);

	try {
		return await fetch(
			`https://api.cloudinary.com/v1_1/${env.uploadImage.cloudnaryName}/auto/upload`,
			{
				method: "POST",
				body: formData,
			},
		);
	} catch (error) {
		console.log(error);
	}
};

export const deleteFiles = async (publicId) => {
	try {
		const response = await fetch(`${serverUrl}api/v1/user/delete-image`, {
			method: "DELETE",
			credentials: "include",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ publicId }),
		});
		return await response.json();
	} catch (error) {
		console.error("Error deleteFiles:", error);
		throw new Error("Failed deleteFiles");
	}
};
