import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import styled, { css } from "styled-components";
import { useViewport } from "~/context/viewportContext";
import { PiVideo, PiVideoBold } from "react-icons/pi";
import {
	HiOutlineBell,
	HiOutlineMagnifyingGlass,
	HiOutlineHome,
	HiOutlineEnvelope,
	HiHome,
	HiBell,
	HiMagnifyingGlass,
	HiEnvelope,
	HiMiniMagnifyingGlassCircle,
	HiArrowTrendingUp,
	HiOutlineArrowTrendingUp,
	HiOutlineUsers,
	HiUsers,
} from "react-icons/hi2";
import { IconContext } from "react-icons";

const SBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 5px;
`;
const SLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: black;
  font-size: 30px;
  padding-inline: 47px;
  padding-block: 5px;
  border-radius: 10px;
  position: relative;
  &:hover {
    background-color: var(--color-gray-100);
  }
  ${({ active }) =>
		active &&
		css`
      &:after {
        content: "";
        display: block;
        position: absolute;
        width: 100%;
        height: 3px;
        background-color: var(--color-primary-500);
        top: 100%;
        right: 0;
        left: 0;
      }
    `}
`;
const HeaderNav = () => {
	const params = useLocation().pathname;
	const { width } = useViewport();
	const [isSmallScreen, setIsSmallScreen] = useState(false);

	const item = [
		{
			label: "Home",
			href: "/home",
			icon: params === "/home" ? <HiHome /> : <HiOutlineHome />,
		},
		{
			label: "Friends",
			href: "/friends",
			icon: params === "/friends" ? <HiUsers /> : <HiOutlineUsers />,
		},
		{
			label: "Treding",
			href: "/trending",
			icon:
				params === "/trending" ? (
					<HiArrowTrendingUp />
				) : (
					<HiOutlineArrowTrendingUp />
				),
		},
		// {
		// 	label: "videos",
		// 	href: "/videos",
		// 	icon: params === "/videos" ? <PiVideoBold /> : <PiVideo />,
		// },
		{
			label: "Notifications",
			href: "/notifications",
			icon: params === "/notifications" ? <HiBell /> : <HiOutlineBell />,
		},
		// {
		// 	label: "Messages",
		// 	href: "/messages",
		// 	icon: params === "/messages" ? <HiEnvelope /> : <HiOutlineEnvelope />,
		// },
	];

	useEffect(() => {
		width < 650 ? setIsSmallScreen(true) : setIsSmallScreen(false);
	}, [width]);
	if (isSmallScreen) {
		return null;
	}
	return (
		<SBox>
			{item.map((items, index) => (
				<SLink active={items.href === params} key={index} to={items.href}>
					<IconContext.Provider
						value={{
							style: {
								color: `${items.href === params ? "var(--color-primary-500)" : "black"}`,
								fontSize: "30px",
							},
						}}
					>
						{items.icon}
					</IconContext.Provider>
				</SLink>
			))}
		</SBox>
	);
};

export default HeaderNav;
