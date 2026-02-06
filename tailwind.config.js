/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            animation: {
                blob: "blob 20s infinite",
            },
            keyframes: {
                blob: {
                    "0%, 100%": {
                        transform: "translate(0, 0) scale(1)",
                    },
                    "25%": {
                        transform: "translate(20px, -50px) scale(1.1)",
                    },
                    "50%": {
                        transform: "translate(-20px, 20px) scale(0.9)",
                    },
                    "75%": {
                        transform: "translate(50px, 50px) scale(1.05)",
                    },
                },
            },
        },
    },
    plugins: [],
}
