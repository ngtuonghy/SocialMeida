import React from "react";
import "./PhotoGrid.css";
const MediaViewer = ({ media, maxHeight = "400px" }) => {
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
          {media.type.includes("video") ? (
            <video controls className="photogrid__img">
              <source src={media.src} type="video/mp4" />
            </video>
          ) : (
            <img
              key={index}
              src={media.src}
              alt="image"
              className="photogrid__img"
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

export default MediaViewer;
