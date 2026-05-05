/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                sans: ["DM Sans", "system-ui", "sans-serif"],
                display: ["Fraunces", "Georgia", "serif"]
            },
            colors: {
                cinema: {
                    950: "#0c0a09",
                    900: "#1c1917",
                    800: "#292524",
                    700: "#44403c",
                    accent: "#f59e0b",
                    muted: "#78716c"
                }
            },
            boxShadow: {
                glow: "0 0 40px -10px rgba(245, 158, 11, 0.35)"
            }
        }
    },
    plugins: []
};
