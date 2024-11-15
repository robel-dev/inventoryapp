/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#111827',    // dark gray
        secondary: '#1f2937',  // slightly lighter gray
        accent: '#3b82f6',     // blue
        background: '#0a0a0a', // near black
        foreground: '#ededed', // near white
        'nav-bg': '#111827',   // dark gray for navbar
        'sidebar-bg': '#111827', // dark gray for sidebar
        'hover-bg': '#374151',  // hover state
      },
      backgroundColor: {
        dark: '#0a0a0a',
        'dark-nav': '#111827',
        'dark-sidebar': '#111827',
      },
      textColor: {
        dark: '#ededed',
      },
    },
  },
  plugins: [],
};
