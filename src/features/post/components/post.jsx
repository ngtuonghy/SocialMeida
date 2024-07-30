import React, { useEffect, useState } from "react";
import "./post.css";
import { getPost } from "../api/post";
import InfiniteScroll from "react-infinite-scroll-component";
import styled from "styled-components";
import PostLoading from "./post-loading";
import PostItem from "./post-item";
import { useDispatch, useSelector } from "react-redux";
import { setHasMore, setOffset, setPost } from "../postSlice";

const SBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
  gap: 10px;
`;
const Post = ({ username = null }) => {
	const [isModalEditPostOpen, setIsModalEditPostOpen] = useState(false);

	const dispatch = useDispatch();
	const posts = useSelector((state) => state.posts.data);
	const offset = useSelector((state) => state.posts.offset);
	const hasMore = useSelector((state) => state.posts.hasMore);

	const fetchMoreData = async () => {
		await getPost(5, offset, username).then((res) => {
			if (res.code === 200) {
				dispatch(setPost([...posts, ...res.data]));
				dispatch(setOffset(offset + 5));
				if (res.data.length <= 0) {
					dispatch(setHasMore(false));
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
							<PostItem key={index} post={post} /* setPosts={setPosts} */ />
						))}
				</SBox>
			</InfiniteScroll>
		</>
	);
};
export default Post;
