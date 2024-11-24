import React from "react";

const CompletedPage = ({ passwordLength, timeTaken }) => {
  const minutes = Math.floor(timeTaken / 60);
  const seconds = timeTaken % 60;

  return (
    <div className="completed-page">
      <h1>Congratulations!</h1>
      <p>Your password length is {passwordLength} and it took you {minutes} min and {seconds} second(s) to decide your password.</p>
    </div>
  );
};

export default CompletedPage;
