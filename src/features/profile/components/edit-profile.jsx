import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { CSSTransition } from "react-transition-group";
import { IoMdClose } from "react-icons/io";
import { MdOutlineCameraAlt } from "react-icons/md";
import Cookies from "js-cookie";
import "./edit-profile.css";
import { convertFileToDataURL } from "~/utils/utilFile";
import CropperImage from "~/features/cropper/components/cropper-image";
import Dialog from "~/components/ui/dialog/dialog";
import { Button } from "~/components/ui/button";
import Input from "~/components/ui/text-field/input";
import InputMultiline from "~/components/ui/text-field/input-multiline";
import { IconButton } from "~/components/ui/button/icon-button";
import { uploadFiles } from "~/features/post/api/uploadImage";
import { updateUser } from "../api/update-user";
import useUser from "~/hooks/use-user";
import MenuEditor from "./menu-editor";
import { blobToBase64 } from "~/utils/utilFileToBase64";
import pLimit from "p-limit";

const EditProfile = ({ profile, isModalOpen, setIsModalOpen }) => {
	const [menu, setMenu] = useState("main");

	const [profiles, setProfiles] = useState({});
	const [file, setFile] = useState(null);
	const [aspectRatio, setAspectRatio] = useState(1 / 1);
	const [menuHistory, setMenuHistory] = useState(["main"]);

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
	const user = useUser();
	useEffect(() => {
		setProfiles(user);
	}, [isModalOpen]);

	const handleInputProfile = async (e) => {
		const file = e.target.files[0];
		console.log(file);
		setFile(URL.createObjectURL(file));
		setAspectRatio(1 / 1);
		handleMenuChange("editor");
	};

	const handleInputCoverImg = (e) => {
		const file = e.target.files[0];
		setFile(URL.createObjectURL(file));
		setAspectRatio(16 / 9);
		handleMenuChange("editor");
	};

	const dropdownRef = useRef(null);

	useEffect(() => {
		setMenuHeight(dropdownRef.current?.firstChild.offsetHeight);
	}, []);

	const [menuHeight, setMenuHeight] = useState(null);

	function calcHeight(el) {
		const height = el.offsetHeight;
		setMenuHeight(height);
	}

	const saveButtonRef = useRef(null);
	const handleSave = () => {
		if (saveButtonRef.current && menu === "editor") {
			saveButtonRef.current.onClick();
			handleUndo();
		}
	};
	const handleApply = async () => {
		console.log("applu rin");
		console.log(profiles);
		let urlProfile = undefined;
		let urlCoverImg = undefined;
		const limit = pLimit(2);
		const aPromise = [];

		if (profiles.newAvatarUrl) {
			aPromise.push(
				limit(async () => {
					const blob = await fetch(profiles.newAvatarUrl).then((res) =>
						res.blob(),
					);
					const base64 = await blobToBase64(blob);
					await uploadFiles(base64, "up_profile", Cookies.get("userId"))
						.then((res) => res.json())
						.then((data) => (urlProfile = data.url));
				}),
			);
		}

		if (profiles.newCoverImageUrl) {
			aPromise.push(
				limit(async () => {
					const blob = await fetch(profiles.newCoverImageUrl).then((res) =>
						res.blob(),
					);
					const base64 = await blobToBase64(blob);
					await uploadFiles(base64, "up_coverImg", Cookies.get("userId"))
						.then((res) => res.json())
						.then((data) => (urlCoverImg = data.url));
				}),
			);
		}

		const res = await Promise.all(aPromise);

		await updateUser(
			{ userId: user.userId },
			{
				avatarUrl: urlProfile,
				coverImageUrl: urlCoverImg,
				bio: profiles.bio,
				location: profiles.location,
				website: profiles.website,
				name: profiles.name,
			},
		)
			.then((res) => {
				console.log(res);
				window.location.reload();
			})
			.catch((err) => {
				console.log(err);
			});
	};

	return (
		<>
			<Dialog
				maxWidth="600px"
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onBackClick={menu !== "main" ? () => setMenu("main") : null}
				title={menu === "main" ? "Edit Profile" : "Edit Image"}
				headerContent={
					<>
						<IconButton
							onClick={() => {
								setIsModalOpen(false), setSelectedFileId(null);
							}}
						>
							<IoMdClose size={30} />{" "}
						</IconButton>
						{menu === "editor" ? (
							<Button onClick={handleSave}>Save</Button>
						) : (
							<Button onClick={handleApply}>Apply</Button>
						)}
					</>
				}
			>
				<div style={{ overflow: "hidden" }} ref={dropdownRef}>
					<CSSTransition
						in={menu === "main"}
						timeout={1}
						unmountOnExit
						onEnter={calcHeight}
						classNames="menu-primary"
					>
						<div className="profile__modal-container">
							<div className="profile__modal-item">
								<div
									className="profile__cover-img-container"
									style={{
										backgroundImage: `url(${profiles.newCoverImageUrl || profiles.coverImageUrl})`,
									}}
								>
									<div className="profile__cover-img-blur"></div>
								</div>
								<div className="profile__modal-choose-icon">
									<MdOutlineCameraAlt size={25} />
								</div>
								<input
									className="profile__modal-choose-img"
									type="file"
									accept="image/*"
									onChange={handleInputCoverImg}
								/>
							</div>
							<div className="profile__modal-item">
								<div className="profile__modal-avatar-container">
									<img
										src={profiles.newAvatarUrl || profiles.avatarUrl}
										className="profile__modal-avatar"
										alt=""
									/>
									<div className="profile__modal-choose-icon">
										<MdOutlineCameraAlt size={25} />
									</div>
									<input
										accept="image/*"
										className="profile__modal-choose-img"
										type="file"
										onChange={handleInputProfile}
									/>
								</div>
							</div>

							<div className="profile__modal-feild">
								<Input
									value={profiles.name}
									maxLength={50}
									variant="filled"
									label="Name"
									onChange={(e) =>
										setProfiles({ ...profiles, name: e.target.value })
									}
								/>
								<div className=" profile__modal-item--bio">
									<InputMultiline
										rows={3}
										maxLength={160}
										variant="filled"
										label="Bio"
										value={profiles.bio}
										onChange={(e) =>
											setProfiles({ ...profiles, bio: e.target.value })
										}
									/>
								</div>

								<Input
									value={profiles.location}
									maxLength={50}
									variant="filled"
									label="Location"
									onChange={(e) =>
										setProfiles({ ...profiles, location: e.target.value })
									}
								/>
								<Input
									value={profiles.website}
									maxLength={100}
									variant="filled"
									onChange={(e) =>
										setProfiles({ ...profiles, website: e.target.value })
									}
									label="Website"
								/>
							</div>
						</div>
					</CSSTransition>
					<CSSTransition in={menu === "editor"} unmountOnExit>
						<MenuEditor
							setProfiles={setProfiles}
							aspectRatio={aspectRatio}
							file={file}
							ref={saveButtonRef}
						/>
					</CSSTransition>
				</div>
			</Dialog>
		</>
	);
};

export default EditProfile;
