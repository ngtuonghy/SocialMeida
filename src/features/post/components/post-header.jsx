import Cookies from "js-cookie";
import React, { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import styled from "styled-components";
import Avatar from "~/components/ui/avatar/avatar";
import { IconButton } from "~/components/ui/button/icon-button";
import { formatTime } from "~/utils/utilTime";
import { Link } from "react-router-dom";
import {
  MdOutlineDelete,
  MdOutlineModeEdit,
  MdOutlinePushPin,
} from "react-icons/md";
import { deletePost, updateReaction, getPostById, getPost } from "../api/post";
const BoxHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: space-between;
`;
const BoxItemHeader = styled.div`
  display: flex;
  align-items: start;
  flex-direction: column;
`;
const SLink = styled(Link)`
  text-decoration: none;
  color: black;
  font-size: 15px;
  font-weight: 600;
`;
const Time = styled.p`
  font-size: 12px;
`;

const BoxLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;
const PostHeader = ({ post }) => {
  const [postAction, setPostAction] = useState(false);
  const handleThreeDots = async (e) => {
    postAction === e ? setPostAction(null) : setPostAction(e);
  };

  return (
    <BoxHeader>
      <BoxLeft>
        <Avatar src={post.avatar_url} to={`/${post.username}`} />
        <BoxItemHeader>
          <SLink to={`/${post.username}`}>{post.name}</SLink>
          <Time>{formatTime(post.created_at)}</Time>
        </BoxItemHeader>
      </BoxLeft>
      <IconButton onClick={() => handleThreeDots(!postAction)}>
        <BsThreeDots size={20} />
      </IconButton>
      {postAction && Cookies.get("userId") === post.user_id && (
        <div className="post__custom">
          <div className="post__custom-item">
            <MdOutlinePushPin size={20} />
            <p>Pin post</p>
          </div>
          <div
            className="post__custom-item"
            onClick={() => handleEditPost(post.post_id)}
          >
            <MdOutlineModeEdit size={20} />
            <p>Edit post</p>
          </div>
          <div
            className="post__custom-item"
            onClick={async () => {
              deletePost(post.post_id);
            }}
          >
            <MdOutlineDelete color="red" size={20} />
            <p style={{ color: "red" }}>Delete</p>
          </div>
        </div>
      )}
    </BoxHeader>
  );
};

export default PostHeader;
