import React from "react";
import "./Loading.css";

const Loading = ({ isLoading = false }) => {
  return (
    isLoading && (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
      </div>
    )
  );
};

export default Loading;
