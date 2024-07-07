import React from "react";
import PropTypes from "prop-types";
import { Link as RouterLink } from "react-router-dom";
import styled from "styled-components";
const StyledLink = styled(RouterLink)`
  color: var(--color-primary-600);
  width: fit-content;
  display: flex;
  align-items: center;
  &:hover {
    text-decoration: underline;
  }
`;
const Link = ({ children, ...props }) => {
  return <StyledLink {...props}>{children}</StyledLink>;
};

Link.propTypes = {
  children: PropTypes.node.isRequired,
};
export default Link;
