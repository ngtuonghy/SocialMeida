import React, { useEffect, useRef, useState } from "react";
import "cropperjs/dist/cropper.css";
import Cropper from "cropperjs";
import { BiReset } from "react-icons/bi";
import PropTypes from "prop-types"; // ES6
import { IoMdClose, IoMdArrowBack, IoMdArrowForward } from "react-icons/io";
import { Button } from "~/components/ui/button";
import Dialog from "~/components/ui/dialog/dialog";
import { IconButton } from "~/components/ui/button/icon-button";
import styled from "styled-components";

const SBoxEdit = styled.div`
  display: "flex";
  gap: 10px;
  padding-block: "5px";
`;
const CropperImage = ({
	mediaUrl,
	cropBoxMovable = true,
	cropperRef,
	isModalOpen,
	setIsModalOpen,
	selectedFileId,
	setSelectedFileId,
	imgEdit,
	preview,
	setPreview,
}) => {
	const [zoom, setZoom] = useState(1);
	const [aspectRatio, setAspectRatio] = useState(NaN);
	const imageRef = useRef(null);

	const ItemRatio = [];
	useEffect(() => {
		if (imageRef.current && !cropperRef.current) {
			const cropperInstance = new Cropper(imageRef.current, {
				aspectRatio: aspectRatio,
				viewMode: 1,
				autoCropArea: 1,
				cropBoxMovable: cropBoxMovable,
				center: true,
				ready() {
					// this.cropper[method](argument1, , argument2, ..., argumentN);
					// Allows chain composition
				},
				// cropend(event) {
				//   console.log(event);
				// },
				zoom(event) {
					setZoom(event.detail.ratio);
					// console.log(event);
				},
				// },
			});

			cropperRef.current = cropperInstance;
		}

		return () => {
			// Cleanup cropper instance on component unmount
			if (cropperRef.current) {
				cropperRef.current.destroy();
				cropperRef.current = null;
			}
		};
	}, [mediaUrl, aspectRatio, isModalOpen]);

	const updatePreviewItem = (id, updatedProperties) => {
		const updatedPreview = preview.map((item) => {
			if (item.id === id) {
				return { ...item, ...updatedProperties }; // Update the item with new properties
			}
			return item; // Return unchanged item if ID doesn't match
		});

		setPreview(updatedPreview); // Update the state with the new array
	};
	const itemsHeaderRight = (
		<div
			style={{
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				gap: "10px",
			}}
		>
			<IconButton
				disabled={selectedFileId != 1}
				onClick={() => {
					setSelectedFileId(selectedFileId - 1);
				}}
			>
				<IoMdArrowBack
					size={30}
					color={selectedFileId != 1 ? "var(--color-gray-200)" : ""}
				/>
			</IconButton>
			<IconButton
				disabled={selectedFileId + 1 === preview.length}
				onClick={() => {
					setSelectedFileId(selectedFileId + 1);
				}}
			>
				<IoMdArrowForward
					size={30}
					color={
						selectedFileId + 1 === preview.length ? "var(--color-gray-200)" : ""
					}
				/>
			</IconButton>
			<Button
				onClick={() => {
					if (cropperRef.current) {
						setIsModalOpen(false);
						const updatedProperties = {
							src: cropperRef.current.getCroppedCanvas().toDataURL(),
						};
						updatePreviewItem(selectedFileId, updatedProperties);
					}
					setSelectedFileId(null);
				}}
			>
				Apply
			</Button>
		</div>
	);
	// if (!selectedFileId) return null;
	if (!isModalOpen) return null;
	return (
		<>
			<Dialog
				isOpen={isModalOpen}
				maxWidth="750px"
				title="Crop Image"
				nodeHeaderLeft={
					<IconButton
						onClick={() => {
							setIsModalOpen(false), setSelectedFileId(null);
						}}
					>
						<IoMdClose size={30} />
					</IconButton>
				}
				nodeHeaderRight={itemsHeaderRight}
			>
				<div
					style={{
						marginTop: "15px",
						marginInline: "10px",
						display: "flex",
						flexDirection: "column",
					}}
				>
					<img
						ref={imageRef}
						style={{
							height: "400px",
							maxWidth: "100%",
							display: "block",
						}}
						src={mediaUrl}
						id="image"
					/>
					<SBoxEdit>
						<IconButton onClick={() => cropperRef.current.reset()}>
							<BiReset size={30} />
						</IconButton>
					</SBoxEdit>
				</div>
				{/* <input
        type="range"
        value={zoom}
        step={0.1}
        alria-labelledby="Zoom"
        min={1}
        max={3}
        onChange={(e) => {
          setZoom(e.target.value);
          if (e.target.value > zoom) cropperRef.current.zoom(+0.1);
          else {
            cropperRef.current.zoom(-0.1);
          }
        }}
      /> */}

				{/* <button onClick={onClick}>test</button> */}
			</Dialog>
		</>
	);
};
CropperImage.propTypes = {
	src: PropTypes.string.isRequired,
	cropBoxMovable: PropTypes.bool,
	aspectRatio: PropTypes.number,
	cropperRef: PropTypes.object.isRequired,
	isModalOpen: PropTypes.bool,

	setIsModalOpen: PropTypes.func,
	selectedFileId: PropTypes.number,
	setSelectedFileId: PropTypes.func,
	imgEdit: PropTypes.string,
	preview: PropTypes.array,
	setPreview: PropTypes.func,
};
export default CropperImage;
