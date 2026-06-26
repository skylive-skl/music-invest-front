import { create } from "zustand";

export type Theme = "light" | "dark";

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const updateThemeDOM = (theme: Theme) => {
  if (typeof document === "undefined") return;
  
  const isDark = theme === "dark";
  if (isDark) {
    document.documentElement.classList.add("dark");
    document.documentElement.style.colorScheme = "dark";
  } else {
    document.documentElement.classList.remove("dark");
    document.documentElement.style.colorScheme = "light";
  }
  
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute("content", isDark ? "#0a0a0f" : "#f8f9fa");
  }
};

export const useThemeStore = create<ThemeState>((set) => {
  const getInitialTheme = (): Theme => {
    if (typeof window === "undefined") return "light";
    const savedTheme = localStorage.getItem("theme") as Theme;
    if (savedTheme === "light" || savedTheme === "dark") {
      return savedTheme;
    }
    return "light";
  };

  const initialTheme = getInitialTheme();

  // Apply initial theme classes and properties to the document element
  updateThemeDOM(initialTheme);

  return {
    theme: initialTheme,
    setTheme: (theme) => {
      localStorage.setItem("theme", theme);
      updateThemeDOM(theme);
      set({ theme });
    },
    toggleTheme: () => {
      set((state) => {
        const nextTheme = state.theme === "dark" ? "light" : "dark";
        localStorage.setItem("theme", nextTheme);
        updateThemeDOM(nextTheme);
        return { theme: nextTheme };
      });
    },
  };
});
