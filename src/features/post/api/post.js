import env from "~/config/env";
import { api } from "~/lib/api-client";

const serverUrl = env.serverPort;

export const getPost = async (limit = 5, offset = 0) => {
  try {
    // console.log(limit, offset);
    const res = await api.get(`/api/v1/posts`, { params: { limit, offset } });
    return res.data;
  } catch {
    throw new Error("Failed to get post");
  }
};

export const createPost = async (profile) => {
  try {
    const response = await fetch(`${serverUrl}api/v1/posts`, {
      method: "POST", // or 'PUT'
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(profile),
    }).then((response) => response.json());
    console.log("profile", profile);
    return response;
  } catch (error) {
    // console.error("Error create post:", error);
    throw new Error("Failed to create post");
  }
};

export const deletePost = async (postId) => {
  try {
    const response = await fetch(`${serverUrl}api/v1/posts/${postId}`, {
      method: "DELETE", // or 'PUT'
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => response.json());
    return response;
  } catch (error) {
    console.error("Error delete post:", error);
    throw new Error("Failed to delete post");
  }
};
export const getPostById = async (postId) => {
  try {
    const response = await fetch(`${serverUrl}api/v1/posts/${postId}`, {
      method: "GET", // or 'PUT'
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => response.json());
    return response;
  } catch (error) {
    console.error("Error get post by id:", error);
    throw new Error("Failed to get post by id");
  }
};

export const updatePost = async (data) => {
  try {
    const response = await fetch(`${serverUrl}api/v1/posts/${data.postId}`, {
      method: "PATCH", // or 'PUT'
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(data),
    }).then((response) => response.json());
    return response;
  } catch (error) {
    console.error("Error update post:", error);
    throw new Error("Failed to update post");
  }
};

// NOTE: reaction
export const updateReaction = async (data) => {
  try {
    const response = await fetch(`${serverUrl}api/v1/posts/reaction`, {
      method: "PATCH", // or 'PUT'
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(data),
    }).then((response) => response.json());
    return response;
  } catch (error) {
    console.error("Error update post:", error);
    throw new Error("Failed to update post");
  }
};
