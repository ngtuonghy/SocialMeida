import { useEffect, useState } from "react";
import {
	Link,
	Outlet,
	ScrollRestoration,
	useNavigation,
} from "react-router-dom";
import reactLogo from "~/assets/react.svg";
import "./root.css";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserById } from "~/features/user/userSlice";
import { useViewport } from "~/context/viewportContext";
import { useRef } from "react";
import LoginForm from "~/features/auth/components/login-form";
import RegisterForm from "~/features/auth/components/register-form";
import Popover from "~/components/ui/pop-over/pop-over";
import { CSSTransition } from "react-transition-group";
import styled from "styled-components";
import { IoIosLogOut, IoMdArrowBack, IoMdSettings } from "react-icons/io";
import { AiOutlineRight } from "react-icons/ai";
import env from "~/config/env";
import HeaderNav from "~/features/header/components/header-nav";
import Input from "~/components/ui/text-field/input";
import { FaSearch } from "react-icons/fa";
import Avatar from "~/components/ui/avatar/avatar";
import useUser from "~/hooks/use-user";
const serverUrl = env.serverPort;

const Root = () => {
	const dispatch = useDispatch();
	const user = useUser();
	const { t, i18n } = useTranslation();
	const navigation = useNavigation();
	const [isHidden, setIsHidden] = useState(false);
	const { width } = useViewport();
	const loading = useSelector((state) => state.user.loading);

	const changeLanguageHandler = () => {
		i18n.changeLanguage("vi");
	};

	useEffect(() => {
		dispatch(fetchUserById());
	}, [dispatch]);

	useEffect(() => {
		if (width < 768) {
			setIsHidden(true);
		} else {
			setIsHidden(false);
		}
	}, [width]);

	if (loading) {
		return (
			<div className="loading">
				<div className="loading__spinner"></div>
			</div>
		);
	}

	return (
		<header
			className={`header  ${navigation.state === "loading" ? "loading" : ""}`}
		>
			<nav className="header__nav">
				<div className="header__container">
					<Link to="/home" className="header__img">
						<img
							src={reactLogo}
							className="header__logo logo"
							alt="React logo"
						/>
						{!isHidden && (
							<div
								style={{
									position: "absolute",
									paddingLeft: "45px",
								}}
							>
								<Input
									borderRadius={"9999jpx"}
									icon={<FaSearch size={17} />}
									IconPostion="start"
									width="200px"
									height="35px"
									type="text"
									label="Search"
									name=""
									id=""
								/>
							</div>
						)}
					</Link>
					<HeaderNav />

					{!user ? (
						<div className="nav__button-container">
							<LoginForm />
							<RegisterForm />
						</div>
					) : (
						<div
							style={{
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<Popover
								width="250px"
								buttonContent={
									<Avatar src={user.avatar_url} width="40px" height="40px" />
								}
							>
								<Menu />
							</Popover>
						</div>
					)}
				</div>
			</nav>
			<Outlet />
		</header>
	);
};

const Item = styled.div`
  display: flex;
  align-items: center;
  font-size: 18px;
  cursor: pointer;
  gap: 10px;
  justify-content: start;
  border-radius: var(--border-radius-small);
  &:hover {
    background-color: var(--color-gray-100);
  }
`;
const IconMenuLeft = styled.div`
  display: flex;
  border-radius: 50%;
  align-items: center;
  background-color: var(--color-gray-200);
  padding: 5px;
`;
const IconMenuRight = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: auto; /* Ensures it is pushed to the right */
`;

const SLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
`;
const Shr = styled.hr`
  border: 1px solid var(--color-gray-300);
  margin: 5px;
`;
const Menu = () => {
	const user = useUser();
	const [activeMenu, setActiveMenu] = useState("main");
	const [menuHeight, setMenuHeight] = useState(null);
	const dropdownRef = useRef(null);

	useEffect(() => {
		setMenuHeight(dropdownRef.current?.firstChild.offsetHeight);
	}, []);

	function calcHeight(el) {
		const height = el.offsetHeight;
		setMenuHeight(height);
	}
	const MenuItems = ({ children, goToMenu, leftIcon, rightIcon = true }) => {
		return (
			<Item
				onClick={() => goToMenu && setActiveMenu(goToMenu)}
				className="menu-item"
			>
				{leftIcon && <IconMenuLeft>{leftIcon}</IconMenuLeft>}
				{children}
				{goToMenu && rightIcon && (
					<IconMenuRight>
						<AiOutlineRight size={25} />
					</IconMenuRight>
				)}
			</Item>
		);
	};

	const handleLogout = async () => {
		try {
			const response = await fetch(`${serverUrl}api/v1/auth/logout/`, {
				method: "POST", // or 'PUT'
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
			});

			const data = await response.json();
			if (response.status === 200) {
				window.location.reload();
			}

			console.log("Response data:", data); // Dữ liệu phản hồi
		} catch (error) {
			console.error("Fetch error:", error);
		}
	};
	return (
		<div className="dropdown" style={{ height: menuHeight }} ref={dropdownRef}>
			<CSSTransition
				in={activeMenu === "main"}
				timeout={500}
				unmountOnExit
				classNames="menu-primary"
				onEnter={calcHeight}
			>
				<div>
					<MenuItems>
						<SLink to={`/${user.username}`}>
							<Avatar src={user.avatar_url} width="40px" height="40px" />
							<span>{user.name}</span>
						</SLink>
					</MenuItems>
					<Shr />
					<MenuItems
						leftIcon={<IoMdSettings size={25} />}
						goToMenu={"settings"}
					>
						Settings
					</MenuItems>
					<MenuItems leftIcon={<IoIosLogOut size={25} />}>
						<div onClick={handleLogout}>Logout</div>
					</MenuItems>
				</div>
			</CSSTransition>

			<CSSTransition
				in={activeMenu === "settings"}
				timeout={500}
				unmountOnExit
				onEnter={calcHeight}
				classNames="menu-secondary"
			>
				<div>
					<MenuItems
						rightIcon={false}
						goToMenu="main"
						leftIcon={<IoMdArrowBack size={25} />}
					>
						<h3>Settings</h3>
					</MenuItems>
					<MenuItems>
						<p>tw</p>
					</MenuItems>
				</div>
			</CSSTransition>
		</div>
	);
};
export default Root;
