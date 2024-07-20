import React, { useCallback, useEffect, useRef } from "react";
import { IoMdClose, IoMdArrowBack } from "react-icons/io";
import { CSSTransition } from "react-transition-group";
import { FaUserGroup } from "react-icons/fa6";
import {
	MdPublic,
	MdLock,
	MdOutlineAddReaction,
	MdEdit,
	MdClose,
} from "react-icons/md";
import { LuImagePlus } from "react-icons/lu";
import "./create-post.css";
import { useState } from "react";

import { createPost } from "../api/post";
import Dialog from "~/components/ui/dialog/dialog";
import InputMultiline from "~/components/ui/text-field/input-multiline";
import { IconButton } from "~/components/ui/button/icon-button";
import Avatar from "~/components/ui/avatar/avatar";
import { Button, ButtonSizes, ButtonVariants } from "~/components/ui/button";
import { useViewport } from "~/context/viewportContext";
import PickerEmoji from "~/lib/picker-emoji";
import useUser from "~/hooks/use-user";
import { uploadFiles } from "../api/uploadImage";
import MediaPreview from "~/features/media-viewer/components/media-preview";
import styled, { css } from "styled-components";
import MenuEditor from "./menu-editor";
import { BsArrowLeftCircle, BsArrowRightCircle } from "react-icons/bs";
import { blobToBase64, getBase64 } from "~/utils/utilFileToBase64";
import pLimit from "p-limit";
import PostItem from "./post-item";
const BoxHeader = styled.div`
display: flex;
justify-content: space-between;
align-items: center;
width: 100%;
`;
const BoxButtonHeader = styled.div`
display: flex;
gap: 15px;
align-items: center;
`;
const BoxButton = styled.div`
display: flex;
gap: 5px;
align-items: center;
`;

const ButtonItem = styled.div`
display: flex;
align-items: center;
cursor: pointer;
${(props) =>
	props.disabled &&
	css`
  color: gray;
  pointer-events: none;
  opacity: 0.5;
  cursor:initial;
