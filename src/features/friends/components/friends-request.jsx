import useUser from "~/hooks/use-user";
import { getFriendsRequest } from "../api/get-request";
import Loading from "./loading";
import { useEffect, useState } from "react";
import { RequestCard } from "./request-card";
import { Box, Grid, HStack } from "@panda-css/jsx";

export const FriendsRequest = () => {
	const [friends, setFriends] = useState([]);
	const [loading, setLoading] = useState(true);
	const user = useUser();
	useEffect(() => {
		setLoading(true);
		const fetchFriendsRequest = async () => {
			await getFriendsRequest(user.userId)
				.then((response) => {
					setFriends(response.data);
					setLoading(false);
				})
				.catch((error) => {
					console.log(error);
					setLoading(false);
				});
		};
		fetchFriendsRequest();
	}, [user]);
	// console.log(friends);
	if (loading) {
		return <Loading />;
	}
	return (
		<Grid
			transition={"all 0.3s"}
			sm={{
				gridTemplateColumns: "repeat(6,minmax(200px,1fr))",
				gap: 2,
			}}
		>
			{friends.map((friend) => (
				<RequestCard friend={friend} />
			))}
		</Grid>
	);
};
