import * as React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const StyledModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  border-bottom: 1px solid var(--color-gray-200);
`;

export const ModalHeader = ({ children, className }) => {
	return <StyledModalHeader>{children}</StyledModalHeader>;
};

const propTypes = {
	children: PropTypes.node.isRequired,
};

ModalHeader.propTypes = propTypes;
