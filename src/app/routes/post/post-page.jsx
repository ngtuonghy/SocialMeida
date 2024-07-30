import React, { useEffect, useState } from "react";
import { Outlet, useParams, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import { getOnePost } from "~/features/post/api/get-post";
import PostDisplay from "~/features/post/components/post-display";

const Text = styled.p`
  font-size: 15px;
  margin-top: 5px;
  font-weight: 400;
`;
const PostPage = () => {
	const { postId } = useParams();
	const [searchParams] = useSearchParams();
	const [post, setPost] = useState({});
	const [infoVote, setInfoVote] = useState({
		vote: null,
		voteCount: null,
	});
	useEffect(() => {
		fetchMoreData();
	}, [postId]);

	const fetchMoreData = async () => {
		await getOnePost(postId).then((res) => {
			if (res.code === 200 && res.data !== null) {
				setPost(res.data);
			}
		});
	};
	useEffect(() => {
		if (post) {
			setInfoVote({
				vote: post.userVote,
				voteCount: post.voteCount,
			});
		}
	}, [post]);

	if (!post) return <div> 404 not found </div>;

	// console.log(post);

	return (
		<>
			<PostDisplay post={post} setInfoVote={setInfoVote} infoVote={infoVote} />
			<Outlet />
		</>
	);
};

export default PostPage;
