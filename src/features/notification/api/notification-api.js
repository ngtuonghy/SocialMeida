import { api } from "~/lib/api-client";

export const deleteNotification = async (notificationId) => {
  try {
    const res = await api.delete(`/api/v1/notification/${notificationId}`);
    return res.data;
  } catch (error) {
    console.error("Error delete comment:", error);
    throw new Error("Failed to delete comment");
  }
};
export const updateNotification = async (notificationId) => {
  try {
    const res = await api.patch(`/api/v1/notification/${notificationId}`);
    return res.data;
  } catch (error) {
    console.error("Error update notification:", error);
    throw new Error("Failed to update notification");
  }
};
// NOTE: comment
export const createNotification = async (body) => {
  try {
    const res = await api.post(`/api/v1/notification`, body);
    return res.data;
  } catch (error) {
    console.error("Error create comment:", error);
    throw new Error("Failed to create comment");
  }
};

export const getNotification = async (
  userId,
  isReaded = false,
  limit = 10,
  offset = 0,
) => {
  try {
    const response = await api.get(`/api/v1/notification/${userId}`, {
      params: {
        isReaded: isReaded,
        limit: limit,
        offset: offset,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error get comments:", error);
    throw new Error("Failed to get comments");
  }
};
