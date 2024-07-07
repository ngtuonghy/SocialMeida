import React, { useState, useRef, useEffect } from "react";
import useClickOutSide from "~/hooks/useClickOutSide";
import { deleteComment, getReplies } from "../api/comment";
import { formatTime2 } from "~/utils/utilTime";
import { useSelector } from "react-redux";
import AlertDialog from "~/components/ui/dialog/alert-dialog";
import { Link } from "react-router-dom";
import { IconButton } from "~/components/ui/button/icon-button";
import InputItem from "./comment-input";
import { BsThreeDots } from "react-icons/bs";
import { socket } from "~/socket";
import styled, { css } from "styled-components";
import Avatar from "~/components/ui/avatar/avatar";
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
  padding-bottom: 10px;
  padding-top: 5px;
  align-content: flex-start;
  flex-direction: column;
  position: relative;
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
  gap: 10px;
  align-items: flex-start;
  width: 100%;
  position: relative;
  margin-left: 42px;
`;
const CommentItem = ({ comment, post, setListComment }) => {
  const user = useSelector((state) => state.user.user);
  const [singleComment, setSingleComment] = useState(comment);
  const [isReply, setIsReply] = useState(false);
  const [isShowMenu, setIsShowMenu] = useState(false);
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const ref = useRef(null);

  const handleViewAllReply = async () => {
    try {
      const res = await getReplies(singleComment.comment_id);
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
      if (data.replyComment !== singleComment.comment_id) return;
      setSingleComment((prevDataComment) => ({
        ...prevDataComment,
        replies: [...(prevDataComment.replies || []), data],
      }));
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
    if (commentId === singleComment.comment_id) {
      setSingleComment(null);
    } else {
      if (Array.isArray(singleComment.replies)) {
        const newReplies = singleComment.replies.filter(
          (reply) => reply.comment_id !== commentId,
        );
        setSingleComment({ ...singleComment, replies: newReplies });
      }
    }
  };

  const handleComfirmDelete = async () => {
    await deleteComment(singleComment.comment_id).then((res) => {
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
        <BoxItem show={singleComment.reply_count > 0 || singleComment.replies}>
          <Header>
            <Link to={`/${singleComment.username}`}>
              <ChildLine>
                <Avatar
                  to={`/${singleComment.username}`}
                  width="32px"
                  height="32px"
                  src={comment.avatar_url}
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
            <p className="comment__text">{singleComment.text}</p>
            {singleComment.media_url && (
              <SImage src={singleComment.media_url} alt="" />
            )}
            <div className="comment_time">
              <span className="">{formatTime2(singleComment.created_at)}</span>
              <p>Like</p>
              <p
                style={{ cursor: "pointer" }}
                onClick={() => setIsReply(!isReply)}
              >
                Reply
              </p>
            </div>
          </Content>
        </BoxItem>
      </BoxParent>
      <BoxChild show={singleComment.reply_count > 0 || singleComment.replies}>
        {Array.isArray(singleComment.replies)
          ? singleComment.replies.map((reply) => (
              <CommentItem
                key={reply.comment_id}
                comment={reply}
                line={false}
              />
            ))
          : singleComment.reply_count > 0 && (
              <ChildLine>
                <p
                  onClick={handleViewAllReply}
                  style={{
                    lineHeight: "1.33333",
                    fontSize: ".9375rem",
                    cursor: "pointer",
                  }}
                >
                  View all {singleComment.reply_count} replies
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
                  <Avatar width="32px" height="32px" src={user.avatar_url} />
                </ChildLine>
                <InputItem
                  key={singleComment.comment_id}
                  post={post}
                  comment={singleComment}
                  setDataReplied={setSingleComment}
                  dataReplied={singleComment}
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
