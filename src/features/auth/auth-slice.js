import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	isLoginModalOpen: false,
	isRegisterModalOpen: false,
};

const authSlice = createSlice({
	name: "modal",
	initialState,
	reducers: {
		openLoginModal: (state) => {
			state.isLoginModalOpen = true;
		},
		closeLoginModal: (state) => {
			state.isLoginModalOpen = false;
		},
		openRegisterModal: (state) => {
			state.isRegisterModalOpen = true;
		},
		closeRegisterModal: (state) => {
			state.isRegisterModalOpen = false;
		},
		toggleAuthModal: (state) => {
			state.isLoginModalOpen = !state.isLoginModalOpen;
			state.isRegisterModalOpen = !state.isRegisterModalOpen;
		},
	},
});

export const {
	openLoginModal,
	closeLoginModal,
	openRegisterModal,
	closeRegisterModal,
	toggleAuthModal,
} = authSlice.actions;

export default authSlice.reducer;
