import React, { useEffect, useState } from "react";
import "./post.css";
import { getPost } from "../api/post";
import Dialog from "~/components/ui/dialog/dialog";
import MediaViewer from "~/features/media-viewer/components/media-viewer";
import CreatePost from "./create-post";
import InfiniteScroll from "react-infinite-scroll-component";
import styled from "styled-components";
import PostLoading from "./post-loading";
import InputItem from "~/features/comments/components/comment-input";
import Avatar from "~/components/ui/avatar/avatar";
import PostAction from "./post-action";
import PostHeader from "./post-header";
import PostDisplay from "./post-display";
import useUser from "~/hooks/use-user";

const Post = () => {
	const [isModalEditPostOpen, setIsModalEditPostOpen] = useState(false);
	const [offset, setOffset] = useState(0);
	const [posts, setPosts] = useState([]);
	const [hasMore, setHasMore] = useState(true); // Add hasMore state

	useEffect(() => {
		const fetchPost = async () => {
			await getPost(5, offset).then((res) => {
				if (res.code === 200) {
					setPosts(res.data);
					setOffset(offset + 5);
				}
			});
		};
		fetchPost();
	}, []);

	const fetchMoreData = async () => {
		await getPost(5, offset).then((res) => {
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
			<CreatePost
				isModalOpen={isModalEditPostOpen}
				setIsModalOpen={setIsModalEditPostOpen}
				data={posts}
			/>
			<InfiniteScroll
				style={{ overflow: "hidden" }}
				dataLength={posts.length}
				next={fetchMoreData}
				hasMore={hasMore}
				loader={<PostLoading />}
			>
				{Array.isArray(posts) &&
					posts.map((post, index) => <PostItem key={index} post={post} />)}
			</InfiniteScroll>
		</>
	);
};

const SBoxPost = styled.div`
  display: block;
  position: relative;
  width: 100%;
  height: 100%;
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

const PostItem = ({ post }) => {
	const user = useUser();
	const [isModalOpen, setIsModalOpen] = useState(false);
	// const [react, setReact] = useState(post.reacts);
	const [react, setReact] = useState(null);

	return (
		<>
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
									src={user.avatar_url}
									size={40}
								/>
								<InputItem post={post} />
							</div>
						) : (
							<div>Sign in to comment</div>
						)}
					</div>
				}
			>
				<PostDisplay
					post={post}
					scrollableTarget="scrollableDiv"
					setReact={setReact}
					react={react}
				/>
			</Dialog>
			<SBoxPost>
				<SBoxPadding>
					<PostHeader post={post} />
					<Text>{post.text}</Text>
				</SBoxPadding>
				<MediaViewer media={post.media_urls} />
				<SBoxPadding>
					<PostAction
						post={post}
						setIsModalOpen={setIsModalOpen}
						isModalOpen={isModalOpen}
						setReact={setReact}
						react={react}
					/>
				</SBoxPadding>
			</SBoxPost>
		</>
	);
};
export default Post;
