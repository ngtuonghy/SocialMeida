import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";
import { LuTimerOff } from "react-icons/lu";
import { IconButton } from "../button/icon-button";
const InputVariants = {
  FILLED: "filled",
  OUTLINED: "outlined",
  UNDERLINED: "underlined",
};
const InputSizes = {
  SMALL: "small",
  MEDIUM: "medium",
  LARGE: "large",
};

const inputVariants = {
  [InputVariants.FILLED]: css`
    background-color: var(--color-white);
    border: 1px solid var(--color-gray-200);
    border-radius: 4px;
    padding-inline: 12px;
    padding-top: 20px;
    padding-bottom: 8px;
    &:focus:enabled {
      outline: 2px solid var(--color-primary-500);
    }
    &:hover:enabled {
      border: 1px solid var(--color-black-500);
    }
  `,
  [InputVariants.OUTLINED]: css`
    background-color: transparent;
    border: 1px solid var(--color-gray-300);
    border-radius: 4px;
    padding: 12px;
    &:focus:enabled {
      outline: 2px solid var(--color-primary-500);
    }
  `,
  [InputVariants.UNDERLINED]: css`
    background-color: transparent;
    border: none;
    border-bottom: 1px solid var(--color-gray-300);
    padding-inline: 12px;
    padding-top: 20px;
    padding-bottom: 8px;
  `,
};

const helperTextVariants = {
  [InputVariants.FILLED]: css`
    padding-inline: 12px;
  `,
  [InputVariants.OUTLINED]: css`
    padding-inline: 12px;
  `,
  [InputVariants.UNDERLINED]: css`
    padding-inline: 12px;
  `,
};

const inputSizes = {
  [InputSizes.SMALL]: css`
    font-size: 14px;
    padding-block: 11px;
  `,
  [InputSizes.MEDIUM]: css`
    font-size: 16px;
  `,
  [InputSizes.LARGE]: css`
    font-size: 18px;
  `,
};

const labelVariant = (variant) => {
  switch (variant) {
    case InputVariants.OUTLINED:
      return css`
        font-size: 0.8rem;
        top: 0;
        left: 7px;
      `;
    case InputVariants.FILLED:
      return css`
        top: 12px;
        font-size: 0.7rem;
        left: 7px;
      `;
    case InputVariants.UNDERLINED:
      return css`
        top: 10px;
        font-size: 0.8rem;
        left: 7px;
      `;
    default:
      return css`
        top: 50%;
        transform: translateY(-50%);
        left: 7px;
      `;
  }
};

const disabledStyles = (variant) => {
  switch (variant) {
    case InputVariants.FILLED:
      return css`
        background-color: var(--color-gray-100);
        border: 1px solid var(--color-gray-100);
        cursor: not-allowed;
      `;
    case InputVariants.OUTLINED:
      return css`
        background-color: transparent;
        border: 1px solid var(--color-gray-100);
        cursor: not-allowed;
      `;
    case InputVariants.UNDERLINED:
      return css`
        background-color: transparent;
        border-bottom: 1px solid var(--color-gray-100);
        cursor: not-allowed;
      `;
    default:
      return "";
  }
};
const errorStyles = (variant) => {
  switch (variant) {
    case InputVariants.FILLED:
      return css`
        border: 1px solid var(--color-red-500);
      `;
    case InputVariants.OUTLINED:
      return css`
        border: 1px solid var(--color-red-500);
        outline: 2px solid var(--color-red-500);
      `;
    case InputVariants.UNDERLINED:
      return css`
        border-bottom: 1px solid var(--color-red-500);
      `;
  }
};
const StyledInput = styled.input`
  outline: none;
  width: ${(props) => props.width || "100%"};
  height: ${(props) => props.height || "auto"};

  ${(props) => inputVariants[props.variant || InputVariants.FILLED]};
  ${(props) => inputSizes[props.size || InputSizes.MEDIUM]};
  ${(props) => props.disabled && disabledStyles(props.variant)}
  ${(props) =>
    props.isFocused &&
    props.variant === InputVariants.UNDERLINED &&
    css`
      border-bottom: 1px solid var(--color-primary-500);
    `}
  ${(props) => props.error && errorStyles(props.variant)}
  padding-left: ${(props) => (props.IconPostion === "start" ? "40px" : "12px")};
`;

