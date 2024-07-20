import styled, { css } from "styled-components";
import { useState, useCallback, useImperativeHandle, forwardRef } from "react";
import Cropper from "react-easy-crop";
import { MdZoomIn, MdZoomOut } from "react-icons/md";

import getCroppedImg from "~/helpers/crop-image";

const Box = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;

`;

const BoxImge = styled.div`
position: relative;
max-width: 100%;
height: 500px;
`;
const BoxMenu = styled.div`
  display: flex;
position:relative;
`;

const MenuItem = styled.div`
width:100%;
display:flex;
padding:10px;
justify-content:center;
align-self: center;
&:hover {
  background-color:var(--color-gray-100)
}
position:relative;
${({ active }) =>
	active &&
	css`
&:after{
content:"";
position:absolute;
width:40%;
height:4px;
bottom:1px;
background-color:var(--color-primary-500);
border-radius:999px;
}
`}

`;

const Toolbar = styled.div`
  display: flex;
padding:15px;
gap:10px;
margin-top:auto;
width:100%;
`;
const BoxCrop = styled.div`
display: flex;
justify-content: space-around;
flex:50%;
`;
const BoxZom = styled.div`
display: flex;
flex:50%;
align-items: center;
justify-content: center;
gap:5px;
`;

const BoxImg = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;
    touch-action: none;
    cursor: move;
    display: flex;
    justify-content: center;
    align-items: center;
`;
const MenuEditor = forwardRef(
	({ setProfiles, file, aspectRatio = 1 / 1 }, ref) => {
		const [crop, setCrop] = useState({ x: 0, y: 0 });
		const [rotation, setRotation] = useState(0);

		const [newImg, setNewImg] = useState();
		const [zoom, setZoom] = useState(1);

		const onCropComplete = async (croppedArea, croppedAreaPixels) => {
			const croppedImage = await getCroppedImg(
				file,
				croppedAreaPixels,
				rotation,
			);
			setNewImg(croppedImage);
		};

		const handleOnClick = useCallback(async () => {
			setProfiles((prev) => {
				if (aspectRatio === 1 / 1) {
					const newData = {
						...prev,
						newAvatarUrl: newImg,
					};
					return newData;
				} else {
					const newData = {
						...prev,
						newCoverImageUrl: newImg,
					};
					return newData;
				}
			});
		});

		useImperativeHandle(ref, () => {
			return {
				onClick: handleOnClick,
			};
		});

		return (
			<Box>
				<Box>
					<BoxImge>
						<Cropper
							image={file}
							crop={crop}
							zoom={zoom}
							aspect={aspectRatio}
							onCropChange={setCrop}
							onCropComplete={onCropComplete}
							onMediaLoaded={({ naturalHeight, naturalWidth }) => {
								setcropperSize({
									height: naturalHeight,
									width: naturalWidth,
								});
							}}
							onZoomChange={setZoom}
							objectFit="horizontal-cover"
							showGrid={false}
						/>
					</BoxImge>
					<Toolbar>
						<BoxZom>
							<MdZoomOut size={25} />
							<input
								type="range"
								value={zoom}
								step={0.1}
								aria-labelledby="Zoom"
								min={1}
								max={3}
								onChange={(e) => {
									setZoom(e.target.value);
								}}
							/>
							<MdZoomIn size={25} />
						</BoxZom>
					</Toolbar>
				</Box>
			</Box>
		);
	},
);

export default MenuEditor;
