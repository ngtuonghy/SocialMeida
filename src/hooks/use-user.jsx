import { useSelector } from "react-redux";

const useUser = () => {
	const user = useSelector((state) => state.user.data);
	return user;
};

export default useUser;
