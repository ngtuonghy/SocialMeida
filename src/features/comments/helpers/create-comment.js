import { socket } from "~/socket";
import { generatePublicId } from "~/utils/utilCreateNanoId";
import { createComment } from "../api/comment";
import { uploadFiles } from "~/features/post/api/uploadImage";
import {
	addReplied,
	updateLoadingByReplyToCommentId,
} from "../utils/add-replied";

export const addComment = async (dataInput, post, user, setComments) => {
	const commentId = generatePublicId(21);

	let mediaUrl = null;
	if (dataInput.media.url !== null) {
		const response = await uploadFiles(
			dataInput.media.file,
			"up_comment",
			`${commentId}_media`,
		);
		mediaUrl = await response.json().then((res) => res.url);
	}

	const newdata = {
		commentId: commentId,
		avatarUrl: user.avatarUrl,
		createdAt: new Date().toISOString(),
		name: user.name,
		postId: post.postId,
		replyToCommentId: null,
		content: dataInput.text,
		mediaUrl: mediaUrl,
		mediaType: dataInput.media.type,
		userId: user.userId,
		username: user.name,
		error: false,
		loading: true,
	};

	if (newdata.postId !== post.postId) return;
	setComments((prevDataComment) => {
		const newComment = [newdata, ...prevDataComment];
		return newComment;
	});

	const res = await createComment(
		{ postId: post.postId },
		{
			commentId: commentId,
			userId: post.userId,
			replyToCommentId: null,
			content: dataInput.text,
			mediaUrl,
			mediaType: dataInput.media.type,
		},
	);

	if (res.code === 200) {
		setComments((prevDataComment) => {
			const newComment = prevDataComment.map((comment) => {
				if (comment.commentId === commentId) {
					return {
						...comment,
						loading: false,
					};
				}
				return comment;
			});
			return newComment;
		});

		socket.emit("new-comment", {
			commentId: commentId,
			avatarUrl: user.avatarUrl,
			createdAt: new Date().toISOString(),
			name: user.name,
			postId: post.postId,
			replyToCommentId: null,
			content: dataInput.text,
			mediaUrl,
			mediaType: dataInput.media.type,
			userId: user.userId,
			username: user.name,
		});
	} else {
		setComments((prevDataComment) => {
			const newComment = prevDataComment.map((comment) => {
				if (comment.commentId === commentId) {
					return {
						...comment,
						error: true,
						loading: false,
					};
				}
				return comment;
			});
			return newComment;
		});
	}
	if (res.data) {
		// console.log(res.data);
		const obj = {
			...res.data,
			avatarUrl: user.avatarUrl,
			name: user.name,
			receiverId: post.userId,
		};
		console.log(obj);
		socket.emit("send-notification", obj);
	}
};

export const addReplyComment = async (dataInput, comment, user, setComment) => {
	const commentId = generatePublicId(21);

	let mediaUrl = null;
	if (dataInput.media.url !== null) {
		const response = await uploadFiles(
			dataInput.media.file,
			"up_comment",
			`${commentId}_media`,
		);
		mediaUrl = await response.json().then((res) => res.url);
	}

	const newdata = {
		commentId: commentId,
		avatarUrl: user.avatarUrl,
		createdAt: new Date().toISOString(),
		name: user.name,
		postId: comment.postId,
		replyToCommentId: comment.commentId,
		content: dataInput.text,
		mediaUrl: mediaUrl,
		mediaType: dataInput.media.type,
		userId: user.userId,
		username: user.name,
		error: false,
		loading: true,
	};

	addReplied(newdata, comment.commentId, setComment);

	const res = await createComment(
		{ postId: comment.postId },
		{
			commentId: commentId,
			userId: comment.userId,
			replyToCommentId: comment.commentId,
			content: dataInput.text,
			mediaUrl,
			mediaType: dataInput.media.type,
		},
	);

	if (res.code === 200) {
		setComment((prev) => ({
			...prev,
			replies: updateLoadingByReplyToCommentId(prev.replies, commentId, {
				loading: false,
			}),
		}));

		socket.emit("replied-comment", {
			commentId: commentId,
			avatarUrl: user.avatarUrl,
			createdAt: new Date().toISOString(),
			name: user.name,
			postId: comment.postId,
			replyToCommentId: comment.commentId,
			content: dataInput.text,
			mediaUrl,
			mediaType: dataInput.media.type,
			userId: user.userId,
			username: user.name,
		});
	} else {
		setComment((prev) => ({
			...prev,
			replies: updateLoadingByReplyToCommentId(prev.replies, commentId, {
				error: true,
				loading: false,
			}),
		}));
	}
};
