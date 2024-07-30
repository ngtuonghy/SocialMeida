import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	data: [],
	loading: false,
	offset: 0,
	hasMore: true,
};

export const postSlice = createSlice({
	name: "posts",
	initialState,
	reducers: {
		setPost: (state, action) => {
			state.data = action.payload;
		},
		setHasMore: (state, action) => {
			state.hasMore = action.payload;
		},
		setOffset: (state, action) => {
			state.offset = action.payload;
		},
	},
});

// Action creators are generated for each case reducer function
export const { setPost, setHasMore, setOffset } = postSlice.actions;

export default postSlice.reducer;
