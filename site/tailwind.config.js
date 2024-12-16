/** @type {import('tailwindcss').Config} */
export default {
   content: [
      './index.html',
      './src/**/*.{vue,js,ts}'
   ],
   theme: {
      extend: {},
   },
   plugins: [
      require('daisyui')
   ],
   daisyui: {
      themes: [
         'light',
         'dark',
         'dracula',
         {
            custom: {
               ...require("daisyui/src/theming/themes")["dracula"],
               "primary": "#7480ff",
               "secondary": "#ff52d9",
               "accent": "#00cdb8",
               "info": "#00b5ff",
               "success": "#00a96e",
               "warning": "#ffbe00",
               "error": "#ff5861",
               "neutral": "#2a323c",
               "base-100": "#1d232a",
               "base-200": "#191e24",
               "base-300": "#15191e",
               "primary-content": "#050617",
               "secondary-content": "#190211",
               "accent-content": "#000f0c",
               "info-content": "#000000",
               "success-content": "#000000",
               "warning-content": "#000000",
               "error-content": "#000000",
               "neutral-content": "#a6adbb",
            }
         }
      ]
   }
}