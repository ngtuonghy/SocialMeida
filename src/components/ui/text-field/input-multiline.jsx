import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";

const InputMulVariants = {
	FILLED: "filled",
	OUTLINED: "outlined",
	UNDERLINED: "underlined",
	FLACEHOLDER: "placeholder",
};

const InputMulSizes = {
	SMALL: "small",
	MEDIUM: "medium",
	LARGE: "large",
	SUPERLARGE: "superlarge",
};

const inputVariants = {
	[InputMulVariants.FILLED]: css`
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
	[InputMulVariants.OUTLINED]: css`
    background-color: transparent;
    border: 1px solid var(--color-gray-300);
    border-radius: 4px;
    padding: 12px;
    &:focus:enabled {
      outline: 2px solid var(--color-primary-500);
    }
    &:hover:enabled {
      border: 1px solid var(--color-black-500);
    }
  `,
	[InputMulVariants.UNDERLINED]: css`
    background-color: transparent;
    border: none;
    border-bottom: 1px solid var(--color-gray-300);
    padding-inline: 12px;
    padding-top: 20px;
    padding-bottom: 8px;
  `,
	[InputMulVariants.FLACEHOLDER]: css`
    background-color: transparent;
  `,
};

const helperTextVariants = {
	[InputMulVariants.FILLED]: css`
    padding-inline: 12px;
  `,
	[InputMulVariants.OUTLINED]: css`
    padding-inline: 12px;
  `,
	[InputMulVariants.UNDERLINED]: css`
    padding-inline: 12px;
  `,
	[InputMulVariants.FLACEHOLDER]: css`
    padding-inline: 12px;
  `,
};

const inputSizes = {
	[InputMulSizes.SMALL]: css`
    font-size: 14px;
  `,
	[InputMulSizes.MEDIUM]: css`
    font-size: 16px;
  `,
	[InputMulSizes.LARGE]: css`
    font-size: 18px;
  `,
	[InputMulSizes.SUPERLARGE]: css`
    font-size: 20px;
  `,
};

const labelVariant = (variant) => {
	switch (variant) {
		case InputMulVariants.OUTLINED:
			return css`
        font-size: 0.8rem;
        top: 0;
        left: 7px;
      `;
		case InputMulVariants.FILLED:
			return css`
        top: 12px;
        font-size: 0.7rem;
        left: 7px;
      `;
		case InputMulVariants.UNDERLINED:
			return css`
        top: 10px;
        font-size: 0.8rem;
        left: 7px;
      `;
		case InputMulVariants.FLACEHOLDER:
			return css`
        display: none;
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
		case InputMulVariants.FILLED:
			return css`
        background-color: var(--color-gray-100);
        border: 1px solid var(--color-gray-100);
        cursor: not-allowed;
      `;
		case InputMulVariants.OUTLINED:
			return css`
        background-color: transparent;
        border: 1px solid var(--color-gray-100);
        cursor: not-allowed;
      `;
		case InputMulVariants.UNDERLINED:
			return css`
        background-color: transparent;
        border-bottom: 1px solid var(--color-gray-100);
        cursor: not-allowed;
      `;
		default:
			return "";
	}
};

const StyledTextarea = styled.textarea`
  resize: none;
  appearance: none;
  font: inherit;
  text-align: left;
  outline: none;
  overflow: ${(props) => (props.overflow ? "auto" : "hidden")};
  padding: 14.5px 12px;
  width: ${(props) => props.width || "100%"};
  height: ${(props) => props.height || "auto"};
  ${(props) => props.maxHeight && `max-height: ${props.maxHeight};`}
  ${(props) => inputVariants[props.variant || InputMulVariants.FILLED]};
  ${(props) => inputSizes[props.size || InputMulSizes.MEDIUM]};
  ${(props) => props.disabled && disabledStyles(props.variant)};
  ${(props) =>
		props.isFocused &&
		props.variant === InputMulVariants.UNDERLINED &&
		css`
      border-bottom: 1px solid var(--color-primary-500);
    `}
  padding-left: ${(props) =>
		props.IconPostion === "start" ? "40px" : "14.5px"};
  ${(props) =>
		props.noOutline &&
		css`
      &:focus:enabled {
        outline: none;
      }
    `}
  ${(props) =>
		props.noBorder &&
		css`
      border: none;
      &:hover:enabled {
        border: none;
      }
    `}
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
  ${(props) =>
		props.variant === InputMulVariants.FLACEHOLDER &&
		css`
      display: none;
    `}
  left: ${(props) => (props.IconPostion === "start" ? "30px" : "")};
  ${(props) =>
		(props.isFocused || props.isValid) && labelVariant(props.variant)};
  ${(props) =>
		props.isFocused &&
		css`
      color: var(--color-primary-500);
    `}
`;

