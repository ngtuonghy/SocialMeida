import { createBrowserRouter } from "react-router-dom";
import HomePage from "./home/home";
import Layout from "~/components/layouts/home-layout";
import Profile from "./profile/profile";
import Trending from "./trending/trending";
import NotificationsPage from "./notifications/notifications";
import Messanges from "./messages/Messanges";
import Videos from "./videos/videos";
import PostPage from "./post/post-page";
import Root from "./root";
import ErrorPage from "~/components/errors/error-page";
export const createRouter = () =>
	createBrowserRouter([
		{
			path: "/",
			element: <Root />,
			errorElement: <ErrorPage />,
			children: [
				{
					path: "/home",
					element: <HomePage />,
				},
				{
					path: "/notifications",
					element: (
						<Layout>
							<NotificationsPage />
						</Layout>
					),
				},
				{
					path: "/trending",
					element: (
						<Layout>
							<Trending />,
						</Layout>
					),
				},
				{
					path: "/messages",
					element: <Messanges />,
				},
				{
					path: "/:idprofile/:tab?",
					element: (
						<Layout>
							<Profile />
						</Layout>
					),
				},
				{
					path: "/videos",
					element: (
						<Layout>
							<Videos />
						</Layout>
					),
				},
				{
					path: "/posts/:postId",
					element: (
						<Layout>
							<PostPage />
						</Layout>
					),
				},
			],
		},
	]);
