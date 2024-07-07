import { createNotification } from "~/features/notification/api/notification-api";
import env from "~/config/env";
import { socket } from "~/socket";
const homeUrl = env.homeUrl;
const createCommentNotification = async (homeUrl, post, comment, user) => {
  const text = "replly commented on your comment";
  const url = `${homeUrl}posts/${post.post_id}?commentId=${comment.comment_id}`;

  await createNotification({
    userId: comment.user_id,
    createdByUserId: user.user_id,
    notificationId: generatePublicId(24),
    text: text,
    url: url,
    urlType: "commented",
  });

  socket.off("notification");
  socket.emit("notification", {
    receiverId: post.user_id,
    data: {
      avatar_url: user.avatar_url,
      notificationId: generatePublicId(24),
      text: `${user.name} commented post`,
      url: url,
      urlType: "commented",
    },
  });
};

export default createCommentNotification;
