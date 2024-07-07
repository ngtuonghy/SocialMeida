import React, { useEffect, useRef, useState } from "react";
import { IoPersonAdd, IoArrowBackSharp } from "react-icons/io5";
import {
  useLocation,
  useSearchParams,
  useParams,
  Link,
} from "react-router-dom";

import "./Profile.css";
import { getProfile } from "~/api/user";
import ProfileModal from "./components/ProfileModal";
import Cookies from "js-cookie";
import { HiOutlineEnvelope } from "react-icons/hi2";
import Post from "~/features/post/components/post";
import { Button } from "~/components/ui/button";

const Profile = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  let { idprofile } = useParams();
  /*  console.log(idprofile); */

  // const { idprofile, tab } = useSearchParams();
  const [profile, setProfile] = useState({});

  const fetchDataUser = async () => {
    const response = await getProfile({ username: idprofile });

    console.log(profile);
    if (response.message === "success") {
      setProfile(response.user);
    } else {
      setProfile(null);
    }
  };

  console.log(profile);
  const toggleModal = () => {
    setIsModalOpen((prevState) => !prevState);
  };

  useEffect(() => {
    fetchDataUser();
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);

  if (profile === null) return <div>Not found</div>;

  useEffect(() => {
    document.title = `${profile.name} | ${profile.username}`;
  }, [profile]);

  const ref = useRef(null);
  useEffect(() => {
    console.log("width", ref.current ? ref.current.offsetWidth : 0);
  }, [ref.current]);
  const tablist = [
    {
      label: "Posts",
      href: "",
    },

    {
      label: "About",
      href: `/about`,
    },

    {
      label: "Media",
      href: "/media",
    },
    {
      label: "Likes",
      href: "/likes",
    },
    {
      label: "Friends",
      href: "/friends",
    },
    {
      label: "Groups",
      href: "/groups",
    },
  ];
  const [posts, setPosts] = useState([]);
  const callApi = async () => {
    await fetch(`http://localhost:3000/api/v1/posts/user/${idprofile}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setPosts(data.data);
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    callApi();
  }, []);

  const Tab = () => {
    const tab = location.pathname.split("/")[2];
    switch (tab) {
      case "about":
        return <div>About</div>;
      case "media":
        return <div>Media</div>;
      case "likes":
        return <div>Likes</div>;
      case "friends":
        return <div>Friends</div>;
      case "groups":
        return <div>Groups</div>;
      default:
        return <Post posts={posts} setPosts={setPosts} />;
    }
  };
  return (
    <>
      <ProfileModal
        profile={profile}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
      <div className="profile">
        <div className="profile__cover-image-container">
          <div
            style={{
              backgroundImage: `url(${profile.cover_image_url})`,
            }}
            className="profile__cover-image"
          />
        </div>
        <div className="profile__item">
          <div className="profile__avatar-container">
            <img src={profile.avatar_url} className="profile__avatar" />
            <h1 className="profile__name">{profile.name}</h1>
          </div>
          <div className="profile__btn-container">
            {profile.user_id === Cookies.get("userId") ? (
              <Button onClick={toggleModal}>Setup profile</Button>
            ) : (
              <div className="profile__connect">
                <div className="profile__icon">
                  <HiOutlineEnvelope size={25} />
                </div>
                <Button variant="outlined">
                  <IoPersonAdd size={20} /> add friend
                </Button>
              </div>
            )}
          </div>
        </div>
        <div className="profile-bio">
          <p style={{ whiteSpace: "pre-line" }}>{profile.bio}</p>
          <p>{profile.location}</p>
          <a href={profile.website} target="_blank">
            {profile.website}
          </a>
        </div>

        <div className="profile__tablist">
          {tablist.map((tab, index) => {
            return (
              <Link to={`/${profile.username}${tab.href}`}>
                <div key={index} className="profile__tab">
                  {tab.label}
                  {tab.href.split("/")[1] ===
                    location.pathname.split("/")[2] && (
                    <div className="profile__tab-active" />
                  )}
                </div>
              </Link>
            );
          })}
        </div>
        <Tab />
      </div>
    </>
  );
};

export default Profile;
