import React, { useContext, useEffect, useState } from "react";
import { getComments } from "../api/comment";

const listCommentContext = React.createContext({
	comments: [],
	setComments: () => {},
	fetchData: () => {},
	fetchMoreData: () => {},
	hasMore: true,
	setHasMore: () => {},
	offset: 0,
	setOffset: () => {},
});

const CommentsProvider = ({ children }) => {
	const [comments, setComments] = useState([]);
	const [offset, setOffset] = useState(0);
	const [hasMore, setHasMore] = useState(true);

	const fetchData = async (params) => {
		const res = await getComments(params, { offset: offset, limit: 10 });
		if (res.code === 200) {
			setComments(res.data);
			setOffset(offset + 10);
			if (res.data.length <= 0) setHasMore(false);
		}
	};

	const fetchMoreData = async (params) => {
		const res = await getComments(params, { offset: offset, limit: 10 });
		if (res.code === 200) {
			setComments((d) => [...d, ...res.data]);
			setOffset(offset + 10);
			if (res.data.length <= 0) setHasMore(false);
		}
	};

	return (
		<listCommentContext.Provider
			value={{
				comments,
				setComments,
				fetchData,
				fetchMoreData,
				hasMore,
				setHasMore,
				offset,
				setOffset,
			}}
		>
			{children}
		</listCommentContext.Provider>
	);
};

const useComments = () => {
	const context = useContext(listCommentContext);
	if (context === undefined) {
		throw new Error("useListComment must be used within a ListCommentProvider");
	}
	return context;
};

export default CommentsProvider;
export { useComments };
