import React, { useState, useRef, useEffect } from "react";
import useClickOutSide from "~/hooks/useClickOutSide";
import { deleteComment, getReplies } from "../api/comment";
import { formatTime2 } from "~/utils/utilTime";
import { useSelector } from "react-redux";
import AlertDialog from "~/components/ui/dialog/alert-dialog";
import { Link } from "react-router-dom";
import { IconButton } from "~/components/ui/button/icon-button";
import CommentForm from "./comment-form";
import { BsThreeDots } from "react-icons/bs";
import { socket } from "~/socket";
import styled, { css } from "styled-components";
import Avatar from "~/components/ui/avatar/avatar";
import useUser from "~/hooks/use-user";
``;
import { MdOutlineError } from "react-icons/md";
import { addReplied } from "../utils/add-replied";
const SImage = styled.img`
  width: auto;
  display: block;
  max-width: 260px;
  height: auto;
  max-height: 170px;
  border-radius: 10px;
  object-fit: cover;
`;
const SBoxUserName = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;
const Box = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  position: relative;
  gap: 5px;
`;
const BoxParent = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  position: relative;
  // &:before {
  //   content: "";
  //   display: block;
  //   position: absolute;
  //   width: 1px;
  //   height: 100%;
  //   background-color: red;
  //   left: 16px;
  //   top: 100%;
  // }
`;
const BoxChild = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 10px;
  position: relative;
  padding-left: 40px;

  &:before {
    content: "";
    display: block;
    position: absolute;
    width: 1px;
    height: calc(100% - 40px);
    background-color: blue;
    left: 16px;
    top: -50px;
  }
`;
const BoxItem = styled.div`
  display: flex;
  align-content: flex-start;
  flex-direction: column;
  position: relative;
border-radius: 10px;
  ${(props) =>
		props.show &&
		css`
      &:before {
        content: "";
        display: block;
        position: absolute;
        width: 1px;
        height: calc(100% - 40px);
        background-color: brown;
        left: 16px;
        bottom: 0;
      }
    `}
`;
const ChildLine = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  position: relative;
  ${(props) =>
		!props.show &&
		css`
      &:before {
        content: "";
        height: 30px;
        width: 20px;
        position: absolute;
        border-left: 1px solid var(--color-gray-300);
        border-bottom: 1px solid var(--color-gray-300);
        border-bottom-left-radius: 8px;
        top: calc(50% - 15px);
        transform: translateY(-50%);
        left: -24px;
      }
    `}
`;

const Header = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  align-items: flex-start;
  width: 100%;
  position: relative;
  margin-left: 42px;
`;

const SInfoComment = styled.div`
  font-size: 0.7rem;
  color: var(--color-teal-6);
  display: flex;
  align-items: center;
  gap: 10px;