const HelperText = styled.p`
  ${(props) => helperTextVariants[props.variant || InputMulVariants.OUTLINED]}
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

const InputMultiline = (props) => {
	const {
		value,
		onChange,
		size,
		label,
		required,
		width,
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
		maxHeight,
		rows,
		variant,
		helperText,
		icon,
		IconPostion,
		autoInserRow,
		noOutline,
		noBorder,
	} = props;
	const [isFocused, setIsFocused] = useState(false);
	const [isValid, setIsValid] = useState(false);
	const [overflow, setOverflow] = useState(false);
	const [charecterCount, setCharecterCount] = useState(0);
	const handleFocus = () => {
		if (onFocus) onFocus();
		setIsFocused(true);
	};

	const handleBlur = () => {
		onBlur && onBlur();
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
	const textAreaRef = useRef(null);

	useEffect(() => {
		if (textAreaRef.current) {
			textAreaRef.current.style.height = "auto";
			textAreaRef.current.style.height =
				textAreaRef.current.scrollHeight + "px";
		}
	}, [textAreaRef.current]);

	const AutoResizeTextArea = () => {
		if (textAreaRef.current) {
			textAreaRef.current.style.height = "auto";
			textAreaRef.current.style.height =
				textAreaRef.current.scrollHeight + "px";
			// console.log(maxHeight.toString(), textAreaRef.current.style.height);

			if (
				parseInt(maxHeight.replace("px", "")) <
				parseInt(textAreaRef.current.style.height.replace("px", ""))
			) {
				setOverflow(true);
			} else {
				setOverflow(false);
			}
			console.log("styled: " + textAreaRef.current.style.height, maxHeight);
		}
	};
	return (
		<div>
			<StyledContainer>
				<StyledTextarea
					maxHeight={maxHeight}
					overflow={overflow}
					size={size}
					ref={textAreaRef}
					rows={rows || 1}
					value={value}
					onChange={onChange}
					label={label}
					variant={variant || InputMulVariants.OUTLINED}
					onFocus={handleFocus}
					onBlur={handleBlur}
					isFocused={isFocused}
					maxLength={maxLength}
					width={width}
					height={height}
					error={error}
					IconPostion={IconPostion}
					onInput={autoInserRow && AutoResizeTextArea}
					noOutline={noOutline}
					noBorder={noBorder}
					placeholder={variant === InputMulVariants.FLACEHOLDER ? label : ""}
				/>

				{label && (
					<StyledLabel
						isFocused={isFocused}
						isValid={isValid}
						variant={variant || InputMulVariants.OUTLINED}
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
				{icon && <StyledIcon IconPostion={IconPostion}>{Icon}</StyledIcon>}
			</StyledContainer>
			{helperText && <HelperText>{helperText}</HelperText>}
		</div>
	);
};

InputMultiline.propTypes = {
	value: PropTypes.string,
	onChange: PropTypes.func.isRequired,
	label: PropTypes.string,
	required: PropTypes.bool,
	width: PropTypes.string,
	type: PropTypes.string,
	error: PropTypes.bool,
	onKeyUp: PropTypes.func,
	onBlur: PropTypes.func,
	onFocus: PropTypes.func,
	onKeyDown: PropTypes.func,
	height: PropTypes.string,
	ref: PropTypes.any,
	maxLength: PropTypes.number,
	id: PropTypes.string,
	rows: PropTypes.number,
	variant: PropTypes.oneOf(Object.values(InputMulVariants)),
	helperText: PropTypes.string,
	icon: PropTypes.elementType,
	IconPostion: PropTypes.oneOf(["start", "end"]),
	autoInserRow: PropTypes.bool,
	noOutline: PropTypes.bool,
	noBorder: PropTypes.bool,
};

InputMultiline.defaultProps = {
	variant: InputMulVariants.OUTLINED,
	size: InputMulSizes.MEDIUM,
	IconPostion: "end",
	autoInserRow: false,
	noOutline: false,
	noBorder: false,
};

export default InputMultiline;
export { InputMulVariants as InputVariants, InputMulSizes as InputSizes };
