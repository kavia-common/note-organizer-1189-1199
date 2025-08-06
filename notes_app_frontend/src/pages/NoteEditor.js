import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getNotes, getTags, createNote, updateNote, deleteNote, createTag } from "../services/api";
import "./NoteEditor.css";

export default function NoteEditor() {
  const { noteId } = useParams();
  const navigate = useNavigate();
  const token = window.localStorage.getItem("token");

  const [mode, setMode] = useState(noteId ? "edit" : "create");
  const [note, setNote] = useState({ title: "", content: "", tags: [] });
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTags(token).then(ts => setTags(ts || []));
    if (noteId) {
      setMode("edit");
      getNotes(token).then(notes => {
        const found = (notes || []).find(n => (n._id || n.id) === noteId);
        if (found) {
          setNote({ ...found, tags: found.tags || [] });
        } else {
          setErr("Note not found.");
        }
        setLoading(false);
      });
    } else {
      setLoading(false);
      setMode("create");
    }
    // eslint-disable-next-line
  }, [noteId, token]);

  function handleInput(e) {
    setNote({ ...note, [e.target.name]: e.target.value });
  }
  function handleTagSelect(t) {
    setNote({ ...note, tags: note.tags.includes(t) ? note.tags : [...note.tags, t] });
  }
  function handleTagRemove(t) {
    setNote({ ...note, tags: note.tags.filter(tag => tag !== t) });
  }
  async function handleAddTag(e) {
    e.preventDefault();
    if (!tagInput.trim() || tagInput.length > 24) return;
    if (tags.includes(tagInput)) {
      handleTagSelect(tagInput);
      setTagInput("");
      return;
    }
    try {
      await createTag(tagInput, token);
      setTags(tg => ([...tg, tagInput]));
      setNote(n => ({ ...n, tags: [...n.tags, tagInput] }));
      setTagInput("");
    } catch {}
  }
  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setErr("");
    try {
      if (mode === "edit") {
        await updateNote(noteId, note, token);
      } else {
        await createNote(note, token);
      }
      // Fire global event for dashboard to reload
      window.dispatchEvent(new Event("refreshNotes"));
      navigate("/", {replace:true});
    } catch (ex) {
      setErr(ex?.message || "Failed to save note.");
    } finally {
      setSaving(false);
    }
  }
  async function handleDelete() {
    if (!window.confirm("Delete this note? This cannot be undone.")) return;
    setSaving(true);
    try {
      await deleteNote(noteId, token);
      window.dispatchEvent(new Event("refreshNotes"));
      navigate("/", {replace:true});
    } catch {
      alert("Failed to delete note.");
    }
    setSaving(false);
  }

  if (loading) return <div className="editor-container">Loading...</div>;
  if (err) return <div className="editor-container error">{err}</div>;

  return (
    <div className="editor-container">
      <form className="note-form" onSubmit={handleSubmit}>
        <h2>{mode === "edit" ? "Edit Note" : "New Note"}</h2>
        <label>Title</label>
        <input
          name="title"
          required
          maxLength={80}
          value={note.title}
          onChange={handleInput}
          disabled={saving}
        />
        <label>Content</label>
        <textarea
          name="content"
          required
          rows={10}
          value={note.content}
          onChange={handleInput}
          disabled={saving}
          style={{resize: "vertical"}}
        />
        <label>Tags</label>
        <div className="tags-box">
          {Array.isArray(note.tags) && note.tags.map(t => (
            <span className="editor-tag" key={t}>
              {t}{" "}
              <button
                className="tag-remove-btn"
                type="button"
                onClick={() => handleTagRemove(t)}
                tabIndex={-1}
                aria-label={`Remove ${t}`}
              >
                ×
              </button>
            </span>
          ))}
          {tags.filter(
            t => !note.tags.includes(t)
          ).map(t => (
            <button
              type="button"
              key={t}
              className="tag-add-btn"
              onClick={() => handleTagSelect(t)}
            >
              {t}
            </button>
          ))}
          <form onSubmit={handleAddTag} style={{ display: "inline" }}>
            <input
              className="tag-input"
              placeholder="Add tag"
              maxLength={24}
              value={tagInput}
              disabled={saving}
              onChange={e => setTagInput(e.target.value)}
              style={{ width: 86 }}
            />
          </form>
        </div>
        {err && <div className="editor-error">{err}</div>}
        <div className="editor-actions">
          <button className="btn-primary" type="submit" disabled={saving}>
            {saving ? (mode === "edit" ? "Saving..." : "Adding...") : (mode === "edit" ? "Save" : "Add")}
          </button>
          {mode === "edit" && (
            <button
              className="btn-danger"
              type="button"
              onClick={handleDelete}
              disabled={saving}
            >
              Delete
            </button>
          )}
          <button
            className="btn-plain"
            type="button"
            onClick={() => navigate("/")}
            disabled={saving}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
