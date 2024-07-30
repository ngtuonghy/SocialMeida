import React, { useEffect, useState } from "react";
import "./home.css";
import Layout from "~/components/layouts/home-layout";
import CreatePost from "~/features/post/components/create-post";
import Post from "~/features/post/components/post";
import useUser from "~/hooks/use-user";
import { Outlet } from "react-router-dom";
const Home = () => {
	const user = useUser();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const toggleModal = () => {
		setIsModalOpen((prevState) => !prevState);
	};

	useEffect(() => {
		document.title = `Home`;
	}, []);

	return (
		<>
			<Layout>
				<div className="home">
					{user && (
						<div className="home__profile">
							<img className="home__avatar" src={user.avatarUrl} alt="" />
							<div
								style={{
									width: "100%",
									padding: "10px",
									cursor: "pointer",
									backgroundColor: "var(--color-gray-100)",
									borderRadius: "10px",
								}}
								onClick={toggleModal}
							>
								What's on your mind, {user.name}
							</div>
						</div>
					)}
				</div>
				{user && (
					<CreatePost
						isModalOpen={isModalOpen}
						setIsModalOpen={setIsModalOpen}
					/>
				)}
				<Post />
			</Layout>
			<Outlet />
		</>
	);
};

export default Home;
