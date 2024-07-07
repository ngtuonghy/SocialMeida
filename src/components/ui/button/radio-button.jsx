import React from "react";
import styled from "styled-components";

const Container = styled.label`
  display: block;
  position: relative;
  // padding-right: 85px;
  width: 100%;
  padding-block: 10px;
  margin-bottom: 12px;
  cursor: pointer;
  font-size: 22px;
  user-select: none;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const HiddenRadioButton = styled.input.attrs({ type: "radio" })`
  position: absolute;
  opacity: 0;
  cursor: pointer;
`;

const Checkmark = styled.span`
  position: absolute;
  right: 10px;
  height: 17px;
  width: 17px;
  background-color: #eee;
  top: 50%;
  transform: translateY(-50%);
  border-radius: 50%;

  // ${Container}:hover ${HiddenRadioButton} ~ & {
  //   background-color: #ccc;
  // }

  ${HiddenRadioButton}:checked ~ & {
    background-color: #2196f3;
  }

  &:after {
    content: "";
    position: absolute;
    display: none;
  }

  ${HiddenRadioButton}:checked ~ &:after {
    display: block;
  }

  &:after {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: white;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

const RadioButtonLabel = styled.span`
  display: flex;
  align-items: center;
  justify-content: start;
  margin-left: 10px;
  font-size: 1rem;
`;

const RadioButton = ({ label, name, checked, onChange, value }) => (
  <Container>
    <RadioButtonLabel>{label}</RadioButtonLabel>
    <HiddenRadioButton
      name={name}
      checked={checked}
      onChange={onChange}
      value={value}
    />
    <Checkmark />
  </Container>
);

export default RadioButton;
