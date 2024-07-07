import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
const StyledLink = styled(Link)`
  color: var(--color-primary-600);
  width: fit-content;
  height: fit-content;
  display: flex;
  align-items: center;
`;
const StyledAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  ${({ width }) => width && `width: ${width};`}
  ${({ height }) => height && `height: ${height};`}
`;

const Avatar = ({ src, width, height, to }) => {
  return to ? (
    <StyledLink to={to}>
      <StyledAvatar
        src={src}
        alt="avatar"
        width={width || "40px"}
        height={height || "40px"}
      />
    </StyledLink>
  ) : (
    <StyledAvatar
      src={src}
      alt="avatar"
      width={width || "40px"}
      height={height || "40px"}
    />
  );
};

export default Avatar;
