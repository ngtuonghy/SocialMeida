import React, { useEffect } from "react";
import "./comment.css";
import CommentItem from "./comment-item";
import { socket } from "~/socket";
import InfiniteScroll from "react-infinite-scroll-component";
import CommentLoading from "./comment-loading";
import { convertKeysToCamelCase } from "~/lib/change-case";
import { useComments } from "../contexts/CommentsContext";

const Comment = ({ post, commentId, scrollableTarget = null }) => {
	const {
		comments,
		fetchData,
		fetchMoreData,
		hasMore,
		setComments,
		setHasMore,
		setOffset,
	} = useComments();

	useEffect(() => {
		fetchData({ postId: post.postId });
		return () => {
			setComments([]);
			setHasMore(true);
			setOffset(0);
		};
	}, []);

	useEffect(() => {
		const handleMessage = (data) => {
			console.log(data);
			if (data.postId !== post.postId) return;
			console.log(data);
			setComments((prevDataComment) => {
				const newComment = [data, ...prevDataComment];
				return newComment;
			});
		};
		socket.on("new-comment", handleMessage);
		return () => {
			socket.off("new-comment", handleMessage);
		};
	}, []);

	if (!post) return null;

	return (
		<>
			<InfiniteScroll
				style={{ overflow: "hidden" }}
				dataLength={comments.length}
				next={() => {
					fetchMoreData({ postId: post.postId });
				}}
				hasMore={hasMore}
				loader={<CommentLoading />}
				scrollableTarget={scrollableTarget}
			>
				{comments.map((comment, _) => (
					<CommentItem key={comment.commentId} comment={comment} post={post} />
				))}
			</InfiniteScroll>
		</>
	);
};

export default Comment;
