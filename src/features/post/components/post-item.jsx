import React, { useState } from "react";
import styled from "styled-components";
import CommentForm from "~/features/comments/components/comment-form";
import Dialog from "~/components/ui/dialog/dialog";
import Avatar from "~/components/ui/avatar/avatar";
import PostAction from "./post-action";
import PostHeader from "./post-header";
import PostDisplay from "./post-display";
import useUser from "~/hooks/use-user";
import { Button, ButtonVariants } from "~/components/ui/button";
import CommentsProvider from "~/features/comments/contexts/CommentsContext";
import MediaPost from "~/features/media-viewer/components/media-post";

const SBoxPost = styled.div`
  display: block;
  position: relative;
  width: 100%;
  height: 100%;
border-top: 1px solid var(--color-gray-300);
`;
const SBoxPadding = styled.div`
  padding: 10px;
  padding-bottom: 0;
`;
const Text = styled.p`
  font-size: 15px;
  margin-top: 5px;
  font-weight: 400;
`;
const BoxHidden = styled.div`
padding-top: 10px;
border-top: 1px solid var(--color-gray-300);

`;
const BoxHiddenContent = styled.div`
display: flex;
width: 100%;
justify-content: space-between;
background-color: var(--color-primary-50);
padding-block: 5px;
align-items: center;
`;

const PostItem = ({ post, setPosts }) => {
	const user = useUser();
	const [isModalOpen, setIsModalOpen] = useState(false);

	const [showPost, setShowPost] = useState(true);

	const [infoVote, setInfoVote] = useState({
		vote: post.userVote,
		voteCount: post.voteCount,
	});

	if (!showPost) {
		return (
			<BoxHidden>
				<BoxHiddenContent>
					<div>Post has been hidden</div>
					<Button
						variant={ButtonVariants.TEXT}
						onClick={() => setShowPost(true)}
					>
						Show
					</Button>
				</BoxHiddenContent>
			</BoxHidden>
		);
	}

	return (
		<>
			<CommentsProvider>
				<Dialog
					onClose={() => setIsModalOpen(false)}
					isOpen={isModalOpen}
					title={post.name + "' spost"}
					maxWidth="700px"
					id="scrollableDiv"
					nodeFooter={
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
									<Avatar
										width="32px"
										height="32px"
										src={user.avatarUrl}
										size={40}
									/>
									<CommentForm post={post} />
								</div>
							) : (
								<div>Sign in to comment</div>
							)}
						</div>
					}
				>
					<PostDisplay
						isModalOpen={isModalOpen}
						post={post}
						scrollableTarget="scrollableDiv"
						setInfoVote={setInfoVote}
						infoVote={infoVote}
						setShowPost={setShowPost}
						setPosts={setPosts}
					/>
				</Dialog>
			</CommentsProvider>
			<SBoxPost>
				<SBoxPadding>
					<PostHeader
						post={post}
						setShowPost={setShowPost}
						setPosts={setPosts}
					/>
					<Text>{post.content}</Text>
				</SBoxPadding>
				<MediaPost media={post.mediaUrls} />
				<SBoxPadding>
					<PostAction
						post={post}
						setIsModalOpen={setIsModalOpen}
						isModalOpen={isModalOpen}
						setInfoVote={setInfoVote}
						infoVote={infoVote}
					/>
				</SBoxPadding>
			</SBoxPost>
		</>
	);
};

export default PostItem;