`;
const SBox = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;
const CommentItem = ({ comment, post }) => {
	const user = useUser();
	const [singleComment, setSingleComment] = useState(comment);
	const [isReply, setIsReply] = useState(false);
	const [isShowMenu, setIsShowMenu] = useState(false);
	const [isOpenDialog, setIsOpenDialog] = useState(false);
	const ref = useRef(null);

	useEffect(() => {
		setSingleComment(comment);
	}, [comment]);

	const handleViewAllReply = async () => {
		try {
			const res = await getReplies({
				commentId: singleComment.commentId,
				postId: post ? post.postId : comment.postId,
			});
			if (res.code === 200) {
				const replies = res.data;
				singleComment.replies = replies;
				if (singleComment.replies.length > 0) {
					setSingleComment({ ...singleComment, replies: replies });
				}
			} else {
				console.error("Failed to fetch replies.");
			}
		} catch (error) {
			console.error("Error fetching replies:", error);
		}
	};

	useEffect(() => {
		const handleReplyComment = (data) => {
			addReplied(data, singleComment.commentId, setSingleComment);
		};
		socket.on("replied-comment", handleReplyComment);
		// Clean up the event listener when the component unmounts or dataComment changes
		return () => {
			socket.off("replied-comment", handleReplyComment);
		};
	}, [singleComment]);
	// console.log(dataComment);

	const onClickEdit = () => {
		setIsShowMenu(false);
	};

	const onClickDelete = () => {
		setIsShowMenu(false);
		setIsOpenDialog(true);
	};

	const deleteCommentById = async (commentId) => {
		if (commentId === singleComment.commentId) {
			setSingleComment(null);
		} else {
			if (Array.isArray(singleComment.replies)) {
				const newReplies = singleComment.replies.filter(
					(reply) => reply.commentId !== commentId,
				);
				setSingleComment({ ...singleComment, replies: newReplies });
			}
		}
	};

	const handleComfirmDelete = async () => {
		await deleteComment({
			commentId: singleComment.commentId,
			postId: post.postId,
		}).then((res) => {
			if (res.code === 200) {
				deleteCommentById(singleComment.comment_id);
				console.log("You delete id: ", singleComment.comment_id);
			} else {
				console.error("Failed to delete comment");
			}
		});
	};

	useClickOutSide(ref, () => setIsShowMenu(false));

	if (singleComment === null) return null;
	// console.log(singleComment);
	return (
		<Box>
			<BoxParent>
				<AlertDialog
					title="Delete comment?"
					message={"Are you sure you want to delete this comment?"}
					isOpen={isOpenDialog}
					setIsOpen={setIsOpenDialog}
					onConfirm={handleComfirmDelete}
				/>
				<SBox>
					<BoxItem show={singleComment.replyCount > 0 || singleComment.replies}>
						<Header>
							<Link to={`/${singleComment.username}`}>
								<ChildLine>
									<Avatar
										to={`/${singleComment.username}`}
										width="32px"
										height="32px"
										src={comment.avatarUrl}
										alt=""
									/>
								</ChildLine>
							</Link>
							<SBoxUserName>
								<Link to={`/${singleComment.username}`}>
									<h5>{singleComment.name}</h5>
								</Link>
								<div
									style={{
										display: "flex",
										justifyContent: "center",
										alignItems: "center",
										position: "relative",
									}}
								>
									<IconButton onClick={() => setIsShowMenu(true)}>
										<BsThreeDots size={16} />
									</IconButton>
									{isShowMenu && (
										<div className="comment-actions-menu" ref={ref}>
											<div className="menu--item" onClick={onClickEdit}>
												<p>Edit</p>
											</div>
											<div className="menu--item" onClick={onClickDelete}>
												<p>Delete</p>
											</div>
										</div>
									)}
								</div>
							</SBoxUserName>
						</Header>
						<Content>
							<p className="comment__text">{singleComment.content}</p>
							{singleComment.mediaUrl && (
								<SImage src={singleComment.mediaUrl} alt="" />
							)}

							<SInfoComment>
								{singleComment.loading ? (
									<p>Posting</p>
								) : (
									<SBox>
										{singleComment.error ? (
											<p style={{ color: "red" }}>not successful</p>
										) : (
											<span className="">
												{formatTime2(singleComment.createdAt)}
											</span>
										)}
										<p>Like</p>
										<p
											style={{ cursor: "pointer" }}
											onClick={() => setIsReply(!isReply)}
										>
											Reply
										</p>
									</SBox>
								)}
							</SInfoComment>
						</Content>
					</BoxItem>
					{singleComment.error && <MdOutlineError color="red" size={20} />}
				</SBox>
			</BoxParent>
			<BoxChild show={singleComment.replyCount > 0 || singleComment.replies}>
				{Array.isArray(singleComment.replies)
					? singleComment.replies.map((reply) => (
							<CommentItem
								key={reply.comment_id}
								comment={reply}
								line={false}
							/>
						))
					: singleComment.replyCount > 0 && (
							<ChildLine>
								<p
									onClick={handleViewAllReply}
									style={{
										lineHeight: "1.33333",
										fontSize: ".9375rem",
										cursor: "pointer",
									}}
								>
									View all {singleComment.replyCount} replies
								</p>
							</ChildLine>
						)}
				{isReply && (
					<div
						style={{
							display: "flex",
							alignItems: "flex-start",
							gap: "10px",
						}}
					>
						{user ? (
							<>
								<ChildLine>
									<Avatar width="32px" height="32px" src={user.avatarUrl} />
								</ChildLine>
								<CommentForm
									key={singleComment.commentId}
									comment={singleComment}
									setComment={setSingleComment}
								/>
							</>
						) : (
							<div>Sign in to comment</div>
						)}
					</div>
				)}
			</BoxChild>
		</Box>
	);
};
export default CommentItem;
