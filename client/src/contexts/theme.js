function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === "light") {
    root.classList.add("light");
    root.classList.remove("dark");
  } else {
    root.classList.add("dark");
    root.classList.remove("light");
  }
  localStorage.setItem("zp_theme", theme);
}
function getInitialTheme() {
  const saved = localStorage.getItem("zp_theme");
  return saved === "light" ? "light" : "dark";
}
export {
  applyTheme,
  getInitialTheme
};
