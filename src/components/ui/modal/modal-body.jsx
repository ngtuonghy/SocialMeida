import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
const StyledModalBody = styled.div`
  padding: 20px;
`;
export const ModalBody = ({ children }) => {
	return <StyledModalBody>{children}</StyledModalBody>;
};

const propTypes = {
	children: PropTypes.node.isRequired,
};
ModalBody.propTypes = propTypes;
