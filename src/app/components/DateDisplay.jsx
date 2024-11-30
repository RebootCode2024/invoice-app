"use client";
import React from "react";

const DateDisplay = () => {
  const getCurrentDate = () => {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  };

  return (
    <p
      style={{
        textAlign: "center",
        fontSize: "1.2em",
        color: "#555",
        marginTop: "5px",
        fontWeight: "bold",
      }}
    >
      {getCurrentDate()}
    </p>
  );
};

export default DateDisplay;
