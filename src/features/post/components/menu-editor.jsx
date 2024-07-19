import styled, { css } from "styled-components";
import {
	useState,
	useCallback,
	useMemo,
	useImperativeHandle,
	forwardRef,
	useEffect,
} from "react";
import Cropper from "react-easy-crop";
import { IoMdCrop } from "react-icons/io";
import {
	MdCrop169,
	MdCropFree,
	MdCropSquare,
	MdTag,
	MdZoomIn,
	MdZoomOut,
} from "react-icons/md";
import { IconButton } from "~/components/ui/button/icon-button";
import getCroppedImg from "../helpers/crop-image";

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
height: 450px;
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
const MenuEditor = forwardRef(({ setMedia, media, index = 0 }, ref) => {
	const [crop, setCrop] = useState({ x: 0, y: 0 });
	const [rotation, setRotation] = useState(0);

	const [img, setImg] = useState(media[0]);
	const [newImg, setNewImg] = useState();
	const [zoom, setZoom] = useState(1);
	const [cropperSize, setcropperSize] = useState();
	const [aspect, setAspect] = useState("original");

	useEffect(() => {
		setImg(media[index]);
		setZoom(1);
	}, [index]);

	const onCropComplete = async (croppedArea, croppedAreaPixels) => {
		const croppedImage = await getCroppedImg(
			img.mediaUrl,
			croppedAreaPixels,
			rotation,
		);
		setNewImg(croppedImage);
	};

	const handleOnClick = useCallback(async () => {
		setMedia((prev) => {
			const newMedia = [...prev];
			newMedia[index] = {
				...newMedia[index],
				mediaUrl: newImg,
			};
			return newMedia;
		});
	});

	useImperativeHandle(ref, () => {
		return {
			onClick: handleOnClick,
		};
	});

	const aspectRatio = useMemo(() => {
		switch (aspect) {
			case "original":
				if (cropperSize) return cropperSize.width / cropperSize.height;
			case "square":
				return 1 / 1;
			case "wide":
				return 16 / 9;
			default:
				return 4 / 3;
		}
	}, [cropperSize, aspect]);

	const [menu, setMenu] = useState("crop");
	const menuMode = [
		{ item: <IoMdCrop size={25} />, menu: "crop" },
		{
			item: "ALT",
			menu: "alt",
		},
		{
			item: <MdTag size={25} />,
			menu: "tag",
		},
	];

	const menuEditor = [
		{
			item: <MdCropFree size={25} />,
			aspect: "original",
		},
		{
			item: <MdCrop169 size={25} />,
			aspect: "wide",
		},
		{
			item: <MdCropSquare size={25} />,
			aspect: "square",
		},
	];

	return (
		<Box>
			<BoxMenu>
				{menuMode.map((item) => (
					<MenuItem
						active={menu === item.menu}
						onClick={() => setMenu(item.menu)}
					>
						{item.item}
					</MenuItem>
				))}
			</BoxMenu>
			<BoxImge>
				<Cropper
					image={img.mediaUrl}
					crop={crop}
					zoom={zoom}
					aspect={aspectRatio}
					onCropChange={setCrop}
					onCropComplete={onCropComplete}
					onMediaLoaded={({ naturalHeight, naturalWidth }) => {
						setcropperSize({ height: naturalHeight, width: naturalWidth });
					}}
					onZoomChange={setZoom}
					objectFit="horizontal-cover"
					showGrid={false}
				/>
			</BoxImge>
			<Toolbar>
				<BoxCrop>
					{menuEditor.map((item) => (
						<IconButton
							color={aspect === item.aspect ? "var(--color-primary-500)" : ""}
							onClick={() => setAspect(item.aspect)}
						>
							{item.item}
						</IconButton>
					))}
				</BoxCrop>
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
	);
});

export default MenuEditor;
