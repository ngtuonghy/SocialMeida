import { styled } from "@panda-css/jsx";

const Button = styled("button", {
	base: {
		cursor: "pointer",
		w: "100%",
		rounded: "md",
		transition: "ease-in-out",
		colorPalette: "indigo",
		_active: {
			transform: "scale(0.95)",
		},
	},
	variants: {
		variant: {
			contained: {
				color: "white",
				bg: "colorPalette.500",
				_hover: {
					bg: "colorPalette.600",
				},
			},
			outlined: {
				background: "transparent",
				color: "colorPalette.500",
				border: "1px solid",
				borderColor: "colorPalette.500",
				_hover: {
					bg: "colorPalette.500",
					color: "white",
				},
			},
			text: {
				background: "transparent",
				color: "colorPalette.500",
				_hover: {
					bg: "colorPalette.500",
					color: "white",
				},
			},
		},
		disabled: {
			true: {
				opacity: "0.5",
				cursor: "initial",
				pointerEvents: "none",
			},
		},
		size: {
			sm: { px: "1", py: "1", fontSize: "12px" },
			md: { px: "1.5", py: "1.5", fontSize: "md" },
			lg: { px: "4", py: "4", fontSize: "24px" },
		},
	},

	defaultVariants: {
		variant: "contained",
		size: "md",
	},
});
export { Button };
