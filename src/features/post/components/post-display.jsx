import React from "react";
import styled from "styled-components";
import Comment from "~/features/comments/components/comment";
import PostAction from "./post-action";
import PostHeader from "./post-header";
import MediaPost from "~/features/media-viewer/components/media-post";

const Box = styled.div`
  display: block;
  position: relative;
  width: 100%;
  height: 100%;
`;
const Text = styled.p`
  padding-inline: 10px;
  font-size: 15px;
  margin-top: 5px;
  font-weight: 400;
`;
const SBoxPadding = styled.div`
  padding: 10px;
  padding-bottom: 0;
`;
const Line = styled.div`
padding-bottom: 10px;
border-bottom: 1px solid var(--color-gray-300);
`;

const PostDisplay = ({
	post,
	scrollableTarget,
	setInfoVote,
	infoVote,
	setShowPost,
	setPosts,
}) => {
	if (!post) return null;
	return (
		<Box>
			<Line>
				<SBoxPadding>
					<PostHeader
						post={post}
						setShowPost={setShowPost}
						setPosts={setPosts}
					/>
					<Text>{post.content}</Text>
				</SBoxPadding>
				<MediaPost media={post.mediaUrls} postId={post.postId} />
				<SBoxPadding>
					<PostAction
						post={post}
						setInfoVote={setInfoVote}
						infoVote={infoVote}
					/>
				</SBoxPadding>
			</Line>
			<SBoxPadding>
				<Comment post={post} scrollableTarget={scrollableTarget} />
			</SBoxPadding>
		</Box>
	);
};

export default PostDisplay;
