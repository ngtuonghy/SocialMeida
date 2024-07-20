import styled from "styled-components";
import { ModalBody } from "./modal-body";
import { ModalHeader } from "./modal-header";

const StyledModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`;
export const Modal = ({ children }) => {
	return <StyledModal>{children}</StyledModal>;
};
export default Object.assign(Modal, { Body: ModalBody, Header: ModalHeader });
