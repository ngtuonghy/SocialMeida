import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getProfile } from "./api/user-api";
import Cookies from "js-cookie";

export const fetchUserById = createAsyncThunk(
	"user/login",
	async (_, thunkAPI) => {
		const userId = Cookies.get("userId"); // Lấy userId từ cookie
		const response = await getProfile(userId);
		// console.log(thunkAPI);
		return response.data.user;
	},
);

const initialState = {
	data: null,
	loading: false,
};

export const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		// decrement: (state) => {
		//   state.value -= 1;
		// },
		// incrementByAmount: (state, action) => {
		//   state.value += action.payload;
		// },
	},
	extraReducers: (builder) => {
		builder.addCase(fetchUserById.fulfilled, (state, action) => {
			state.data = action.payload;
			state.loading = false;
		});
		builder.addCase(fetchUserById.pending, (state) => {
			state.loading = true;
		});
		builder.addCase(fetchUserById.rejected, (state) => {
			state.loading = false;
		});
	},
});

// Action creators are generated for each case reducer function
export const {} = userSlice.actions;

export default userSlice.reducer;
