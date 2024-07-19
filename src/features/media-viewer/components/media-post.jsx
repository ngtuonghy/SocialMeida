import React from "react";
import "./PhotoGrid.css";
import { cloudinary } from "~/lib/cloudinary";
import {
	AdvancedImage,
	AdvancedVideo,
	lazyload,
	responsive,
	accessibility,
	placeholder,
} from "@cloudinary/react";
import { video } from "@cloudinary/url-gen/qualifiers/source";
import { Delivery } from "@cloudinary/url-gen/actions";
const MediaPost = ({ media, maxHeight = "500px" }) => {
	if (!media) return null;

	const length = media.length;
	const maxVisibleMedia = 5; // Maximum number of images to display
	const visibleMedia = media.slice(0, maxVisibleMedia);

	const countImage = (index) => {
		if (length === 1) return "photogrid__img--single";
		if (length === 2) return `photogrid__img--twoImage-${index + 1}`;
		if (length === 3) return `photogrid__img--threeImage-${index + 1}`;
		if (length === 4) return `photogrid__img--fourImage-${index + 1}`;
		if (length >= 5) return `photogrid__img--fiveImage-${index + 1}`;
	};
	// console.log(countImage(0));
	const img = (media) => {
		return cloudinary.image(media.mediaUrl);
	};
	const vid = (media) => {
		return cloudinary.video(media.mediaUrl);
	};
	// console.log(img(media[0].mediaUrl));
	return (
		<div
			style={{
				height: length <= 1 ? "auto" : maxHeight,
			}}
			className={`photogrid__container`}
		>
			{visibleMedia.map((media, index) => (
				<div
					key={index}
					className={`photogrid__img-container ${countImage(index)}`}
				>
					{media.mediaType.includes("video") ? (
						<AdvancedVideo
							className="photogrid__img"
							cldVid={vid(media).delivery("q_auto")}
							cldPoster={vid(media).format("jpg")}
							plugins={[lazyload()]}
							controls
						/>
					) : (
						<AdvancedImage
							className="photogrid__img"
							cldImg={img(media).delivery(Delivery.quality("auto"))}
							plugins={[lazyload()]}
						/>
					)}
					{index === 4 && length > 5 && (
						<span className="photogrid__more-image">+{length - 5}</span>
					)}
				</div>
			))}
		</div>
	);
};

export default MediaPost;
