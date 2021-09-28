import React from "react";
import "./Main.css";

export default function Main() {
  return (
    <div className="Main">
      <div className="lander">
        <h1>You are logged in!</h1>
        <p className="text-muted">This is the Main page for logged in user.</p>
      </div>
    </div>
  );
}