import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { FiPlusCircle, FiBook, FiTag } from "react-icons/fi";
import "./Sidebar.css";

function Sidebar() {
  const location = useLocation();
  return (
    <aside className="sidebar">
      <div className="sidebar-title">NotesApp</div>
      <nav className="sidebar-nav">
        <NavLink to="/" end className="sidebar-link">
          <FiBook className="sidebar-icon" />
          Notes
        </NavLink>
        <NavLink to="/note/new" className="sidebar-link">
          <FiPlusCircle className="sidebar-icon"/>
          New Note
        </NavLink>
      </nav>
      <footer className="sidebar-footer">
        <a className="footer-link"
          href="https://github.com/"
          target="_blank"
          rel="noopener noreferrer"
        >by kavia.cloud</a>
      </footer>
    </aside>
  );
}
export default Sidebar;
