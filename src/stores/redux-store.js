import { configureStore } from "@reduxjs/toolkit";
import userReducer from "~/features/user/userSlice";
import authReducer from "~/features/auth/auth-slice";
export const ReduxStore = configureStore({
	reducer: {
		user: userReducer,
		auth: authReducer,
	},
});
