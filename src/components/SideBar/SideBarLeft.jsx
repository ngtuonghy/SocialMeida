import React, { useEffect, useState } from "react";
import "./SideBar.css";
import { useLocation } from "react-router-dom";
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
} from "react-icons/hi2";
import { Link, useSearchParams } from "react-router-dom";
import { IconContext } from "react-icons";
import { FaSearch } from "react-icons/fa";
import { useViewport } from "~/context/viewportContext";

function SideBarLeft() {
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
      label: "Notifications",
      href: "/notifications",
      icon: params === "/notifications" ? <HiBell /> : <HiOutlineBell />,
    },
    {
      label: "Explore",
      href: "/explore",
      icon: params === "/explore" ? <FaSearch /> : <HiOutlineMagnifyingGlass />,
    },
    {
      label: "Messages",
      href: "/messages",
      icon: params === "/messages" ? <HiEnvelope /> : <HiOutlineEnvelope />,
    },
  ];

  useEffect(() => {
    width < 650 ? setIsSmallScreen(true) : setIsSmallScreen(false);
  }, [width]);

  return (
    <div className="sideBarLeft">
      <div className="sideBarLeft-container">left right </div>
    </div>
  );
}

export default SideBarLeft;
