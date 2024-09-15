import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { IoClose, IoMenu } from "react-icons/io5";
import "./NavBar.css";

function Navbar(props) {
  const navigate = useNavigate();
  const navTo = (destination) => {
    navigate(destination);
  };

  return (
    <header className="header">
      <div className="nav">
        <div className="nav__list">
          <div className="nav__item" onClick={() => navTo("/")}>
            Home
          </div>
          <div className="nav__item" onClick={() => navTo("/about")}>
            About Me
          </div>
          <div className="nav__item" onClick={() => navTo("/monster")}>
            Monster Chess
          </div>
        </div>
      </div>
      {props.children}
    </header>
  );
}

export default Navbar;
