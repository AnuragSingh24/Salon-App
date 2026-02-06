import React, { createContext, useContext, useEffect, useState } from "react";

type Preferences = {
  theme: "light" | "dark" | "auto";
  currency: string;
  dateFormat: string;
  timeFormat: string;
};

type PreferencesContextType = {
  preferences: Preferences;
  setPreferences: React.Dispatch<React.SetStateAction<Preferences>>;
};

const PreferencesContext = createContext<PreferencesContextType | null>(null);

export const PreferencesProvider = ({ children }: { children: React.ReactNode }) => {
  const [preferences, setPreferences] = useState<Preferences>(() => {
    const saved = localStorage.getItem("preferences");
    return saved
      ? JSON.parse(saved)
      : {
          theme: "light",
          currency: "USD",
          dateFormat: "MM/DD/YYYY",
          timeFormat: "12h",
        };
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("preferences", JSON.stringify(preferences));
  }, [preferences]);

  // Apply theme globally
  useEffect(() => {
    const root = document.documentElement;

    if (preferences.theme === "dark") {
      root.classList.add("dark");
    } else if (preferences.theme === "light") {
      root.classList.remove("dark");
    } else if (preferences.theme === "auto") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      root.classList.toggle("dark", prefersDark);
    }
  }, [preferences.theme]);

  return (
    <PreferencesContext.Provider value={{ preferences, setPreferences }}>
      {children}
    </PreferencesContext.Provider>
  );
};

export const usePreferences = () => {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error("usePreferences must be used inside PreferencesProvider");
  }
  return context;
};
