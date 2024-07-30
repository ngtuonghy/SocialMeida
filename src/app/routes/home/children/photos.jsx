import { AdvancedImage, lazyload, placeholder } from "@cloudinary/react";
import { Delivery } from "@cloudinary/url-gen/actions";
import { css } from "@panda-css/css";
import { Box, HStack, VStack } from "@panda-css/jsx";
import React, { useEffect } from "react";
import { useState } from "react";
import { HiChevronDoubleLeft } from "react-icons/hi2";
import { IoMdClose } from "react-icons/io";
import { MdClose } from "react-icons/md";
import {
	PiArrowCircleLeftLight,
	PiArrowCircleRightLight,
} from "react-icons/pi";
import { useSelector } from "react-redux";
import {
	useLocation,
	useNavigate,
	useOutletContext,
	useParams,
	useSearchParams,
} from "react-router-dom";
import Avatar from "~/components/ui/avatar/avatar";
import { cloudinary } from "~/lib/cloudinary";

const PhotosRoute = () => {
	let { photoId, postId } = useParams();
	const [media, setMedia] = React.useState(null);
	const [a, setA] = useState([]);
	const [post, setPost] = React.useState(null);
	const posts = useSelector((state) => state.posts.data);
	let navigate = useNavigate();
	const location = useLocation();
	const { backgroundLocation } = useOutletContext();
	const [storeLocation, setStoreLocation] = useState(backgroundLocation);

	const updatePhotoId = (next) => {
		const nextIndex = a.findIndex((val) => val.id === photoId);
		let nex;
		if (next === "next") {
			nex = a[nextIndex + 1].id;
		} else {
			nex = a[nextIndex - 1].id;
		}
		const newPathname = location.pathname.replace(/\/[^/]+$/, `/${nex}`);
		navigate(newPathname);
	};

	useEffect(() => {
		const post = posts.find((post) => post.postId === postId);
		if (post) {
			setPost(post);
		}
	}, [posts]);

	useEffect(() => {
		if (post) {
			post.mediaUrls.forEach((media) => {
				const id = media.mediaUrl.split("_")[1];
				setA((prev) => [...prev, { id, media }]);
				if (photoId === id) {
					setMedia(media);
				}
			});
		}
	}, [post]);

	useEffect(() => {
		if (a.length > 0) {
			const media = a.find((val) => val.id === photoId);
			setMedia(media.media);
		}
	}, [photoId]);

	const img = (media) => {
		return cloudinary.image(media.mediaUrl);
	};
	const vid = (media) => {
		return cloudinary.video(media.mediaUrl);
	};
	return (
		<Box
			className={css({
				position: "fixed",
				color: "white",
				inset: 0,
				backgroundColor: "rgba(0,0,0,0.9)",
				zIndex: "1000",
				width: "full",
				height: "full",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				userSelect: "none",
			})}
		>
			{media && (
				<HStack
					w="full"
					h="100%"
					flex={"0 0 100%"}
					alignItems={"stretch"}
					position={"relative"}
				>
					<VStack
						position={"relative"}
						flex={{
							md: "0 0 80%",
							base: "0 0 100%",
						}}
						margin={"auto"}
					>
						<AdvancedImage
							className={css({
								maxH: "100vh",
								maxW: "full",
								objectFit: "contain",
							})}
							cldImg={img(media).delivery(Delivery.quality("auto"))}
							plugins={[lazyload(), placeholder()]}
						/>

						{photoId > 0 && (
							<Box
								onClick={() => updatePhotoId("prev")}
								position={"absolute"}
								top={"50%"}
								left={"2"}
								transform={"translateY(-50%)"}
							>
								<PiArrowCircleLeftLight size={40} />
							</Box>
						)}
						{photoId < post.mediaUrls.length - 1 && (
							<Box
								onClick={() => updatePhotoId("next")}
								position={"absolute"}
								top={"50%"}
								right={"2"}
								transform={"translateY(-50%)"}
							>
								<PiArrowCircleRightLight size={40} />
							</Box>
						)}
					</VStack>
					<Box
						onClick={() => {
							navigate(storeLocation);
						}}
						position={"absolute"}
						top={"3"}
						left={"3"}
						display="flex"
						alignItems="center"
						justifyContent="center"
						borderRadius={"50%"}
						cursor={"pointer"}
						p="0.5"
						bg="inherit"
						_hover={{ bg: "rgba(0,0,0,0.8)" }}
					>
						<MdClose size={30} onClick={() => {}} />
					</Box>
					<Box
						display={{
							base: "none",
							md: "block",
						}}
						borderLeft={"1px solid red"}
						h="100%"
						alignSelf={"flex-start"}
						flex={"0 0 20%"}
					>
						<Post post={post} />
					</Box>
				</HStack>
			)}
		</Box>
	);
};
export default PhotosRoute;

const Post = ({ post }) => {
	return (
		<Box p="2" w="full">
			<HStack>
				<Avatar src={post.avatarUrl} size={40} />
				<p>{post.name}</p>
			</HStack>
			<p>{post.content}</p>
		</Box>
	);
};
