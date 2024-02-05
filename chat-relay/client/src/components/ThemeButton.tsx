import { useEffect, useState } from "react";

const ThemeButton = () => {
  const [darkTheme, setDarkTheme] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!mounted) {
      const localTheme = localStorage.getItem("theme");

      if (localTheme) {
        if (localTheme === "dark")
          document.documentElement.classList.add("dark");
        else document.documentElement.classList.remove("dark");

        setDarkTheme(localTheme === "dark");
      }

      setMounted(true);
    }
  }, []);

  function changeTheme() {
    localStorage.setItem("theme", `${!darkTheme ? "dark" : "light"}`);

    setDarkTheme(document.documentElement.classList.toggle("dark"));
  }

  return (
    <button
      className="p-2 rounded dark:bg-white dark:text-black bg-[#004449] text-[#09ebe3] mr-2"
      onClick={changeTheme}
    >
      {darkTheme ? "Dark" : "Light"}
    </button>
  );
};

export default ThemeButton;
