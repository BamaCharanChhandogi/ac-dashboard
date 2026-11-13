import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext({
  theme: 'light',
  isDark: false,
  setTheme: () => {},
  toggleTheme: () => {},
});

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    try {
      const saved = localStorage.getItem('chanykya_theme');
      if (saved === 'dark' || saved === 'light' || saved === 'system') return saved;
      if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    } catch {
      // ignore
    }
    return 'light';
  });

  const [isDark, setIsDark] = useState(() => {
    try {
      const saved = localStorage.getItem('chanykya_theme');
      if (saved === 'dark') return true;
      if (saved === 'light') return false;
      if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return true;
      }
    } catch {
      // ignore
    }
    return false;
  });

  const applyThemeClasses = (darkActive) => {
    const root = document.documentElement;
    if (darkActive) {
      root.classList.add('dark');
      document.body?.classList.add('dark');
    } else {
      root.classList.remove('dark');
      document.body?.classList.remove('dark');
    }
  };

  useEffect(() => {
    let activeDark = false;
    if (theme === 'dark') {
      activeDark = true;
    } else if (theme === 'system') {
      activeDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    } else {
      activeDark = false;
    }

    setIsDark(activeDark);
    applyThemeClasses(activeDark);

    try {
      localStorage.setItem('chanykya_theme', theme);
    } catch {
      // ignore
    }

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = (e) => {
        setIsDark(e.matches);
        applyThemeClasses(e.matches);
      };
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, [theme]);

  // Cool Telegram-Style View Transition API Theme Switcher
  const setTheme = (newTheme, e) => {
    if (newTheme === theme) return;

    // Check if View Transition API is supported and user doesn't prefer reduced motion
    const isSupported =
      typeof document !== 'undefined' &&
      Boolean(document.startViewTransition) &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!isSupported) {
      setThemeState(newTheme);
      return;
    }

    // Origin of ripple (button click position or fallback to center)
    const x = e?.clientX ?? (typeof window !== 'undefined' ? window.innerWidth / 2 : 0);
    const y = e?.clientY ?? (typeof window !== 'undefined' ? window.innerHeight / 2 : 0);
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const transition = document.startViewTransition(() => {
      let activeDark = false;
      if (newTheme === 'dark') {
        activeDark = true;
      } else if (newTheme === 'system') {
        activeDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      } else {
        activeDark = false;
      }

      applyThemeClasses(activeDark);
      setIsDark(activeDark);
      setThemeState(newTheme);
    });

    transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`,
      ];
      document.documentElement.animate(
        {
          clipPath: clipPath,
        },
        {
          duration: 500,
          easing: 'ease-in-out',
          pseudoElement: '::view-transition-new(root)',
        }
      );
    });
  };

  const toggleTheme = (e) => {
    setTheme(isDark ? 'light' : 'dark', e);
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
