import React, { useState } from "react";
import styled from "styled-components";
import haha from "~/assets/haha.svg";
import like from "~/assets/like.svg";
import wow from "~/assets/wow.svg";
import love from "~/assets/love.svg";
import angry from "~/assets/angry.svg";
import care from "~/assets/care.svg";

const ReactionContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  border: 1px solid var(--color-border-input);
  background-color: white;
  border-radius: 9999px;
  width: fit-content;
  padding: 5px;
  position: relative;
  z-index: 2000;
  height: ${(props) => props.size * 1.2}px;
`;

const ReactionItem = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  position: relative;
  cursor: pointer;

  &:hover span {
    opacity: 1;
  }

  img {
    transform: ${(props) => (props.hovered ? "scale(1.3)" : "scale(1)")};
    transition: transform 0.2s;
    transform-origin: bottom;
    height: ${(props) => props.size}px;
    width: ${(props) => props.size}px;
  }
`;

const ReactionText = styled.span`
  position: absolute;
  top: -40px;
  background-color: black;
  color: white;
  border-radius: var(--border-radius-large);
  padding-inline: 2px;
  z-index: 4000;
  left: 50%;
  transform: translateX(-50%);
  opacity: 0;
  transition: opacity 0.3s ease;
`;

const Expressive = ({ size = 18, onClick }) => {
  const [hoveredItem, setHoveredItem] = useState(null);

  const handleMouseEnter = (index) => {
    setHoveredItem(index);
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  const reactions = [
    {
      text: "like",
      img: like,
    },
    {
      text: "love",
      img: love,
    },
    {
      text: "care",
      img: care,
    },
    {
      text: "haha",
      img: haha,
    },
    {
      text: "wow",
      img: wow,
    },
    {
      text: "angry",
      img: angry,
    },
  ];

  return (
    <ReactionContainer size={size}>
      {reactions.map((item, index) => (
        <ReactionItem
          key={index}
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={handleMouseLeave}
          onClick={onClick}
          hovered={hoveredItem === index}
          size={size}
        >
          <ReactionText>{item.text}</ReactionText>
          <img src={item.img} alt={item.text} />
        </ReactionItem>
      ))}
    </ReactionContainer>
  );
};

export default Expressive;
