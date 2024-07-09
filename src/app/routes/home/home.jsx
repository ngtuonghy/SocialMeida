import React, { useEffect, useState } from "react";
import "./home.css";
import { useSelector } from "react-redux";
import Layout from "~/components/layouts/home-layout";
import CreatePost from "~/features/post/components/create-post";
import Post from "~/features/post/components/post";
import { Button } from "~/components/ui/button";
import useUser from "~/hooks/use-user";
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
		<Layout>
			{user && (
				<CreatePost isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
			)}
			<div className="home">
				{user && (
					<div className="home__profile">
						<img className="home__avatar" src={user.avatar_url} alt="" />
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
				<Post />
			</div>
		</Layout>
	);
};

export default Home;
