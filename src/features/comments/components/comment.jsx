import React, { useEffect, useState } from "react";
import "./comment.css";
import CommentItem from "./comment-item";
import { socket } from "~/socket";
import InfiniteScroll from "react-infinite-scroll-component";
import CommentLoading from "./comment-loading";
import { getComments } from "../api/comment";
import useUser from "~/hooks/use-user";
import Avatar from "~/components/ui/avatar/avatar";
import CommentForm from "./comment-form";

const Comment = ({ post, commentId, scrollableTarget = null }) => {
	const [comments, setComments] = useState([]);
	const [offset, setOffset] = useState(0);
	const [hasMore, setHasMore] = useState(true);

	useEffect(() => {
		const fetchData = async (params) => {
			const res = await getComments(params, { offset: offset, limit: 10 });
			if (res.code === 200) {
				setComments(res.data);
				setOffset(offset + 10);
				if (res.data.length <= 0) setHasMore(false);
			}
		};
		fetchData({ postId: post.postId });
	}, []);

	const fetchMoreData = async (params) => {
		const res = await getComments(params, { offset: offset, limit: 10 });
		if (res.code === 200) {
			setComments((d) => [...d, ...res.data]);
			setOffset(offset + 10);
			if (res.data.length <= 0) setHasMore(false);
		}
	};

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
	const user = useUser();
	return (
		<>
			<div
				style={{
					display: "flex",
					width: "100%",
					gap: "10px",
					alignItems: "start",
				}}
			>
				{user ? (
					<div
						style={{
							display: "flex",
							width: "100%",
							gap: "10px",
							alignItems: "start",
						}}
					>
						<Avatar width="32px" height="32px" src={user.avatarUrl} size={40} />
						<CommentForm post={post} setComments={setComments} />
					</div>
				) : (
					<div>Sign in to comment</div>
				)}
			</div>

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
					<CommentItem
						key={comment.commentId}
						comment={comment}
						post={post}
						setComments={setComments}
					/>
				))}
			</InfiniteScroll>
		</>
	);
};

export default Comment;
