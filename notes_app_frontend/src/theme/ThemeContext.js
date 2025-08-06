import React, { createContext, useContext } from "react";

const ThemeContext = createContext({
  theme: "light",
  setTheme: () => {},
});

// PUBLIC_INTERFACE
export const ThemeProvider = ({ theme, setTheme, children }) => {
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// PUBLIC_INTERFACE
export const useTheme = () => useContext(ThemeContext);
