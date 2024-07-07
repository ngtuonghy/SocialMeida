import React, { useEffect, useState } from "react";
import "./comment.css";
import CommentItem from "./comment-item";
import { getComments } from "../api/comment";
import { socket } from "~/socket";
import InfiniteScroll from "react-infinite-scroll-component";
import CommentLoading from "./comment-loading";
import { isJsxNamespacedName } from "typescript";
const Comment = ({ post, commentId, scrollableTarget = null }) => {
	const [commentArray, setCommentArray] = useState([]);
	const [offset, setOffset] = useState(0);
	const [hasMore, setHasMore] = useState(true); // Add hasMore state

	useEffect(() => {
		if (post.post_id) fetchMoreData();
	}, [post.post_id]);

	useEffect(() => {
		const handleMessage = (data) => {
			if (data.post_id !== post.post_id) return;
			setCommentArray((prevDataComment) => {
				const newComment = [data, ...prevDataComment];
				return newComment;
			});
		};
		socket.on("new-message", handleMessage);
		return () => {
			socket.off("new-message", handleMessage);
		};
	}, [post.post_id]);

	// console.log(dataComment);
	console.log("dataComment", commentArray);
	const fetchMoreData = async () => {
		await getComments(post.post_id, 10, offset, commentId).then((res) => {
			if (res.code === 200) {
				setCommentArray((d) => [...d, ...res.data]);
				setOffset(offset + 10);
				if (res.data.length <= 0) setHasMore(false);
			}
		});
	};

	if (!post) return null;

	return (
		<>
			<InfiniteScroll
				style={{ overflow: "hidden" }}
				dataLength={commentArray.length}
				next={fetchMoreData}
				hasMore={hasMore}
				loader={<CommentLoading />}
				scrollableTarget={scrollableTarget}
			>
				{commentArray.map((comment, index) => (
					<CommentItem
						key={comment.comment_id}
						comment={comment}
						post={post}
						setListComment={setCommentArray}
					/>
				))}
			</InfiniteScroll>
		</>
	);
};

export default Comment;
