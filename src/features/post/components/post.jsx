import React, { useEffect, useState } from "react";
import "./post.css";
import { getPost } from "../api/post";
import Dialog from "~/components/ui/dialog/dialog";
import InfiniteScroll from "react-infinite-scroll-component";
import styled from "styled-components";
import PostLoading from "./post-loading";
import CommentForm from "~/features/comments/components/comment-form";
import Avatar from "~/components/ui/avatar/avatar";
import PostAction from "./post-action";
import PostHeader from "./post-header";
import PostDisplay from "./post-display";
import useUser from "~/hooks/use-user";
import { Button, ButtonVariants } from "~/components/ui/button";
import CommentsProvider from "~/features/comments/contexts/CommentsContext";
import MediaPost from "~/features/media-viewer/components/media-post";
import PostItem from "./post-item";

const SBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
  gap: 10px;
`;
const Post = ({ username = null }) => {
	const [isModalEditPostOpen, setIsModalEditPostOpen] = useState(false);
	const [offset, setOffset] = useState(0);
	const [posts, setPosts] = useState([]);
	const [hasMore, setHasMore] = useState(true); // Add hasMore state

	useEffect(() => {
		const fetchPost = async () => {
			await getPost(5, offset, username).then((res) => {
				if (res.code === 200) {
					setPosts(res.data);
					setOffset(offset + 5);
				}
			});
		};
		fetchPost();
	}, []);

	const fetchMoreData = async () => {
		await getPost(5, offset, username).then((res) => {
			if (res.code === 200) {
				setPosts([...posts, ...res.data]);
				setOffset(offset + 5);
				if (res.data.length <= 0) {
					setHasMore(false);
				}
			}
		});
	};

	if (!posts) return <PostLoading />;

	return (
		<>
			<InfiniteScroll
				style={{ overflow: "hidden" }}
				dataLength={posts.length}
				next={fetchMoreData}
				hasMore={hasMore}
				loader={<PostLoading />}
			>
				<SBox>
					{Array.isArray(posts) &&
						posts.map((post, index) => (
							<PostItem key={index} post={post} setPosts={setPosts} />
						))}
				</SBox>
			</InfiniteScroll>
		</>
	);
};
export default Post;
