import React, { useEffect, useState } from "react";
import { BsFillEyeFill, BsFillEyeSlashFill } from "react-icons/bs";
import styled from "styled-components";
import { Button, ButtonSizes } from "~/components/ui/button";
import { IconButton } from "~/components/ui/button/icon-button";
import RadioButton from "~/components/ui/button/radio-button";
import Dialog from "~/components/ui/dialog/dialog";
import Select from "~/components/ui/select/select";
import Input, { InputVariants } from "~/components/ui/text-field/input";
import { checkuser, login, register } from "../api/auth";

const StyledForm = styled.form`
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  gap: 25px;
`;
const StyledRadioButtonBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 10px;
`;
const StyledBirthday = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;
const StyledError = styled.p`
  color: red;
  font-size: 14px;
`;
const StyledBox = styled.div`
  display: block;
`;
const options = [
  { label: "January", value: 1 },
  { label: "February", value: 2 },
  { label: "March", value: 3 },
  { label: "April", value: 4 },
  { label: "May", value: 5 },
  { label: "June", value: 6 },
  { label: "July", value: 7 },
  { label: "August", value: 8 },
  { label: "September", value: 9 },
  { label: "October", value: 10 },
  { label: "November", value: 11 },
  { label: "December", value: 12 },
];

const RegisterForm = () => {
  const [firstRun, setFirstRun] = useState(true);
  const [isOpen, setIsOpen] = React.useState(false);
  const [isShowPassword, setIsShowPassword] = React.useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [enableButton, setEnableButton] = useState(true);

  const [timer, setTimer] = useState(null);
  const [registerData, setRegisterData] = useState({
    username: "",
    password: "",
    email: "",
    name: "",
    birthMonth: "",
    birthDay: "",
    birthYear: "",
    gender: "",
  });

  const [errorMessage, setErrorMessage] = useState({
    username: "",
    password: {
      m1: "",
      m2: "",
    },
    email: "",
    name: "",
    birthMonth: "",
    birthDay: "",
  });

  const handleRadioChange = (e) => {
    setSelectedOption(e.target.value);
    setRegisterData({ ...registerData, gender: e.target.value });
  };
  const handleSelect = (option) => {
    setRegisterData({ ...registerData, birthMonth: option });
  };
  useEffect(() => {
    return () => {
      clearTimeout(timer);
    };
  }, [timer]);

  const handleRegister = async (e) => {
    e.preventDefault();
    const dayOfBirth = `${registerData.birthYear}-${registerData.birthMonth}-${registerData.birthDay}`;
    const res = await register({
      username: registerData.username,
      password: registerData.password,
      dayOfBirth,
      name: registerData.name,
      email: registerData.email,
      sex: registerData.gender,
    });
    if (res.code === 200) {
      await login({
        username: registerData.username,
        password: registerData.password,
      }).then((res) => {
        if (res.code === 200) {
          setIsOpen(false);
          window.location.reload();
        }
      });
    }
  };

  const handeUsernameChange = (e) => {
    const value = e.target.value;
    setRegisterData({ ...registerData, username: value });
    clearTimeout(timer);
    if (value.length < 4) {
      setErrorMessage({
        ...errorMessage,
        username: "* Username must be between 4 and 25 characters.",
      });
    } else {
      setTimer(
        setTimeout(async () => {
          const res = await checkuser(value);
          if (res.code === 409) {
            setErrorMessage({
              ...errorMessage,
              username: "* This username is unvailable",
            });
          } else {
            setErrorMessage({ ...errorMessage, username: "" });
          }
        }, 1000),
      );
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setRegisterData({ ...registerData, password: value });
    if (value.length < 8) {
      setErrorMessage((prevState) => ({
        ...prevState,
        password: { ...prevState.password, m1: "* 8-71 characters" },
      }));
    } else {
      setErrorMessage((prevState) => ({
        ...prevState,
        password: { ...prevState.password, m1: "" },
      }));
    }
    const regex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+\\|[\]{};:'",.<>/?]).+$/;
    if (!value.match(regex)) {
      setErrorMessage((prevState) => ({
        ...prevState,
        password: {
          ...prevState.password,
          m2: "* At least one uppercase letter, one number, and one special character",
        },
      }));
    } else {
      setErrorMessage((prevState) => ({
        ...prevState,
        password: { ...prevState.password, m2: "" },
      }));
    }
  };
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setRegisterData({ ...registerData, email: value });
    const regex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!value.match(regex)) {
      setErrorMessage({
        ...errorMessage,
        email: "* Please enter a valid email.",
      });
    } else {
      setErrorMessage({ ...errorMessage, email: "" });
    }
  };

  useEffect(() => {
    if (firstRun === false) {
      setEnableButton(!isAllEmptyStrings(errorMessage));
    } else {
      setFirstRun(false);
    }
  }, [errorMessage]);

  const isAllEmptyStrings = (obj) => {
    for (const key in obj) {
      if (typeof obj[key] === "object" && obj[key] !== null) {
        if (!isAllEmptyStrings(obj[key])) return false;
      } else if (obj[key] !== "") {
        return false;
      }
    }
    return true;
  };

  /*   const calculateDaysInMonth = (month, year) => {
    if (month === "4" || month === "6" || month === "9" || month === "11") {
      return 30;
    } else if (month === "2") {
      return isLeapYear(year) ? 29 : 28;
    } else {
      return 31;
    }
  };

  const isLeapYear = (year) => {
    return (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
  }; */
  const handleYearChange = (e) => {
    const value = e.target.value;
    setRegisterData({ ...registerData, birthYear: value });
    if (value.length !== 4 && value.length !== 0) {
      setErrorMessage({
        ...errorMessage,
        birthYear: "* Please enter a valid year.",
      });
    } else {
      setErrorMessage({ ...errorMessage, birthYear: "" });
    }
  };
  // console.log(registerData);
  return (
    <>
      <Dialog maxWidth="500px" isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div
          style={{
            padding: "5px 20px",
          }}
        >
          <h2>Join Social Media now</h2>
          <StyledForm onSubmit={handleRegister}>
            <StyledBox>
              <Input
                required
                size="small"
                label="Username"
                maxLength={25}
                value={registerData.username}
                onChange={handeUsernameChange}
              />
              {errorMessage.username && (
                <StyledError>{errorMessage.username}</StyledError>
              )}
            </StyledBox>
            <StyledBox>
              <Input
                required
                size="small"
                label="Password"
                maxLength={71}
                value={registerData.password}
                onChange={handlePasswordChange}
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
              {errorMessage.password.m1 && (
                <StyledError>{errorMessage.password.m1}</StyledError>
              )}
              {errorMessage.password.m2 && (
                <StyledError>{errorMessage.password.m2}</StyledError>
              )}
            </StyledBox>
            <StyledBox>
              <Input
                required
                size="small"
                label="Email"
                value={registerData.email}
                onChange={handleEmailChange}
              />
              {errorMessage.email && (
                <StyledError>{errorMessage.email}</StyledError>
              )}
            </StyledBox>

            <StyledBox>
              <Input
                size="small"
                label="Nick name"
                value={registerData.name}
                onChange={(e) =>
                  setRegisterData({ ...registerData, name: e.target.value })
                }
              />
            </StyledBox>

            <StyledBox>
              <StyledBirthday>
                <Select
                  options={options}
                  label="Month"
                  height="40.4px"
                  onClick={handleSelect}
                />
                <Input
                  size="small"
                  label="Day"
                  value={registerData.birthDay}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      birthDay: e.target.value,
                    })
                  }
                />
                <Input
                  size="small"
                  label="Year"
                  value={registerData.birthYear}
                  onChange={handleYearChange}
                />
              </StyledBirthday>
              {errorMessage.birthYear && (
                <StyledError>{errorMessage.birthYear}</StyledError>
              )}
            </StyledBox>
            <StyledRadioButtonBox>
              <RadioButton
                width="200px"
                label="Male"
                name="customRadioGroup"
                value="male"
                checked={selectedOption === "male"}
                onChange={handleRadioChange}
              />
              <RadioButton
                width="200px"
                label="Female"
                name="customRadioGroup"
                value="female"
                checked={selectedOption === "female"}
                onChange={handleRadioChange}
              />
              <RadioButton
                width="200px"
                label="Other"
                name="customRadioGroup"
                value="other"
                checked={selectedOption === "other"}
                onChange={handleRadioChange}
              />
            </StyledRadioButtonBox>
            <Button
              size={ButtonSizes.MEDIUM}
              height="38px"
              width="auto"
              type="button"
              disabled={enableButton}
            >
              Resgister
            </Button>
          </StyledForm>
        </div>
      </Dialog>
      <Button onClick={() => setIsOpen(true)}>Register</Button>
    </>
  );
};

export default RegisterForm;
