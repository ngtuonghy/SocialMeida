import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

const StyledButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  width: fit-content;
  height: fit-content;
  padding: 3px;
  cursor: ${({ disabled }) => (disabled ? "" : "pointer")};
  pointer-events: ${({ disabled }) => (disabled ? "none" : "auto")};
  border-radius: 50%;
  &:hover {
    background-color: ${({ disabled }) =>
      disabled ? "transparent" : "var(--color-gray-100)"};
  }
`;

export const IconButton = ({ children, onClick, disabled }) => {
  return (
    <StyledButton disabled={disabled} onClick={onClick}>
      {children}
    </StyledButton>
  );
};
// eslint-disable-next-line
IconButton.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  backgroundColor: PropTypes.string,
  disabled: PropTypes.bool,
};

IconButton.defaultProps = {
  onClick: () => {},
  backgroundColor: "transparent",
  disabled: false,
};
