import React, {} from "react";
import styled from "styled-components";
import { GoComment } from "react-icons/go";
import { updateVotePost } from "../api/post";
import { LuBookmark, LuHeart, LuShare } from "react-icons/lu";
import { IconContext } from "react-icons";
import useUser from "~/hooks/use-user";
import { FaHeart, FaRegHeart } from "react-icons/fa6";
import { AiOutlineRetweet } from "react-icons/ai";

const Box = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
padding-inline: 20px;
  align-items: center;
  gap: 10px;
  position: relative;
  gap: 5px;
`;

const SBox = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;

`;
const SBoxVote = styled.div`
  display: flex;
  gap:5px;
  align-items: center;
cursor: pointer;
  &:hover {
  color:red;
}
`;
const SBoxComment = styled.div`
  display: flex;
  gap: 5px;
  align-items: center;
cursor: pointer;
&:hover {
color: var(--color-primary-500);
}
`;
const SBoxRetweet = styled.div`
  display: flex;
  gap: 5px;
  align-items: center;
cursor: pointer;
&:hover {
color: green;
}
`;

const PostAction = ({
	post,
	setIsModalOpen,
	isModalOpen,
	setInfoVote,
	infoVote,
}) => {
	const VoteLove = ({ vote }) => {
		return (
			<IconContext.Provider
				value={{
					color: `${vote === "love" ? "red" : "black"}`,
					size: "20px",
				}}
			>
				{vote === "love" ? <FaHeart /> : <FaRegHeart />}
			</IconContext.Provider>
		);
	};

	const user = useUser();

	const countVote = (vote) => {
		let newVoteCount = parseInt(infoVote.voteCount);
		if (post.userVote === "love") newVoteCount -= 1;
		if (vote === "love") {
			return newVoteCount + 1;
		} else {
			return newVoteCount;
		}
	};

	const handleVote = async (vote) => {
		const newVote = vote === "love" ? null : "love";
		console.log(newVote);
		setInfoVote({ ...infoVote, vote: newVote });
		await updateVotePost(
			{ postId: post.postId, userId: user.userId },
			{ voteState: newVote },
		);
	};

	return (
		<Box>
			<SBoxVote onClick={() => handleVote(infoVote.vote)}>
				<VoteLove vote={infoVote.vote} />
				<span>{countVote(infoVote.vote)}</span>
			</SBoxVote>
			<SBoxComment
				onClick={() => {
					if (!isModalOpen && isModalOpen !== undefined) {
						setIsModalOpen(true);
					}
				}}
			>
				<GoComment size={20} />
				<span> {post.commentCount} </span>
			</SBoxComment>
			<SBoxRetweet>
				<AiOutlineRetweet size={20} />
				<span>0</span>
			</SBoxRetweet>
			<SBox>
				<LuBookmark size={20} />
				<LuShare size={20} />
			</SBox>
		</Box>
	);
};

export default PostAction;
