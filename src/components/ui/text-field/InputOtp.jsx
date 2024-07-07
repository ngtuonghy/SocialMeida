import React, { useState, useRef, useEffect } from "react";
import "./InputOtp.css";
let currentOTPIndex = 0;
const InputOtp = ({ onChange, invalid }) => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [activeOTPIndex, setActiveOTPIndex] = useState(0);

  const inputRef = useRef(null);

  const handleOnChange = (e) => {
    const value = e.target.value;
    const newOTP = [...otp];
    newOTP[currentOTPIndex] = value.substring(value.length - 1);

    if (!value) setActiveOTPIndex(currentOTPIndex - 1);
    else setActiveOTPIndex(currentOTPIndex + 1);

    setOtp(newOTP);
    onChange(newOTP.join(""));
  };

  const handleOnKeyDown = (e, index) => {
    currentOTPIndex = index;
    if (e.key === "Backspace") setActiveOTPIndex(currentOTPIndex - 1);
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text");
    const newOTP = pasteData.split("").slice(0, 6);
    if (newOTP.length < 6) {
      newOTP += "-".repeat(6 - newOTP.length);
    }
    setOtp(newOTP);
    onChange(newOTP.join(""));
  };
  useEffect(() => {
    inputRef.current?.focus();
  }, [activeOTPIndex]);

  return (
    <div className="input-otp">
      {otp.map((_, index) => {
        return (
          <div key={index}>
            <input
              ref={activeOTPIndex === index ? inputRef : null}
              type="text"
              className="input__text-otp"
              onChange={handleOnChange}
              onKeyDown={(e) => handleOnKeyDown(e, index)}
              value={otp[index]}
              onPaste={handlePaste}
              style={{
                border: invalid ? "1px solid red" : "",
                outline: invalid ? "none" : "",
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default InputOtp;
