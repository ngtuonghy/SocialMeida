import React from "react";
import styled, { css, keyframes } from "styled-components";
import PropTypes from "prop-types";

// Define button variants enum
const ButtonVariants = {
	CONTAINED: "contained",
	OUTLINED: "outlined",
	TEXT: "text",
};

const ButtonSizes = {
	SMALL: "small",
	MEDIUM: "medium",
	LARGE: "large",
};

const buttonVariants = {
	[ButtonVariants.CONTAINED]: css`
    background-color: var(--color-primary-500);
    color: var(--color-white);
    border: none;
    &:hover:enabled {
      background-color: var(--color-primary-600);
    }
  `,
	[ButtonVariants.OUTLINED]: css`
    background-color: transparent;
    color: var(--color-primary-500);
    border: 1px solid var(--color-primary-500);
    &:hover:enabled {
      border: 1px solid var(--color-primary-600);
      background-color: var(--color-primary-50);
    }
  `,
	[ButtonVariants.TEXT]: css`
    background-color: transparent;
    color: var(--color-primary-500);
    border: none;
    &:hover:enabled {
      background-color: var(--color-primary-100);
    }
  `,
};

const buttonSizes = {
	[ButtonSizes.SMALL]: css`
    font-size: 14px;
    padding: 4px 12px;
  `,
	[ButtonSizes.MEDIUM]: css`
    font-size: 16px;
    padding: 8px 16px;
  `,
	[ButtonSizes.LARGE]: css`
    font-size: 18px;
    padding: 8px 20px;
  `,
};
const disabledStyles = (variant) => {
	switch (variant) {
		case ButtonVariants.CONTAINED:
			return css`
        background-color: var(--color-gray-200);
        color: var(--color-gray-400);
      `;
		case ButtonVariants.OUTLINED:
			return css`
        background-color: transparent;
        color: var(--color-gray-400);
        border: 1px solid var(--color-gray-400);
      `;
		case ButtonVariants.TEXT:
			return css`
        background-color: transparent;
        color: var(--color-gray-400);
      `;
		default:
			return css`
        background-color: var(--color-gray-200);
        color: var(--color-gray-400);
      `;
	}
};

const StyledButton = styled.button`
  width: ${({ width }) => width};
  height: ${({ height }) => height};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
  border-radius: 4px;
  font-weight: 550;
  transition:
    background-color 0.3s ease,
    color 0.3s ease;
  ${({ variant }) => buttonVariants[variant || ButtonVariants.CONTAINED]};
  ${({ size }) => buttonSizes[size || ButtonSizes.MEDIUM]};
  &:active:enabled {
    transform: scale(0.95);
  }
  ${({ disabled, variant }) =>
		disabled &&
		css`
      ${disabledStyles(variant)}
      cursor: not-allowed;
      pointer-events: none;
    `}
`;

const Button = ({
	height,
	width,
	children,
	onClick,
	disabled = false,
	variant = ButtonVariants.CONTAINED,
	size = ButtonSizes.MEDIUM,
	startIcon,
	endIcon,
	ref = null,
}) => {
	return (
		<StyledButton
			ref={ref}
			height={height || ""}
			width={width || ""}
			onClick={onClick}
			disabled={disabled}
			variant={variant}
			size={size}
		>
			{startIcon && startIcon}
			{children}
			{endIcon && endIcon}
		</StyledButton>
	);
};

Button.propTypes = {
	children: PropTypes.node.isRequired,
	// onClick: PropTypes.func || PropTypes.string,
	disabled: PropTypes.bool,
	variant: PropTypes.oneOf(Object.values(ButtonVariants)),
	size: PropTypes.oneOf(Object.values(ButtonSizes)),
	width: PropTypes.string,
};

export { Button, ButtonVariants, ButtonSizes };
