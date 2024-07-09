import { useEffect, useRef, useState } from "react";
import { useViewport } from "~/context/viewportContext";
import { convertFileToDataURL } from "~/utils/utilFile";
import { LuImage, LuSendHorizonal, LuSmile, LuXCircle } from "react-icons/lu";
import PickerEmoji from "~/lib/picker-emoji";
import { generatePublicId } from "~/utils/utilCreateNanoId";
import InputMultiline from "~/components/ui/text-field/input-multiline";
import { IconButton } from "~/components/ui/button/icon-button";
import { createComment, createNotification } from "../api/comment";
import { socket } from "~/socket";
import { useSelector } from "react-redux";
import env from "~/config/env";
import styled, { css } from "styled-components";
import useUser from "~/hooks/use-user";
import { uploadFiles } from "~/features/post/api/uploadImage";
const homeUrl = env.homePort;

const SBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
  background-color: var(--color-gray-100);
  border-radius: 13px;
`;
const BoxAction = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${(props) =>
		props.focusInput
			? css`
          position: relative;
          transition: all 0.7s;
        `
			: css`
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          right: 0;
        `};
`;
const InputItem = ({ post, comment, setDataReplied }) => {
	const postId = post ? post.post_id : comment.post_id;
	const [dataInput, setDataInput] = useState({
		text: "",
		media: { url: null, type: null, file: null },
	});

	const user = useUser();
	const { width } = useViewport();
	const fileInputRef = useRef(null);

	const handlePostComment = async () => {
		const commentId = generatePublicId(25);
		let url = null;
		if (dataInput.media.url !== null) {
			const response = await uploadFiles(
				dataInput.media.file,
				"up_comment",
				`${commentId}_media`,
			);
			url = await response.json().then((res) => res.url);
		}

		await createComment({
			postId: postId,
			commentId: commentId,
			replyComment: comment ? comment.comment_id : null,
			text: dataInput.text,
			mediaUrl: url,
			mediaType: dataInput.media.type,
		});

		// console.log(comment);
		if (comment) {
			const text = "replied to the comment";
			const url = `${homeUrl}posts/${postId}?commentId=${commentId}&reply=${comment.comment_id}`;
			if (comment.user_id !== user.user_id) {
				await createNotification({
					userId: comment.user_id,
					createdByUserId: user.user_id,
					notificationId: generatePublicId(24),
					text: `${text} "${comment.text}"`,
					url: url,
					urlType: "commented",
				});
				socket.emit("send-notification", {
					receiverId: comment.user_id,
					data: {
						avatar_url: user.avatar_url,
						notificationId: generatePublicId(24),
						text: `${user.name} ${text} "${comment.text}"`,
						url: url,
						urlType: "commented",
					},
				});
			}
			// socket.off("replied-comment");
			socket.emit("replied-comment", {
				avatar_url: user.avatar_url,
				created_at: new Date().toISOString(),
				name: user.name,
				post_id: comment.post_id,
				replyComment: comment.comment_id,
				comment_id: commentId,
				text: dataInput.text,
				media_url: url,
				media_type: dataInput.media.type,
			});
		} else {
			if (post.user_id !== user.user_id) {
				const text = "commented on your post";
				// http://localhost:5173/home/posts/:idpost/?commentId={id}&reply={id}
				const url = `${homeUrl}posts/${postId}?commentId=${commentId}`;
				// console.log(post);
				await createNotification({
					userId: post.user_id,
					createdByUserId: user.user_id,
					notificationId: generatePublicId(24),
					text: `${text} "${post.text}"`,
					url: url,
					urlType: "commented",
				});
				socket.emit("send-notification", {
					receiverId: post.user_id,
					data: {
						avatar_url: user.avatar_url,
						notificationId: generatePublicId(24),
						text: `${user.name} ${text} "${post.text}"`,
						url: url,
						urlType: "commented",
					},
				});
			}
			// console.log("chek handle run");
			// console.log(user);
			// socket.off("new-comment");
			socket.emit("new-comment", {
				comment_id: commentId,
				avatar_url: user.avatar_url,
				created_at: new Date().toISOString(),
				name: user.name,
				post_id: post.post_id,
				replyComment: post.comment_id,
				text: dataInput.text,
				media_url: url,
				media_type: dataInput.media.type,
				user_id: user.user_id,
				username: user.name,
			});
		}

		setDataInput({
			text: "",
			media: { url: null, type: null, file: null },
		});
	};

	// console.log(post);
	const handleFileDataComment = (e) => {
		convertFileToDataURL(e.target.files[0]).then((url) => {
			setDataInput({
				...dataInput,
				media: { url, type: e.target.files[0].type, file: e.target.files[0] },
			});
		});
	};

	const [focusInput, setFocusInput] = useState(false);
	const [showEmoji, setShowEmoji] = useState(false);

	const handleEmojiSelect = (emoji) => {
		setDataInput({ ...dataInput, text: dataInput.text + emoji.native });
	};
	useEffect(() => {}, [dataInput]);
	// console.log("state: focus", focusInput);
	return (
		<SBox>
			<InputMultiline
				noBorder
				noOutline
				maxHeight={"400px"}
				onChange={(e) => setDataInput({ ...dataInput, text: e.target.value })}
				style={{ outline: "none", border: "none" }}
				onFocus={() => {
					{
						setFocusInput(true);
						setShowEmoji(false);
					}
				}}
				onBlur={() => {
					if (dataInput.text !== "" || dataInput.media.url !== null) {
						setFocusInput(true);
					} else {
						setFocusInput(false);
					}
				}}
				value={dataInput.text}
				autoInserRow={true}
				label="Add a comment..."
				variant={"placeholder"}
				rows={1}
			/>
			<div className="post__comment-actions">
				<BoxAction focusInput={focusInput}>
					<div className="post__comment-box-item">
						{!dataInput.media.url && (
							<div className="post__comment-icon">
								<IconButton onClick={() => fileInputRef.current.click()}>
									<LuImage size={20} />
								</IconButton>

								<input
									ref={fileInputRef}
									onChange={handleFileDataComment}
									className="post__comment-file"
									accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/quicktime"
									type="file"
								/>
							</div>
						)}
						<div>
							<IconButton onClick={() => setShowEmoji(!showEmoji)}>
								<LuSmile size={20} />
							</IconButton>

							<div
								style={{
									position: "absolute",
									zIndex: 10,
								}}
							>
								{showEmoji && (
									<PickerEmoji
										perLine={width < 675 ? 7 : 9}
										onSelected={handleEmojiSelect}
									/>
								)}
							</div>
						</div>
					</div>
					<div className="post__comment-box-item">
						<IconButton onClick={handlePostComment}>
							<LuSendHorizonal size={25} />
						</IconButton>
					</div>
				</BoxAction>
				{dataInput.media.url && (
					<div className="post__comment-preview">
						{dataInput.media.type.includes("image") ? (
							<img
								className="post__comment-media"
								src={dataInput.media.url}
								alt=""
							/>
						) : (
							<video
								className="post__comment-media"
								src={dataInput.media.url}
								controls
							/>
						)}
						<div
							className="
                  post__comment-preview-close"
						>
							<IconButton
								onClick={() =>
									setDataInput({
										...dataInput,
										media: { url: null, type: null, file: null },
									})
								}
							>
								<LuXCircle size={30} />
							</IconButton>
						</div>
					</div>
				)}
			</div>
		</SBox>
	);
};
export default InputItem;
