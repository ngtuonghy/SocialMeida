import { configureStore } from "@reduxjs/toolkit";
import userReducer from "~/features/user/userSlice";
import postReducer from "~/features/post/postSlice";
import authReducer from "~/features/auth/auth-slice";
export const ReduxStore = configureStore({
	reducer: {
		user: userReducer,
		auth: authReducer,
		posts: postReducer,
	},
});
