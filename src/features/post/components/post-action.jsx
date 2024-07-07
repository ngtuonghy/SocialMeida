import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import haha from "~/assets/haha.svg";
import like from "~/assets/like.svg";
import wow from "~/assets/wow.svg";
import love from "~/assets/love.svg";
import angry from "~/assets/angry.svg";
import care from "~/assets/care.svg";
import sad from "~/assets/sad.svg";
import { BiComment, BiLike, BiShare } from "react-icons/bi";
import Expressive from "~/components/ui/expressive/show-expressive";
import { updateReaction } from "../api/post";

const Box = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  flex-direction: column;
  align-items: start;
  gap: 10px;
  position: relative;
  gap: 5px;
`;

const BoxInfo = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const BoxInfoReaction = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const InfoImg = styled.img`
  width: 18px;
  height: 18px;
  border-radius: var(--border-radius-rounded);
  border: 1px solid white;
  object-fit: cover;
  ${(props) => (props.index > 0 ? "margin-left: -3px" : "")}
`;
const InfoCountComment = styled.div`
  display: flex;
  gap: 5px;
  font-size: 15px;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;
const Action = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
  justify-content: space-between;
  width: 100%;
  color: var(--color-gray-500);
  border-block: 1px solid var(--color-gray-300);
`;
const IconBox = styled.div`
  user-select: none;
  border-radius: var(--border-radius-medium);
  width: 100%;
  display: flex;
  padding: 4px;
  margin-block: 4px;
  justify-content: center;
  gap: 10px;
  align-items: center;
  position: relative;
  &:hover {
    background-color: var(--color-gray-100);
  }
`;

const ShowExpressive = styled.div`
  position: absolute;
  bottom: calc(100%); /* Đặt ở vị trí dưới của nút "Like" */
  left: 0;
  transform: translateY(100%); /* Ban đầu ẩn bên dưới */
  transition:
    transform 0.3s ease,
    opacity 0.3s ease; /* Hiệu ứng trượt dưới và hiển thị mượt mà */
  display: flex;
  visibility: hidden;
  align-items: center;
  justify-content: center;
  z-index: 999;
  opacity: 0; /* Ban đầu ẩn */
  ${(props) =>
    props.isShowReaction &&
    `
  visibility: visible;
  transform: translateY(0);
  opacity: 1; /* Hiển thị */
`}
`;

const PostAction = ({ post, setIsModalOpen, isModalOpen, setReact, react }) => {
  // if (!post) return null;
  const reaction = [
    {
      text: "like",
      title: "Like",
      img: like,
    },
    {
      text: "love",
      title: "Love",
      img: love,
    },
    {
      text: "sad",
      title: "Sad",
      img: sad,
    },
    {
      text: "care",
      title: "Care",
      img: care,
    },
    {
      text: "haha",
      title: "Haha",
      img: haha,
    },
    {
      text: "wow",
      title: "Wow",
      img: wow,
    },
    {
      text: "angry",
      title: "Angry",
      img: angry,
    },
  ];
  const [isShowReaction, setIsShowReaction] = useState(false);

  const hoverTimeoutRef = useRef(null);

  const handleLikeHover = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setIsShowReaction(true);
    }, 800);
  };
  const handleLikeLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setIsShowReaction(false);
    }, 1000);
  };

  const handleLike = async () => {
    if (react) {
      setReact(null);
      await updateReaction({ reaction: null, postId: post.post_id });
    } else {
      setReact("like");
      await updateReaction({ reaction: "like", postId: post.post_id });
    }
  };

  const handleReaction = async (e) => {
    setReact(e.target.alt);
    setIsShowReaction(false);
    await updateReaction({ reaction: e.target.alt, postId: post.post_id });
  };

  // const [react, setReact] = useState(null);

  const userReaction = reaction.find((r) => r.text === react);
  useEffect(() => {
    setReact(post.current_user_reaction);
  }, [post]);
  // console.log(post);
  return (
    <Box>
      <BoxInfo>
        <BoxInfoReaction>
          {Array.isArray(post.top_reactions) &&
            post.top_reactions !== null &&
            post.top_reactions.map((react, index) => {
              if (react.reaction !== null) {
                return (
                  <InfoImg
                    key={index}
                    index={index}
                    src={reaction.find((r) => r.text === react.reaction).img}
                    alt="react"
                  />
                );
              }
              return null;
            })}
          {post.reaction_count > 0 && (
            <span style={{ marginLeft: "5px" }}>{post.reaction_count}</span>
          )}
        </BoxInfoReaction>
        <InfoCountComment
          onClick={() => {
            !isModalOpen && setIsModalOpen(true);
          }}
        >
          {post.comment_count} comments
        </InfoCountComment>
      </BoxInfo>
      <Action>
        <IconBox
          onMouseEnter={handleLikeHover}
          // onClick={handleLike}
          onMouseLeave={handleLikeLeave}
          onTouchStart={handleLikeHover}
          onTouchEnd={handleLikeLeave}
        >
          {react !== null && userReaction ? (
            <>
              <img
                src={userReaction.img}
                alt={userReaction.text}
                style={{ width: "20px", height: "20px" }}
              />
              <span>{userReaction.title}</span>
            </>
          ) : (
            <>
              <BiLike size={25} />
              <span>Like</span>
            </>
          )}

          <ShowExpressive isShowReaction={isShowReaction}>
            <Expressive onClick={handleReaction} size={40} />
          </ShowExpressive>
        </IconBox>
        <IconBox
          onClick={() => {
            !isModalOpen && setIsModalOpen(true);
          }}
        >
          <BiComment size={25} />
          <span>Comment</span>
        </IconBox>
        <IconBox>
          <BiShare size={25} />
          <span>Share</span>
        </IconBox>
      </Action>
    </Box>
  );
};

export default PostAction;
