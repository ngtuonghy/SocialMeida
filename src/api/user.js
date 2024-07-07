import env from "~/config/env";

const serverUrl = env.serverPort;

export const getProfile = async (profile) => {
  try {
    const response = await fetch(`${serverUrl}api/v1/user/getProfile`, {
      method: "POST", // or 'PUT'
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profile),
    }).then((response) => response.json());
    return response;
  } catch (error) {
    console.error("Error getProfile:", error);
    throw new Error("Failed to get profile");
  }
};

export const updateProfile = async (profile) => {
  try {
    const response = await fetch(`${serverUrl}api/v1/user/updateProfile`, {
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
