// import React, { useState, useEffect } from "react";

// const ThemeToggle = () => {
//   const [isDarkMode, setIsDarkMode] = useState(false);

//   // Toggle between dark and light mode
//   const toggleTheme = () => {
//     setIsDarkMode((prevMode) => {
//       const newMode = !prevMode;
//       if (newMode) {
//         document.documentElement.classList.add("dark");
//         localStorage.setItem("theme", "dark");
//       } else {
//         document.documentElement.classList.remove("dark");
//         localStorage.setItem("theme", "light");
//       }
//       return newMode;
//     });
//   };

//   // Persist the theme preference in localStorage
//   useEffect(() => {
//     const savedTheme = localStorage.getItem("theme");
//     if (savedTheme === "dark") {
//       setIsDarkMode(true);
//       document.documentElement.classList.add("dark");
//     } else {
//       setIsDarkMode(false);
//       document.documentElement.classList.remove("dark");
//     }
//   }, []);

//   return (
//     <button
//       onClick={toggleTheme}
//       className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//     >
//       {/* Icon for Dark Mode */}
//       {isDarkMode ? (
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           className="h-6 w-6 text-gray-800 dark:text-white"
//           fill="none"
//           viewBox="0 0 24 24"
//           stroke="currentColor"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
//           />
//         </svg>
//       ) : (
//         // Icon for Light Mode
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           className="h-6 w-6 text-gray-800 dark:text-white"
//           fill="none"
//           viewBox="0 0 24 24"
//           stroke="currentColor"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
//           />
//         </svg>
//       )}
//     </button>
//   );
// };

// export default ThemeToggle;
