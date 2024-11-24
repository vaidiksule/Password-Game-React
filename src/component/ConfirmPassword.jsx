import React, { useState } from "react";
import "./PasswordPage.css";

const ConfirmPassword = ({ initialPassword, onSuccess }) => {
  const [confirmPassword, setConfirmPassword] = useState("");
  const [startTime] = useState(new Date().getTime());
  const [showSuccess, setShowSuccess] = useState(false);

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleConfirmPasswordSubmit = () => {
    if (confirmPassword === initialPassword) {
      const endTime = new Date().getTime();
      const timeTaken = Math.round((endTime - startTime) / 1000);
      setShowSuccess(true);
      onSuccess(timeTaken, confirmPassword.length);
    } else {
      alert("Passwords do not match. Please try again.");
      setConfirmPassword("");
    }
  };

  return (
    <div className="password-page">
      {!showSuccess ? (
        <>
          <h2>Confirm Password</h2>
          <input
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            className="password-input"
          />
          <button onClick={handleConfirmPasswordSubmit} className="password-button">Submit</button>
        </>
      ) : null}
    </div>
  );
};

export default ConfirmPassword;
