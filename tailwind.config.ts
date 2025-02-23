import type { Config } from 'tailwindcss';

export default {
  content: ['./pages/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}', './app/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: 'var(--color_primary)',
        secondary: 'var(--color_secondary)',
      },
      fontFamily: {
        fira: 'var(--font-fira)',
        space: 'var(--font-space)',
        sue: 'var(--font-sue)',
      },
    },
  },
  plugins: [],
} satisfies Config;
