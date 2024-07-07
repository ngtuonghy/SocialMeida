import React, { useEffect, useState } from "react";
import { Button } from "../button";

const AlertDialog = ({ message, onConfirm, setIsOpen, isOpen, title }) => {
  const handleClose = () => {
    setIsOpen(false);
  };

  const handleConfirm = () => {
    onConfirm();
    handleClose();
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflowY = "hidden";
    } else {
      document.body.style.overflowY = "unset";
    }

    return () => {
      document.body.style.overflowY = "unset";
    };
  }, [isOpen]);
  return (
    <div>
      {isOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.3)",
            boxShadow:
              "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "5px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              width: "100%",
              maxWidth: "500px",
            }}
          >
            <h3 style={{ margin: "0 auto" }}>{title}</h3>
            <hr />
            <div>{message}</div>
            <div
              style={{
                display: "flex",
                gap: "15px",
                flexDirection: "row-reverse",
              }}
            >
              <Button onClick={handleConfirm}>Confirm</Button>
              <Button onClick={handleClose}>Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlertDialog;
