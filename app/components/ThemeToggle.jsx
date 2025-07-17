import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("my-theme");
    if (saved === "dark") {
      setDark(true);
      document.body.classList.add("my-dark");
    } else {
      setDark(false);
      document.body.classList.remove("my-dark");
    }
  }, []);

  const toggleTheme = () => {
    if (dark) {
      document.body.classList.remove("my-dark");
      localStorage.setItem("my-theme", "light");
      setDark(false);
    } else {
      document.body.classList.add("my-dark");
      localStorage.setItem("my-theme", "dark");
      setDark(true);
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className={`p-[8px] ${dark ? "text-[#fff]" : "text-[#222]"}`}
    >
      {dark ? "🌙" : "🌞"}
    </button>
  );
}
