/**
 * ALL API logic, including login/register, notes CRUD, tags, user.
 * Change BASE_URL to point to backend API (e.g. "/api" or full url in cloud).
 */
const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

function getHeaders(token, contentType="application/json") {
  return {
    "Content-Type": contentType,
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

function handleResponse(resp) {
  if (!resp.ok) {
    return resp.json().then(err => { throw err; });
  }
  return resp.json();
}

// PUBLIC_INTERFACE
export async function login(email, password) {
  const resp = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({email, password})
  });
  return handleResponse(resp);
}

// PUBLIC_INTERFACE
export async function register(username, email, password) {
  const resp = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({username, email, password})
  });
  return handleResponse(resp);
}

// PUBLIC_INTERFACE
export async function getMe(token) {
  const resp = await fetch(`${BASE_URL}/auth/me`, {
    headers: getHeaders(token)
  });
  if (resp.status === 401) return null;
  return handleResponse(resp);
}

// PUBLIC_INTERFACE
export async function getNotes(token) {
  const resp = await fetch(`${BASE_URL}/notes`, {
    headers: getHeaders(token)
  });
  return handleResponse(resp);
}

// PUBLIC_INTERFACE
export async function createNote(note, token) {
  const resp = await fetch(`${BASE_URL}/notes`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify(note)
  });
  return handleResponse(resp);
}

// PUBLIC_INTERFACE
export async function updateNote(noteId, note, token) {
  const resp = await fetch(`${BASE_URL}/notes/${noteId}`, {
    method: "PATCH",
    headers: getHeaders(token),
    body: JSON.stringify(note)
  });
  return handleResponse(resp);
}

// PUBLIC_INTERFACE
export async function deleteNote(noteId, token) {
  const resp = await fetch(`${BASE_URL}/notes/${noteId}`, {
    method: "DELETE",
    headers: getHeaders(token)
  });
  return handleResponse(resp);
}

// PUBLIC_INTERFACE
export async function getTags(token) {
  const resp = await fetch(`${BASE_URL}/tags`, {
    headers: getHeaders(token)
  });
  return handleResponse(resp);
}

// PUBLIC_INTERFACE
export async function createTag(tag, token) {
  const resp = await fetch(`${BASE_URL}/tags`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify({ name: tag })
  });
  return handleResponse(resp);
}
