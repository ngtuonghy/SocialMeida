import env from "~/config/env";
import { api } from "~/lib/api-client";

export const signCloudinary = async (uploadPreset, publicId) => {
	try {
		const res = await api.post(`/v1/cloudinary/signature`, {
			uploadPreset,
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
