import React, { useCallback } from "react";
import "./PhotoGrid.css";
import { cloudinary } from "~/lib/cloudinary";
import { AdvancedImage, AdvancedVideo, lazyload } from "@cloudinary/react";
import { Delivery } from "@cloudinary/url-gen/actions";
import { Link, useLocation } from "react-router-dom";
const MediaPost = ({ media, maxHeight = "500px", postId }) => {
	let location = useLocation();
	if (!media) return null;
	console.log();
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
	const extractNumber = useCallback((mediaUrl) => {
		let parts = mediaUrl.split("_");
		return parts[1];
	});
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
						<Link
							to={`/posts/${postId}/photos/${extractNumber(media.mediaUrl)}`}
							state={{ backgroundLocation: location }}
						>
							<AdvancedImage
								className="photogrid__img"
								cldImg={img(media).delivery(Delivery.quality("auto"))}
								plugins={[lazyload()]}
							/>
						</Link>
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
