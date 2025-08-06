import React, { useEffect, useState, useContext, useRef } from "react";
import { AuthContext } from "../App";
import { getNotes, getTags } from "../services/api";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiTag, FiPlus, FiEdit } from "react-icons/fi";
import "./NotesDashboard.css";

function NoteItem({ note, onEdit }) {
  return (
    <div className="note-item" onClick={() => onEdit(note)}>
      <div className="note-title-row">
        <div className="note-title">{note.title}</div>
        <div className="note-edit-btn" title="Edit"><FiEdit /></div>
      </div>
      <div className="note-body">{note.content.slice(0, 55)}{note.content.length > 55 ? "..." : ""}</div>
      <div className="note-tags">
        {Array.isArray(note.tags) && note.tags.map(t => (
          <span className="note-tag" key={t}>{t}</span>
        ))}
      </div>
    </div>
  );
}

export default function NotesDashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [tags, setTags] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [loading, setLoading] = useState(true);

  const token = window.localStorage.getItem("token");
  const isInitialMount = useRef(true);

  // Fetch notes and tags once
  useEffect(() => {
    setLoading(true);
    Promise.all([getNotes(token), getTags(token)]).then(([notesList, tagList]) => {
      setNotes(notesList || []);
      setTags(tagList || []);
      setLoading(false);
    });
  }, [token]);

  useEffect(() => {
    let arr = notes;
    if (search.trim()) {
      arr = arr.filter(
        n =>
          n.title.toLowerCase().includes(search.toLowerCase()) ||
          n.content.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (selectedTag) {
      arr = arr.filter(n => n.tags && n.tags.includes(selectedTag));
    }
    setFiltered(arr);
  }, [notes, search, selectedTag]);

  // When a new note is created and redirected, refetch (not optimal for perf but works for app of this size)
  useEffect(() => {
    // Listen for note changed events (if any)
    const reload = () => {
      setLoading(true);
      Promise.all([getNotes(token), getTags(token)]).then(([notesList, tagList]) => {
        setNotes(notesList || []);
        setTags(tagList || []);
        setLoading(false);
      });
    };
    window.addEventListener("refreshNotes", reload);
    return () => window.removeEventListener("refreshNotes", reload);
    // eslint-disable-next-line
  }, []);

  function handleEdit(selected) {
    navigate(`/note/edit/${selected._id || selected.id}`);
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="search-bar-wrap">
          <FiSearch />
          <input
            className="search-bar"
            type="search"
            placeholder="Search notes..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button className="btn-accent" onClick={() => navigate("/note/new")}>
          <FiPlus /> New Note
        </button>
      </div>

      <div className="tags-row">
        <button
          className={`tag-btn ${selectedTag === "" ? "active" : ""}`}
          onClick={() => setSelectedTag("")}
        >
          <FiTag /> All
        </button>
        {tags.map(t => (
          <button
            key={t}
            className={`tag-btn${selectedTag === t ? " active" : ""}`}
            onClick={() => setSelectedTag(t)}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="notes-list">
        {loading ? (
          <div className="notes-loading">Loading notes...</div>
        ) : filtered.length === 0 ? (
          <div className="notes-empty">
            <span>No notes found.</span>
          </div>
        ) : (
          filtered.map(n => (
            <NoteItem note={n} key={n._id || n.id} onEdit={handleEdit} />
          ))
        )}
      </div>
    </div>
  );
}
