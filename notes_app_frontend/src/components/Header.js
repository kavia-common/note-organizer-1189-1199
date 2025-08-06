import React, { useContext } from "react";
import { AuthContext } from "../App";
import { useTheme } from "../theme/ThemeContext";
import { FiSun, FiMoon, FiLogOut } from "react-icons/fi";
import "./Header.css";

function getInitials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0]?.toUpperCase())
    .join("")
    .substring(0, 2);
}

function Header() {
  const { user, logout } = useContext(AuthContext);
  const { theme, setTheme } = useTheme();

  return (
    <header className="top-header">
      <div className="header-flex">
        <span className="header-app-title">
          <span className="accent-dot"></span> Notes
        </span>

        <div className="header-actions">
          <button
            title={theme === "light" ? "Enable dark mode" : "Enable light mode"}
            className="icon-btn"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            {theme === "light" ? <FiMoon size={19} /> : <FiSun size={19} />}
          </button>
          <div className="user-badge" title={user?.email} tabIndex={0}>
            {getInitials(user?.username || user?.email)}
          </div>
          <button
            className="icon-btn"
            title="Logout"
            onClick={logout}
            style={{ marginLeft: 8 }}
          >
            <FiLogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
