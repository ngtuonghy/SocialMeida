const env = {
  serverPort: process.env.SERVER_PORT,
  homePort: process.env.HOME_PORT,
  apiUrl: process.env.API_URL,
  appwrite: {
    endpoint: process.env.APPWRITE_ENDPOINT,
    projectId: process.env.APPWRITE_PROJECT_ID,
    apiKey: process.env.APPWRITE_API_KEY,
  },
  uploadImage: {
    cloudnaryName: process.env.CLOUDINARY_CLOUD_NAME,
    cloudnaryApiKey: process.env.COUDINARY_API_KEY,
    cloudnaryApiSecret: process.env.CLOUDINARY_API_SECRET,
  },
};

export default env;