const StyledLabel = styled.label`
  position: absolute;
  font-size: 0.9em;
  pointer-events: none;
  color: rgb(83, 100, 113);
  transition: 0.2s;
  top: 50%;
  left: 7px;
  font-size: 1em;
  padding: 0 5px;
  border: none;
  background-color: var(--color-white);
  transform: translateY(-50%);
  left: ${(props) => (props.IconPostion === "start" ? "30px" : "")};
  ${(props) =>
    (props.isFocused || props.isValid) && labelVariant(props.variant)}
  ${(props) =>
    props.isFocused &&
    css`
      color: var(--color-primary-500);
    `}
`;

const HelperText = styled.p`
  ${(props) => helperTextVariants[props.variant || InputVariants.OUTLINED]}
`;

const StyledContainer = styled.div`
  position: relative;
  display: flex;
`;

const StyledIcon = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translateY(-50%);
  top: 50%;
  ${(props) =>
    props.IconPostion === "start"
      ? css`
          left: 5px;
        `
      : css`
          right: 10px;
        `}
`;
const Input = ({
  value,
  onChange,
  label,
  required,
  width,
  size,
  type,
  error,
  onKeyUp,
  onBlur,
  onFocus,
  onKeyDown,
  height,
  ref,
  maxLength,
  id,
  variant,
  helperText,
  icon,
  IconPostion,
  borderRadius,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [charecterCount, setCharecterCount] = useState(0);
  const handleFocus = () => {
    onFocus;
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  useEffect(() => {
    if (value) {
      setCharecterCount(value.length);
      setIsValid(true);
    } else {
      setCharecterCount(0);
      setIsValid(false);
    }
  }, [value]);

  const Icon = icon;

  return (
    <div>
      <StyledContainer>
        <StyledInput
          style={{
            borderRadius: borderRadius || "4px",
          }}
          type={type || "text"}
          size={size || InputSizes.MEDIUM}
          required={required}
          value={value}
          onChange={onChange}
          label={label}
          variant={variant || InputVariants.OUTLINED}
          onFocus={handleFocus}
          onBlur={handleBlur}
          isFocused={isFocused}
          maxLength={maxLength}
          width={width}
          height={height}
          error={error}
          IconPostion={IconPostion}
        />

        {label && (
          <StyledLabel
            isFocused={isFocused}
            isValid={isValid}
            variant={variant || InputVariants.OUTLINED}
            IconPostion={IconPostion}
          >
            {label}
          </StyledLabel>
        )}

        {maxLength && isFocused && (
          <span
            style={{
              position: "absolute",
              top: "2px",
              right: "10px",
              fontSize: "10px",
            }}
          >
            {charecterCount}/{maxLength}
          </span>
        )}
        {icon && <StyledIcon IconPostion={IconPostion}> {Icon}</StyledIcon>}
      </StyledContainer>
      {helperText && <HelperText>{helperText}</HelperText>}
    </div>
  );
};

Input.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  label: PropTypes.string,
  required: PropTypes.bool,
  width: PropTypes.string,
  size: PropTypes.oneOf(Object.values(InputSizes)),
  type: PropTypes.string,
  error: PropTypes.bool,
  onKeyUp: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  onKeyDown: PropTypes.func,
  height: PropTypes.string,
  ref: PropTypes.object,
  maxLength: PropTypes.number,
  id: PropTypes.string,
  variant: PropTypes.oneOf(Object.values(InputVariants)),
  helperText: PropTypes.string,
  icon: PropTypes.node,
  IconPostion: PropTypes.oneOf(["start", "end"]),
};

export default Input;
export { InputVariants, InputSizes };
