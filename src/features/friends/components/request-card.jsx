import { css, cva } from "@panda-css/css";
import { Stack, HStack, VStack } from "@panda-css/jsx";
import React, { useState } from "react";
import { Button } from "~/components/ui/button/nbutton";

import useUser from "~/hooks/use-user";
import { removeFriend } from "../api/remove-friend";
import { formatTime2 } from "~/utils/utilTime";
import { acceptFriendRequest } from "../api/accept-friend";

export const RequestCard = ({ friend }) => {
	const [loading, setLoading] = useState(true);
	const [friendDetails, setFriendDetails] = useState(friend);
	const [deleted, setDeleted] = useState(false);
	const [comfirmed, setComfirmed] = useState(false);
	const user = useUser();

	const handleDelete = async () => {
		setLoading(true);
		await removeFriend(user.userId, friendDetails.userId);
		setDeleted(true);
	};

	const handleComfirm = async () => {
		setComfirmed(true);
		await acceptFriendRequest(user.userId, friendDetails.userId);
	};

	// console.log(friendDetails);
	return (
		<HStack
			alignItems={"center"}
			border={"none"}
			borderRadius={"md"}
			sm={{
				flexDirection: "column",
				boxShadow:
					"rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px;",
			}}
		>
			<img
				className={css({
					width: "100px",
					height: "100px",
					aspectRatio: "1/1",
					objectFit: "cover",
					borderRadius: "50%",
					sm: {
						width: "100%",
						height: "auto",
						borderRadius: "initial",
						borderTopLeftRadius: "md",
						borderTopRightRadius: "md",
					},
				})}
				src={friendDetails.avatarUrl}
				alt={friendDetails.name}
			/>
			<Stack width={"full"} px="2" paddingBottom="2">
				<HStack justifyContent={"space-between"}>
					<h4
						className={css({
							whiteSpace: "nowrap",
							overflow: "hidden",
							textOverflow: "ellipsis",
						})}
					>
						{friendDetails.name}
					</h4>
					<span
						style={{
							whiteSpace: "nowrap",
						}}
					>
						{formatTime2(friendDetails.createdAt)}
					</span>
				</HStack>
				<HStack
					sm={{
						flexDirection: "column",
					}}
				>
					{
						<Button
							visibility={deleted ? "hidden" : "initial"}
							onClick={handleComfirm}
							disabled={comfirmed}
						>
							{comfirmed ? "Request accept" : "Accept"}
						</Button>
					}
					<Button
						visibility={comfirmed ? "hidden" : "initial"}
						onClick={handleDelete}
						variant="outlined"
						colorPalette={"red"}
						disabled={deleted}
					>
						{deleted ? "Request deleted" : "Delete"}
					</Button>
				</HStack>
			</Stack>
		</HStack>
	);
};
