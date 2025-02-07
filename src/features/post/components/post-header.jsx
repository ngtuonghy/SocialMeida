import React, { useCallback, useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import styled from "styled-components";
import Avatar from "~/components/ui/avatar/avatar";
import { IconButton } from "~/components/ui/button/icon-button";
import { formatTime } from "~/utils/utilTime";
import { Link } from "react-router-dom";
import {
	MdLock,
	MdOutlineDelete,
	MdOutlineModeEdit,
	MdPublic,
} from "react-icons/md";
import { deletePost } from "../api/post";
import Popover from "~/components/ui/pop-over/pop-over";
import { IoEyeOffOutline } from "react-icons/io5";
import Cookies from "js-cookie";
import { css } from "@panda-css/css";
import { HStack, VStack } from "@panda-css/jsx";
import { FaUserFriends } from "react-icons/fa";

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

const Time = styled.p`
  font-size: 12px;
`;

const BoxLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;
const PostHeader = ({ post, setShowPost, setPosts }) => {
	const [postAction, setPostAction] = useState(false);
	const handleThreeDots = async (e) => {
		postAction === e ? setPostAction(null) : setPostAction(e);
	};

	const Privacy = useCallback(({ privacy }) => {
		switch (privacy) {
			case "private":
				return <MdLock />;
			case "friends":
				return <FaUserFriends />;
			default:
				return <MdPublic />;
		}
	});
	return (
		<BoxHeader>
			<BoxLeft>
				<Avatar src={post.avatarUrl} to={`/${post.username}`} />
				<BoxItemHeader>
					<Link
						className={css({
							textDecoration: "none",
							alignItems: "center",
							fontWeight: 600,
							fontSize: "17px",
						})}
						to={`/${post.username}`}
					>
						{post.name}
					</Link>
					<HStack gap={"1"}>
						<Time>{formatTime(post.createdAt)}</Time>
						<Privacy privacy={post.privacy} />
					</HStack>
				</BoxItemHeader>
			</BoxLeft>
			<IconButton onClick={() => handleThreeDots(!postAction)}>
				<Popover
					buttonContent={
						<IconButton>
							<BsThreeDots size={20} />
						</IconButton>
					}
				>
					<ItemMenu post={post} setShowPost={setShowPost} setPosts={setPosts} />
				</Popover>
			</IconButton>
		</BoxHeader>
	);
};

export default PostHeader;

const Item = styled.div`
  display: flex;
  align-items: center;
  font-size: 18px;
  cursor: pointer;
  padding: 7px 22px;
  gap: 10px;
  justify-content: start;
  border-radius: var(--border-radius-small);
  &:hover {
    background-color: var(--color-gray-100);
  }
`;
const ItemText = styled.p`
  font-size: 15px;
  font-weight: 400;
`;
const ItemMenu = ({ post, setShowPost, setPosts }) => {
	const items = [
		{
			icon: <IoEyeOffOutline size={20} />,
			text: "Hide",
			auth: false,
			onclick: () => {
				setShowPost(false);
			},
		},
		{
			icon: <MdOutlineModeEdit size={20} />,
			text: "Edit",
			auth: true,
			onclick: () => {
				console.log("Edit");
			},
		},
		{
			icon: <MdOutlineDelete size={20} color="red" />,
			text: "Delete",
			auth: true,
			onclick: async () => {
				await deletePost({ postId: post.postId });

				setPosts((prev) => prev.filter((item) => item.postId !== post.postId));
			},
		},
	];

	return (
		<div>
			{items.map((item, index) => {
				if (item.auth && post.userId !== Cookies.get("userId")) {
					return null;
				}
				return (
					<Item onClick={item.onclick} key={index}>
						{item.icon}
						<ItemText>{item.text}</ItemText>
					</Item>
				);
			})}
		</div>
	);
};
