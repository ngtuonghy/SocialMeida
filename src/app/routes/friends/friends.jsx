import { Box } from "@panda-css/jsx";
import { useMemo } from "react";
import FriendLayout from "~/components/layouts/friend-layout";
import { FriendsRequest } from "~/features/friends/components/friends-request";

const FriendsRoute = () => {
	return (
		<FriendLayout>
			<Box>
				<h3>Friends request</h3>
				<FriendsRequest />
			</Box>
		</FriendLayout>
	);
};

export default FriendsRoute;