`}
`;
const CreatePost = ({ isModalOpen, setIsModalOpen }) => {
	const user = useUser();
	if (user === null) return null;

	const [content, setContent] = useState("");
	const [privacy, setPrivacy] = useState("public");
	const [menu, setMenu] = useState("main");
	const [menuHistory, setMenuHistory] = useState(["main"]);
	const [posts, setPosts] = useState([]);

	const onTextChange = (e) => {
		setContent(e.target.value);
	};

	const handleMenuChange = (newMenu) => {
		setMenu(newMenu);
		setMenuHistory((prevHistory) => [...prevHistory, newMenu]);
	};

	const handleUndo = () => {
		setMenuHistory((prevHistory) => {
			if (prevHistory.length > 1) {
				const newHistory = prevHistory.slice(0, -1);
				setMenu(newHistory[newHistory.length - 1]);
				return newHistory;
			}
			return prevHistory;
		});
	};

	const itemsPrivacy = [
		{
			icon: <MdPublic />,
			label: "Public",
			value: "public",
		},
		{
			icon: <MdLock />,
			label: "Only me",
			value: "private",
		},
		{
			icon: <FaUserGroup />,
			label: "Friends",
			value: "friends",
		},
	];

	const [media, setMedia] = useState([]);

	const handleImageChange = (e) => {
		const files = e.target.files;
		const newFilesArray = Array.from(files);
		const newMedia = newFilesArray.map((file) => {
			return {
				mediaUrl: URL.createObjectURL(file),
				mediaType: file.type,
				description: "",
			};
		});
		setMedia((prevMedia) => [...prevMedia, ...newMedia]);
	};

	const saveButtonRef = useRef(null);

	const handleSaveEditor = () => {
		if (menu === "editfile") {
			handleUndo();
		}
		if (saveButtonRef.current) {
			saveButtonRef.current.onClick();
			handleUndo();
		}
	};
	const [index, setIndex] = useState(0);

	const fileInputRef = useRef(null);
	const [showEmoji, setShowEmoji] = useState(false);
	const handleEmojiSelect = (emoji) => {
		setContent(content + emoji.native);
	};
	const { width } = useViewport();

	const maxWidth = useCallback((menu) => {
		switch (menu) {
			case "editfile":
				return "600px";
			case "editor":
				return "600px";
			default:
				return "600px";
		}
	}, []);

	const [menuHeight, setMenuHeight] = useState(null);
	const calcHeight = (el) => {
		const height = el.offsetHeight;
		setMenuHeight(height);
	};

	const handlePost = async () => {
		setIsModalOpen(false);
		console.log(privacy);
		const limit = pLimit(10);

		const aPromise = [];
		media.map((item) => {
			aPromise.push(
				limit(async () => {
					const blob = await fetch(item.mediaUrl).then((res) => res.blob());
					const base64 = await blobToBase64(blob);
					if (base64) {
						return {
							mediaUrl: base64,
							mediaType: item.mediaType,
							description: item.description,
						};
					}
				}),
			);
		});
		const m = await Promise.all(aPromise);
		console.log(m);

		const body = {
			content: content,
			privacy: privacy,
			media: m,
		};

		const response = await createPost(body);

		if (response.code === 200) {
			console.log(response);
			const aPromise = [];
			response.data.mediaCreate.map(async (item, index) => {
				if (m) {
					aPromise.push(
						limit(async () => {
							await uploadFiles(m[index].mediaUrl, "up_post", item.mediaUrl);
						}),
					);
				}
			});
			await Promise.all(aPromise);
			const newData = {
				avatarUrl: user.avatarUrl,
				commentCount: "0",
				...response.data,
				name: user.name,
				username: user.username,
				voteCount: "0",
				userVote: null,
			};
			setPosts((prev) => {
				const newPost = [newData, ...prev];
				return newPost;
			});
		}
	};
	const HeaderContent = () => {
		return (
			<BoxHeader>
				<IconButton
					onClick={() => {
						if (menu === "main") {
							setIsModalOpen(false);
							// setMedia([]);
							setContent("");
						} else {
							handleUndo();
						}
					}}
					size={30}
				>
					{menu === "main" ? (
						<IoMdClose size={30} />
					) : (
						<IoMdArrowBack size={30} />
					)}
				</IconButton>

				<div style={{ display: "flex", gap: "10px" }}>
					{menu !== "main" ? (
						<BoxButtonHeader>
							{media.length >= 2 && menu === "editor" && (
								<BoxButton>
									<ButtonItem
										onClick={() => {
											setIndex(index - 1);
										}}
										disabled={index <= 0}
									>
										<BsArrowLeftCircle size={30} />
									</ButtonItem>
									<ButtonItem
										onClick={() => {
											setIndex(index + 1);
										}}
										disabled={index >= media.length - 1}
									>
										<BsArrowRightCircle size={30} />
									</ButtonItem>
								</BoxButton>
							)}
							<Button onClick={handleSaveEditor}>Save</Button>
						</BoxButtonHeader>
					) : (
						<Button onClick={handlePost}>Post</Button>
					)}
				</div>
			</BoxHeader>
		);
	};

	const FooterContent = () => {
		return (
			menu === ("main" || "custom") && (
				<div className="create-post__upload-item">
					<IconButton onClick={() => fileInputRef.current.click()}>
						<LuImagePlus size={25} />
					</IconButton>
					<div>
						<IconButton onClick={() => setShowEmoji(!showEmoji)}>
							<MdOutlineAddReaction size={25} />
						</IconButton>
						<div
							style={{
								position: "fixed",
							}}
						>
							{showEmoji && (
								<PickerEmoji
									perLine={width < 675 ? 7 : 9}
									onSelected={handleEmojiSelect}
								/>
							)}
						</div>
					</div>
					<input
						style={{
							display: "none",
						}}
						ref={fileInputRef}
						multiple
						onChange={handleImageChange}
						accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/quicktime"
						type="file"
					/>
				</div>
			)
		);
	};
	return (
		<div>
			{posts.map((post) => (
				<PostItem post={post} setPosts={setPosts} />
			))}
			<Dialog
				maxWidth={maxWidth(menu)}
				onClose={() => setIsModalOpen(false)}
				isOpen={isModalOpen}
				headerContent={<HeaderContent />}
				footerContent={<FooterContent />}
				height={menu === "editor" ? "100%" : "fit-content"}
			>
				<div style={{ overflow: "hidden" }}>
					<CSSTransition
						in={menu === "main"}
						timeout={500}
						unmountOnExit
						classNames="menu-primary"
					>
						<div className="create-post-container">
							<div className="create-post-container__header">
								<Avatar src={user.avatarUrl} />
								<div
									style={{
										display: "flex",
										flexDirection: "column",
									}}
								>
									<p>{user.name}</p>
									<div
										style={{
											cursor: "pointer",
											background: "var(--color-gray-200)",
											paddingInline: "7px",
											borderRadius: "12px",
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											gap: "5px",
										}}
										onClick={() => {
											setMenu("custom");
										}}
									>
										{itemsPrivacy.find((item) => item.value === privacy).icon}
										{itemsPrivacy.find((item) => item.value === privacy).label}
									</div>
								</div>
							</div>
							<InputMultiline
								size={"superlarge"}
								onChange={onTextChange}
								value={content}
								autoInserRow={true}
								label="What is happening?!"
								variant={"placeholder"}
								rows={2}
								noBorder
								noOutline
							/>
							<div
								style={{
									position: "relative",
								}}
							>
								<div
									style={{
										position: "absolute",
										zIndex: "4000",
										display: "flex",
										width: "100%",
										justifyContent: "space-between",
										alignItems: "center",
										marginTop: "10px",
										paddingInline: "10px",
									}}
								>
									<Button
										startIcon={<MdEdit size={25} />}
										onClick={() => handleMenuChange("editfile")}
									>
										Edit
									</Button>
									<IconButton
										onClick={() => {
											setPreview([]);
										}}
										backgroundColor="var(--color-gray-200)"
									>
										<MdClose size={30} />
									</IconButton>
								</div>
								<MediaPreview media={media} />
							</div>
						</div>
					</CSSTransition>

					<CSSTransition
						in={menu === "custom"}
						timeout={500}
						unmountOnExit
						classNames="menu-secondary"
					>
						<div className="create-post-container">
							<p>
								Who can see your post?
								<br />
								Your post will appear in Feed, on your profile and in search
								results. Your default audience is set to Public, but you can
								change the audience of this specific post.
							</p>
							{/*TODO: create inputCustom*/}
							{/* <InputRadio */}
							{/*   name="privacy" */}
							{/*   items={itemsPrivacy} */}
							{/*   value={valueRadio} */}
							{/*   onChange={handleRadioChange} */}
							{/* /> */}
						</div>
					</CSSTransition>

					<CSSTransition
						in={menu === "editfile"}
						timeout={500}
						unmountOnExit
						classNames="menu-secondary"
					>
						<CSSEdit
							media={media}
							setMedia={setMedia}
							setMenu={handleMenuChange}
							setIndex={setIndex}
						/>
					</CSSTransition>

					<CSSTransition
						in={menu === "editor"}
						timeout={500}
						unmountOnExit
						classNames="menu-secondary"
					>
						<MenuEditor
							setMedia={setMedia}
							media={media}
							ref={saveButtonRef}
							index={index}
						/>
					</CSSTransition>
				</div>
			</Dialog>
		</div>
	);
};

