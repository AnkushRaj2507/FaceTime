import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("streamify-theme") || "coffee",

  setTheme: (theme) => {
    localStorage.setItem("streamify-theme", theme);
    document.documentElement.setAttribute("data-theme", theme); // ✅ Apply immediately
    set({ theme });
  },
}));

// ✅ Ensure theme is applied on page load or refresh
const savedTheme = localStorage.getItem("streamify-theme") || "coffee";
document.documentElement.setAttribute("data-theme", savedTheme);
