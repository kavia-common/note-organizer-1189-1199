import React from "react";
import "./LoadingOverlay.css";

function LoadingOverlay() {
  return (
    <div className="loading-overlay">
      <div className="loader"></div>
      <div className="loading-text">Loading...</div>
    </div>
  );
}
export default LoadingOverlay;
