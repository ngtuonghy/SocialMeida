import React, { useEffect, useRef, useState } from "react";
import SideBarLeft from "~/components/layouts/sidebar-Left";
import SideBarRight from "~/components/layouts/sidebar-right";

import "./Layout.css";

import { useViewport } from "~/context/viewportContext";
import { render } from "react-dom";
const Layout = ({ children }) => {
	const [isSmallScreen, setIsSmallScreen] = useState(false);
	const [rerender, setRerender] = useState(false);
	const { width } = useViewport();
	/*  const mainRef = useRef(null);
  // useEffect(() => {
  //   setRerender((prev) => !prev);
  // }, []);
  useEffect(() => {
    const isSmall1 = 1124;
    const isSmall2 = 768;
    const isSmall3 = 500;

    switch (true) {
      case width >= isSmall1:
        setIsSmallScreen(false);
        break;
      case width >= isSmall2:
        mainRef.current.classList.add("width-marginLeft");
        setIsSmallScreen(true);
        break;
      case width >= isSmall3:
        mainRef.current.classList.remove("width-marginLeft");
        setIsSmallScreen(true);
        break;
      default:
        mainRef.current.classList.remove("width-marginLeft");
        setIsSmallScreen(true);
        break;
    }

  }, [width]);
  */
	// console.log("check render", width);
	return (
		<>
			<main className="layout__main">
				<div className="layout__left">
					<SideBarLeft />
				</div>
				<div
					style={{ width: "100%", height: "100%" }}
					className="layout__content"
				>
					{children}
				</div>
				{width > 800 && (
					<div className="layout__right">
						<SideBarRight />
					</div>
				)}
			</main>
		</>
	);
};

export default Layout;
