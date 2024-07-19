const env = {
	apiUrl: process.env.APP_API_URL,
	appUrl: process.env.APP_URL,
	APP_BASE_API_URL: process.env.APP_BASE_API_URL,
	uploadImage: {
		cloudnaryName: process.env.CLOUDINARY_CLOUD_NAME,
		cloudnaryApiKey: process.env.COUDINARY_API_KEY,
		cloudnaryApiSecret: process.env.CLOUDINARY_API_SECRET,
	},
};

export default env;
