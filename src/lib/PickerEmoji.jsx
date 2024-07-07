import React from "react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
const PickerEmoji = ({ onSelected, perLine = 9 }) => {
  const handleEmojiSelect = (emoji) => {
    if (onSelected) {
      onSelected(emoji);
    }
  };

  return (
    <Picker
      previewPosition="none"
      perLine={perLine}
      data={data}
      onEmojiSelect={handleEmojiSelect}
    />
  );
};

export default PickerEmoji;
