import { Box, HStack, VStack } from "@panda-css/jsx";
import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";

const FriendLayout = ({ children }) => {
	const params = useLocation().pathname;
	console.log("params", params);
	const menu = useMemo(() => {
		return [
			{ name: "All Friends", path: "/friends" },
			{ name: "Requests", path: "/friends/requests" },
		];
	});
	return (
		<HStack px={2.5} mt="var(--header-height)" alignItems="flex-start">
			<Box
				position="sticky"
				top="var(--header-height)"
				flexBasis="25%"
				display={{ base: "none", md: "block" }}
			>
				<VStack alignItems="flex-start">
					{menu.map((item) => (
						<Link to={item.path}>{item.name}</Link>
					))}
				</VStack>
			</Box>
			<Box flexBasis={{ base: "100%", md: "75%" }} overflowX={"hidden"}>
				{children}
			</Box>
		</HStack>
	);
};

export default FriendLayout;
