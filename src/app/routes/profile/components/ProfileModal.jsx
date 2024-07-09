import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { CSSTransition } from "react-transition-group";
import { IoMdClose, IoMdArrowBack, IoMdArrowForward } from "react-icons/io";
import { MdOutlineCameraAlt } from "react-icons/md";
import Cookies from "js-cookie";
import "./ProfileModal.css";
import { convertFileToDataURL } from "~/utils/utilFile";
import CropperImage from "~/features/cropper/components/cropper-image";
import Dialog from "~/components/ui/dialog/dialog";
import { Button } from "~/components/ui/button";
import Input from "~/components/ui/text-field/input";
import InputMultiline from "~/components/ui/text-field/input-multiline";
import { IconButton } from "~/components/ui/button/icon-button";
import { updateProfile } from "~/features/user/api/user-api";
import { uploadFiles } from "~/features/post/api/uploadImage";

const ProfileModal = ({ profile, isModalOpen, setIsModalOpen }) => {
	const [activeMenu, setActiveMenu] = useState("main");

	const [bio, setBio] = useState("");
	const [location, setLocation] = useState("");
	const [website, setWebsite] = useState("");
	const [name, setName] = useState("");

	const [imgEdit, setImgEdit] = useState();

	const [previewImage, setPreviewImage] = useState([]);
	const [croppedFileCoverImg, setCroppedFileCoverImg] = useState(null);
	const [croppedFileProfile, setCroppedFileProfile] = useState();
	const [selectedFileId, setSelectedFileId] = useState(null);
	const cropperRef = useRef(null);
	const [isModalCropperOpen, setIsModalCropperOpen] = useState(false);

	useEffect(() => {
		const processImages = async () => {
			try {
				let file =
					selectedFileId === 2 ? croppedFileProfile : croppedFileCoverImg;

				if (!file) return;
				const result = await convertFileToDataURL(file);

				setPreviewImage(() => {
					const existingItemIndex = previewImage.findIndex(
						(item) => item.id === selectedFileId,
					);

					if (existingItemIndex !== -1) {
						return previewImage.map((item) =>
							item.id === selectedFileId
								? { ...item, srcOrigin: result, src: "" }
								: item,
						);
					} else {
						return [
							...previewImage,
							{ id: selectedFileId, srcOrigin: result, src: "" },
						];
					}
				});
				setImgEdit(result);
			} catch (error) {
				console.error("Error previewing image:", error);
			}
		};
		processImages();
	}, [selectedFileId]);

	useEffect(() => {
		setBio(profile.bio);
		setLocation(profile.location);
		setWebsite(profile.website);
		setIsModalOpen(isModalOpen);
		setName(profile.name);
	}, [isModalOpen]);

	const handleInputProfile = (e) => {
		const file = e.target.files[0];
		setSelectedFileId(2);
		setCroppedFileProfile(file);
		setIsModalCropperOpen(true);
	};

	const handleInputCoverImg = (e) => {
		const file = e.target.files[0];
		setCroppedFileCoverImg(file);
		setSelectedFileId(3);
		setIsModalCropperOpen(true);
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

	const handleBioChange = (event) => {
		setBio(event.target.value);
	};
	const handleLocationChange = (event) => {
		setLocation(event.target.value);
	};
	const handlewWebsiteChange = (event) => {
		setWebsite(event.target.value);
	};
	const handleNameChange = (event) => {
		setName(event.target.value);
	};

	const handleSaveChanges = async () => {
		let urlProfile;
		let urlCoverImg;
		if (getSoureImageById(2)) {
			await uploadFiles(
				getSoureImageById(2),
				"up_profile",
				Cookies.get("userId"),
			)
				.then((res) => res.json())
				.then((data) => (urlProfile = data.url));
		}
		if (getSoureImageById(3)) {
			await uploadFiles(
				getSoureImageById(3),
				"up_coverImg",
				Cookies.get("userId"),
			)
				.then((res) => res.json())
				.then((data) => (urlCoverImg = data.url));
		}

		await updateProfile({
			avatarUrl: urlProfile,
			coverImgUrl: urlCoverImg,
			bio: bio,
			location: location,
			website: website,
			name: name,
		})
			.then((res) => {
				console.log(res);
				window.location.reload();
			})
			.catch((err) => {
				console.log(err);
			});

		console.log("save changes");
	};
	const handleApplyChanges = () => {
		if (activeMenu === "image") {
			handleCropProfile();
		}
		if (activeMenu === "coverImage") {
			handleCropCoverImage();
		}
		setActiveMenu("main");
		// console.log("apply changes");
	};
	console.log(previewImage);

	const getSoureImageById = (id) => {
		const obj = previewImage.find((obj) => obj.id === id);
		if (obj === undefined || obj.src === null) return null;
		return obj.src;
	};

	return (
		<>
			<CropperImage
				src={imgEdit || ""}
				aspectRatio={selectedFileId === 2 ? 1 / 1 : 3 / 1}
				cropperRef={cropperRef}
				isModalOpen={isModalCropperOpen}
				selectedFileId={selectedFileId}
				setSelectedFileId={setSelectedFileId}
				setIsModalOpen={setIsModalCropperOpen}
				preview={previewImage}
				setPreview={setPreviewImage}
			/>

			<Dialog
				maxWidth="600px"
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onBackClick={activeMenu !== "main" ? () => setActiveMenu("main") : null}
				title={activeMenu === "main" ? "Edit Profile" : "Edit Image"}
				onClickFooter={activeMenu === "main" ? handleSaveChanges : null}
				onButton={activeMenu === "main" ? null : handleApplyChanges}
				labelOnButton={"Apply"}
				nodeHeaderRight={<Button onClick={handleSaveChanges}>Save</Button>}
				nodeHeaderLeft={
					<>
						<IconButton
							onClick={() => {
								setIsModalOpen(false), setSelectedFileId(null);
							}}
						>
							<IoMdClose size={30} />{" "}
						</IconButton>
					</>
				}
			>
				<div style={{ overflow: "hidden" }} ref={dropdownRef}>
					<CSSTransition
						in={activeMenu === "main"}
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
										backgroundImage: `url(${getSoureImageById(3) || profile.cover_image_url})`,
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
										src={getSoureImageById(2) || profile.avatar_url}
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
									value={name}
									maxLength={50}
									variant="filled"
									label="Name"
									onChange={handleNameChange}
								/>
								<div className=" profile__modal-item--bio">
									<InputMultiline
										rows={3}
										maxLength={160}
										variant="filled"
										label="Bio"
										value={bio}
										onChange={handleBioChange}
									/>
								</div>

								<Input
									value={location}
									maxLength={50}
									variant="filled"
									label="Location"
									onChange={handleLocationChange}
								/>
								<Input
									value={website}
									maxLength={100}
									variant="filled"
									onChange={handlewWebsiteChange}
									label="Website"
								/>
							</div>
						</div>
					</CSSTransition>
				</div>
			</Dialog>
		</>
	);
};

export default ProfileModal;
