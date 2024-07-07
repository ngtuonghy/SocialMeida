import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import PropTypes from "prop-types";
import { IoMdClose } from "react-icons/io";
import styled from "styled-components";
import { IconButton } from "../button/icon-button";
// import { CSSTransition } from "react-transition-group";

const Modal = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 1001;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: showModal 0.3s ease-in-out;
`;

const ModalContainer = styled.div`
  background-color: #fefffe;
  margin: auto;
  height: fit-content;
  width: 100%;
  padding-block: 10px;
  border-radius: var(--border-radius-large);
  position: relative;
  display: flex;
  flex-direction: column;
  max-width: ${(props) => props.maxWidth || "auto"};
  max-height: ${(props) => props.maxHeight || "650px"};

  @media (max-width: 768px) {
    max-height: 100% !important;
    border-radius: var(--border-radius-none);
    height: 100%;
  }

  @media (min-width: 768px) {
    max-height: calc(100vh - 50px);
    border-radius: var(--border-radius-large);
  }
`;

const ModalHeader = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  height: 50px;
  top: 0;
  border-bottom: 1px solid #dee2e6;
  display: flex;
  align-items: center;
  padding-inline: 10px;
  z-index: 996;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ModalBody = styled.div`
  margin-top: calc(50px - 10px);
  height: 100%;
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  margin-bottom: ${(props) => props.marginBottom || "0"};
`;

const ModalFooter = styled.footer`
  display: flex;
  justify-content: space-between;
  padding: 0.6rem;
  border-top: 1px solid #dee2e6;
  position: absolute;
  height: fit-content;
  bottom: 0;
  right: 0;
  background: white;
  width: 100%;
  overflow-y: hidden;
  max-width: inherit;

  @media (min-width: 768px) {
    border-bottom-right-radius: var(--border-radius-large);
    border-bottom-left-radius: var(--border-radius-large);
  }
`;

const ContainerIcon = styled.div`
  border-radius: var(--border-radius-rounded);
  background-color: #eeeeee;
  padding: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s;

  &:hover {
    cursor: pointer;
    background-color: var(--color-primary);
  }
`;

const Dialog = ({
  isOpen,
  onClose,
  children,
  maxWidth,
  maxHeight,
  nodeHeaderLeft,
  nodeHeaderRight,
  nodeFooter,
  title,
  id,
}) => {
  useEffect(() => {
    const closeOnEscapeKey = (e) => (e.key === "Escape" ? onClose() : null);
    document.body.addEventListener("keydown", closeOnEscapeKey);
    return () => {
      document.body.removeEventListener("keydown", closeOnEscapeKey);
    };
  }, [onClose]);
  const [marginBottom, setMarginBottom] = useState("0");
  const footerRef = useRef(null);

  useEffect(() => {
    const updateMarginBottom = () => {
      if (footerRef.current) {
        setMarginBottom(`${footerRef.current.clientHeight - 10}px`);
      }
    };

    if (isOpen) {
      document.body.style.overflowY = "hidden";
      updateMarginBottom();
      const resizeObserver = new ResizeObserver(updateMarginBottom);
      if (footerRef.current) {
        resizeObserver.observe(footerRef.current);
      }
      return () => {
        document.body.style.overflowY = "";
        if (footerRef.current) {
          resizeObserver.unobserve(footerRef.current);
        }
      };
    } else {
      document.body.style.overflowY = "";
    }
  }, [isOpen]);

  if (!isOpen) return null;
  return createPortal(
    <Modal>
      <ModalContainer maxWidth={maxWidth} maxHeight={maxHeight}>
        <ModalHeader>
          <HeaderLeft>
            {nodeHeaderLeft}
            <h3>{title}</h3>
          </HeaderLeft>
          {nodeHeaderRight}
          {!nodeHeaderRight && (
            <IconButton>
              <IoMdClose onClick={onClose} size={30} />
            </IconButton>
          )}
        </ModalHeader>
        <ModalBody id={id} hasFooter={!!nodeFooter} marginBottom={marginBottom}>
          {children}
        </ModalBody>
        {nodeFooter && <ModalFooter ref={footerRef}>{nodeFooter}</ModalFooter>}
      </ModalContainer>
    </Modal>,
    document.getElementById("modal"),
  );
};

Dialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  maxWidth: PropTypes.string,
  maxHeight: PropTypes.string,
  nodeHeaderLeft: PropTypes.node,
  nodeHeaderRight: PropTypes.node,
  nodeFooter: PropTypes.node,
  title: PropTypes.string,
};

export default Dialog;
