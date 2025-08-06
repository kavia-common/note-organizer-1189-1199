import React, { useState, useEffect, useMemo, createContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotesDashboard from "./pages/NotesDashboard";
import NoteEditor from "./pages/NoteEditor";
import { ThemeProvider } from "./theme/ThemeContext";
import "./App.css";
import "./theme/theme.css";
import { getMe } from "./services/api";
import LoadingOverlay from "./components/LoadingOverlay";

// Context to share user info and authentication across the app
export const AuthContext = createContext();

// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState(() => window.localStorage.getItem("theme") || "light");
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    // If token exists, try to get user profile
    const token = window.localStorage.getItem("token");
    if (token) {
      setLoadingUser(true);
      getMe(token)
        .then((profile) => {
          setUser(profile || null);
        })
        .catch(() => setUser(null))
        .finally(() => setLoadingUser(false));
    } else {
      setLoadingUser(false);
    }
  }, []);

  const authContextValue = useMemo(
    () => ({
      user,
      setUser,
      setTheme,
      theme,
      logout: () => {
        setUser(null);
        window.localStorage.removeItem("token");
      },
    }),
    [user, setUser, setTheme, theme]
  );

  if (loadingUser) {
    return <LoadingOverlay/>;
  }

  return (
    <ThemeProvider theme={theme} setTheme={setTheme}>
      <AuthContext.Provider value={authContextValue}>
        <Router>
          {user ? (
            <div className="app-layout">
              <Sidebar />
              <div className="main-content">
                <Header />
                <Routes>
                  <Route path="/" element={<NotesDashboard />} />
                  <Route path="/note/new" element={<NoteEditor />} />
                  <Route path="/note/edit/:noteId" element={<NoteEditor />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </div>
            </div>
          ) : (
            <div className="auth-bg">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="*" element={<Navigate to="/login" />} />
              </Routes>
            </div>
          )}
        </Router>
      </AuthContext.Provider>
    </ThemeProvider>
  );
}

export default App;
