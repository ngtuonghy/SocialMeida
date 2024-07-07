import React, { useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  position: relative;
  width: 100%;
  max-width: 200px;
`;

const Header = styled.div`
  padding: 10px;
  border: 1px solid var(--color-gray-300);
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  white-space: nowrap;
  ${(props) => props.height && `height: ${props.height};`}
`;

const OptionsList = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  border: 1px solid #ccc;
  border-top: none;
  background-color: white;
  z-index: 1000;
  max-height: 150px;
  overflow-y: auto;
`;

const Option = styled.li`
  padding: 10px;
  cursor: pointer;
  &:hover {
    background-color: #f0f0f0;
  }
`;

const Arrow = styled.span`
  transition: transform 0.3s;
  &.open {
    transform: rotate(180deg);
  }
`;

const Select = ({ options, label, height, onClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
    setSelectedValue(option.label);
    onClick(option.value);
    setIsOpen(false);
  };

  return (
    <Container>
      <Header onClick={handleToggle} height={height}>
        {selectedValue || label || "Select an option"}
        <Arrow className={isOpen ? "open" : ""}>▼</Arrow>
      </Header>
      {isOpen && (
        <OptionsList>
          {options.map((option) => (
            <Option
              key={option.value}
              onClick={() => handleOptionClick(option)}
            >
              {option.label}
            </Option>
          ))}
        </OptionsList>
      )}
    </Container>
  );
};

export default Select;
