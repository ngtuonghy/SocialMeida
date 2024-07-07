import React from "react";
import styled, { keyframes } from "styled-components";

// Define the keyframes for the shimmer animation
const placeholderShimmer = keyframes`
  0% {
    background-position: -500px 0;
  }
  100% {
    background-position: 500px 0;
  }
`;

// Define the styled component
const SkeletonStyled = styled.div`
  border-radius: ${(props) => (props.variant === "circle" ? "50%" : "2px")};
  display: inline-block;
  line-height: 100%;
  width: ${(props) => props.width || "100%"};
  height: ${(props) => props.height || "100%"};
  background-color: #fff;
  background-size: 1000px 1000px;
  background-image: linear-gradient(
    100deg,
    #e8e8e8 20%,
    #fafafa 50%,
    #e8e8e8 60%
  );
  animation: ${placeholderShimmer} 1.5s linear infinite forwards;
`;

// Define the Skeleton component
const Skeleton = ({ width, height, variant }) => {
  return <SkeletonStyled width={width} height={height} variant={variant} />;
};

export default Skeleton;