export default CreatePost;

const BoxEdit = styled.div`
display: grid;
background-color: #E4E6EB;
grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
gap: 10px;
padding:10px;
`;

const BoxItem = styled.div`
display: flex;
flex-direction: column;
gap: 10px;
border-radius: 10px;
position: relative;
background-color: white;
`;
const BoxImg = styled.div`
display: flex;
align-items: center;
background-color: #eeeeee;
margin: auto;
${(props) => {
	return css`
background-image: url(${props.media.mediaUrl});
`;
}} 
`;
const BoxDescription = styled.div`
margin-inline: 10px;
margin-bottom: 10px;
`;
const BoxAction = styled.div`
display: flex;
justify-content: space-between;
align-items: center;
position: absolute;
margin: 10px;
left: 5px;
right: 5px;
`;
const CSSEdit = ({ media, setMedia, setMenu, setIndex }) => {
	return (
		<BoxEdit>
			{media.map((m, index) => (
				<BoxItem>
					<BoxImg media={m}>
						{m.mediaType.includes("image") ? (
							<img
								style={{
									display: "block",
									objectFit: "contain",
									maxHeight: "200px",
								}}
								key={index}
								src={m.mediaUrl}
								alt="image"
								className="create-post-container__preview"
							/>
						) : (
							<video
								controls="controls"
								preload="metadata"
								style={{
									display: "block",
									// width: "300px",
									objectFit: "contain",
									maxHeight: "200px",
								}}
								key={index}
								alt="video"
								className="create-post-container__preview"
							>
								<source src={m.mediaUrl} type="video/mp4" />
							</video>
						)}
					</BoxImg>
					<BoxDescription>
						<InputMultiline
							label="Description"
							variant="filled"
							rows={2}
							value={media[index].description}
							onChange={(e) => {
								setMedia((prevMedia) => {
									return prevMedia.map((item, i) => {
										if (i === index) {
											return {
												...item,
												description: e.target.value,
											};
										}
										return item;
									});
								});
							}}
						/>
					</BoxDescription>
					<BoxAction>
						<Button
							variant={ButtonVariants.CONTAINED}
							size={ButtonSizes.MEDIUM}
							onClick={() => {
								setMenu("editor");
								setIndex(index);
							}}
						>
							Edit
						</Button>

						<IconButton
							noHover
							backgroundColor="var(--color-gray-200)"
							onClick={() => {
								setMedia((prev) => prev.filter((_, i) => i !== index));
							}}
						>
							<MdClose size={25} />
						</IconButton>
					</BoxAction>
				</BoxItem>
			))}
		</BoxEdit>
	);
};
