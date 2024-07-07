import React, { useState } from "react";
import PropTypes from "prop-types";
import Dialog from "~/components/ui/dialog/dialog";
import { Button, ButtonSizes } from "~/components/ui/button";
import Input from "~/components/ui/text-field/input";
import { BsFillEyeFill, BsFillEyeSlashFill } from "react-icons/bs";
import styled from "styled-components";
import { IconButton } from "~/components/ui/button/icon-button";
import Link from "~/components/ui/link/link";
import { FaGithub, FaMinusCircle } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { getGithubOAuthURL, getGoogleOAuthURL, login } from "../api/auth";

const StyledForm = styled.form`
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;
const StyledOAuthBox = styled.div`
  margin-top: 30px;
  display: flex;
  flex-direction: row;
  gap: 15px;
  margin-bottom: 20px;
`;
const StyledNotification = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
  color: var(--color-red-500);
  border: 1px solid var(--color-red-500);
  border-left: 5px solid var(--color-red-500);
  padding: 10px 20px;
`;
const StyledMessage = styled.p`
  color: black;
  font-size: 0.9rem;
  font-weight: 500;
  text-align: center;
`;
const LoginForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [notification, setNotification] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login({ username, password });
    if (res.code === 200) {
      setIsOpen(false);
      window.location.reload();
    } else {
      setNotification(
        "Username and password do not match or you do not have an account yet",
      );
    }
  };
  // console.log(getGithubOAuthURL());
  return (
    <>
      <Dialog
        maxWidth="500px"
        maxHeight="auto"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <div
          style={{
            padding: "0 20px",
          }}
        >
          <h2>Wellcome back</h2>
          <StyledForm onSubmit={handleSubmit}>
            {notification && (
              <StyledNotification>
                <FaMinusCircle size={25} />
                <StyledMessage>{notification}</StyledMessage>
              </StyledNotification>
            )}

            <Input
              size="small"
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              label="Password"
              size="small"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={isShowPassword ? "text" : "password"}
              icon={
                isShowPassword ? (
                  <IconButton onClick={() => setIsShowPassword(false)}>
                    <BsFillEyeSlashFill size={18} />
                  </IconButton>
                ) : (
                  <IconButton onClick={() => setIsShowPassword(true)}>
                    <BsFillEyeFill size={18} />
                  </IconButton>
                )
              }
            />
            <Link
              style={{
                fontSize: "14px",
              }}
              to={"#"}
            >
              Forget password?
            </Link>
            <Button
              size={ButtonSizes.MEDIUM}
              height="38px"
              width="auto"
              type="button"
            >
              Login
            </Button>
          </StyledForm>
          <StyledOAuthBox>
            <Link
              style={{
                width: "100%",
              }}
              to={getGithubOAuthURL()}
            >
              <Button width="100%" startIcon={<FaGithub />}>
                Continue with Github
              </Button>
            </Link>
            <Link
              style={{
                width: "100%",
              }}
              to={getGoogleOAuthURL()}
            >
              <Button width="100%" startIcon={<FcGoogle />}>
                Continue with Google
              </Button>
            </Link>
          </StyledOAuthBox>
          Don’t have an account?<Link to={"#"}>Sign up</Link>
        </div>
      </Dialog>
      <Button onClick={() => setIsOpen(true)}>Login</Button>
    </>
  );
};

LoginForm.propTypes = {};

export default LoginForm;
