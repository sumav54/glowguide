# Kind Cosmetics 💄

[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

A high-performance, modern e-commerce storefront crafted for **Kind Cosmetics**. Built with speed, aesthetic elegance, and accessibility in mind, this web application delivers a seamless shopping experience across all screen sizes.

---

## ✨ Key Features & Highlights

* **🎨 Modern & Minimalist UI:** Designed with custom typography, intuitive spacing, and smooth animations to match luxury beauty branding.
* **📱 Fully Responsive:** Adaptive layout tailored for mobile devices, tablets, and desktop displays.
* **⚡ High Performance:** Optimized asset loading, lazy-loaded image containers, and fast client-side routing powered by Vite.
* **🛍️ Dynamic Product Catalog:** Fast category filtering, real-time search, and detailed product cards with visual state management.
* **🛒 Interactive Shopping Cart:** Responsive slide-over cart drawer with live subtotal updates and item management.
* **🔒 Type-Safe Architecture:** Full TypeScript implementation ensuring robust state handling and fewer runtime bugs.

---

## 🏗️ Project Architecture

```text
kind-cosmetics/
├── public/              # Static assets & favicon
├── src/
│   ├── assets/          # Images, logos, and custom icons
│   ├── components/      # Reusable UI components (Navbar, Footer, ProductCard, etc.)
│   ├── context/         # React Context for global state (Cart, User preferences)
│   ├── data/            # Mock dataset & cosmetic product collections
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Page views (Home, Shop, ProductDetails, Checkout)
│   ├── types/           # TypeScript type definitions and interfaces
│   ├── App.tsx          # Main application layout & routes
│   └── main.tsx         # Application entry point
├── package.json
├── tailwind.config.js   # Tailwind custom theme configuration
└── vite.config.ts       # Vite build setup

##🛠️ Tech Stack
Category	         Technology
Framework    	     React
Language	         TypeScript
Styling	Tailwind   CSS
Build System	     Vite
Icons	Lucide       React
Version Control	   Git

##🚀 Quick Start Guide
Prerequisites
Node.js (v18.0.0 or higher recommended)

npm or yarn package manager

1. Clone the Repository
Bash
git clone [https://github.com/sumav54/kind-cosmetics.git](https://github.com/sumav54/kind-cosmetics.git)
cd kind-cosmetics
2. Install Dependencies
Bash
npm install
3. Run Development Server
Bash
npm run dev
Open your browser at http://localhost:5173 to view the application live.

📜 Available Scripts
In the project directory, you can run:

npm run dev – Runs the app in development mode with Hot Module Replacement (HMR).

npm run build – Compiles TypeScript and builds the production bundle to the dist/ folder.

npm run preview – Locally previews the production build.

npm run lint – Runs ESLint to check for code quality and formatting issues.

