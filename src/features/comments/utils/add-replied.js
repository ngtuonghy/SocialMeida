export const addReplied = (data, commentId, setComment) => {
	if (data.replyToCommentId !== commentId) return;
	setComment((prev) => ({
		...prev,
		replies: [...(prev.replies || []), data],
	}));
};

export const updateLoadingByReplyToCommentId = (
	replies,
	replyToCommentId,
	dataUpdate,
) => {
	return replies.map((reply) => {
		if (reply.commentId === replyToCommentId) {
			return { ...reply, ...dataUpdate };
		}
		if (reply.replies) {
			return {
				...reply,
				replies: updateLoadingByReplyToCommentId(
					reply.replies,
					replyToCommentId,
				),
			};
		}
		return reply;
	});
};
