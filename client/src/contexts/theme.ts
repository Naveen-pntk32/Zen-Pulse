export type Theme = 'dark' | 'light';

export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === 'light') root.classList.add('light');
  else root.classList.remove('light');
  localStorage.setItem('zp_theme', theme);
}

export function getInitialTheme(): Theme {
  const saved = localStorage.getItem('zp_theme');
  return saved === 'light' ? 'light' : 'dark';
}
