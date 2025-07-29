# Tray Configurator

A comprehensive, production-grade tray configuration platform built with React, Next.js, and Tailwind CSS. This project empowers users to design, preview, and manage modular tray layouts for jewelry, electronics, or custom storage, with advanced UI, real-time feedback, and extensibility.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Installation](#installation)
- [Usage](#usage)
- [Development Workflow](#development-workflow)
- [Folder Structure](#folder-structure)
- [Key Components](#key-components)
- [API Endpoints](#api-endpoints)
- [Customization](#customization)
- [Troubleshooting](#troubleshooting)
- [FAQ](#faq)
- [Contributing](#contributing)
- [License](#license)

---

## Project Overview

Tray Configurator is a modular, extensible web application for designing and managing tray layouts. It supports a wide range of use cases, including jewelry trays, electronics organizers, and more. The app provides a drag-and-drop interface, real-time 3D previews, and persistent storage for user designs.

---

## Features

- **Interactive Designer:** Drag, drop, and resize modules within a tray grid.
- **3D Preview:** Real-time rendering of tray layouts using Three.js.
- **Modular Architecture:** Easily add new tray modules or materials.
- **Save/Load Designs:** Persist designs locally or via API.
- **Advanced UI:** Drawers, dialogs, tooltips, and context menus.
- **Responsive & Accessible:** Mobile-friendly and keyboard-accessible.
- **TypeScript:** Full type safety across the codebase.
- **Customizable Themes:** Tailwind CSS with custom tokens and dark mode.
- **API Integration:** RESTful endpoints for design CRUD operations.
- **Testing Ready:** Structure supports unit and integration tests.

---

## Tech Stack

| Technology                | Purpose/Usage                                                                 |
|---------------------------|-------------------------------------------------------------------------------|
| **React 19**              | Core UI library for building interactive user interfaces                      |
| **Next.js (App Router)**  | Framework for SSR, routing, API routes, and project structure                 |
| **TypeScript**            | Static typing for safer, more maintainable code                               |
| **Tailwind CSS**          | Utility-first CSS framework for rapid, consistent styling                     |
| **PostCSS**               | CSS processing pipeline for Tailwind and custom plugins                       |
| **Radix UI**              | Accessible, unstyled UI primitives (dialogs, popovers, etc.)                  |
| **Vaul**                  | Drawer component for overlays and side panels                                 |
| **Three.js**              | 3D rendering engine for tray visualization                                    |
| **@react-three/fiber**    | React renderer for Three.js, enables declarative 3D scenes                    |
| **React Context/Hooks**   | State management and reusable logic                                           |
| **ESLint**                | Linting and code quality enforcement                                          |
| **Jest/Testing Library**  | (If present) Unit and integration testing                                     |
| **Vercel/Netlify**        | (Optional) Deployment platforms for production                                |
| **Node.js 18+**           | Runtime environment for Next.js and build tools                               |

---

## Architecture

- **Component-Driven:** All UI is built from reusable, composable components.
- **Hooks:** Custom hooks for state, device detection, and toasts.
- **Context Providers:** For theme, tray state, and notifications.
- **API Layer:** Next.js API routes for CRUD operations.
- **Utilities:** Shared helpers for formatting, validation, and more.

---

## Installation

> **Important:**  
> Due to peer dependency conflicts (e.g., `vaul` requires React 16-18, but this project uses React 19), you **must** use the legacy peer dependency flag when installing dependencies.

```bash
npm install --legacy-peer-deps
```

If you use `npm install` without `--legacy-peer-deps`, installation will fail due to incompatible peer dependencies.

**Node.js 18+ is recommended.**

---

## Usage

Start the development server:

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

- `npm run dev` – Start development server
- `npm run build` – Build for production
- `npm run start` – Start production server
- `npm run lint` – Lint codebase

---

## Development Workflow

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/tray-configurator.git
   cd tray-configurator
   ```
2. **Install dependencies:**
   ```bash
   npm install --legacy-peer-deps
   ```
3. **Start developing:**
   ```bash
   npm run dev
   ```
4. **Edit components, hooks, or API routes as needed.**
5. **Run tests (if present):**
   ```bash
   npm test
   ```

---

## Folder Structure

```
.
├── app/                # Next.js app directory
│   ├── api/            # API routes (design CRUD)
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # App layout
│   └── page.tsx        # Main page
├── components/         # UI and logic components
│   └── ui/             # UI primitives (drawers, dialogs, etc.)
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries
├── public/             # Static assets (images, logos)
├── styles/             # Additional styles
├── types/              # TypeScript types
├── utils/              # Utility functions (design manager, materials)
├── package.json        # Project manifest
├── tailwind.config.ts  # Tailwind CSS config
├── tsconfig.json       # TypeScript config
└── README.md           # Project documentation
```

---

## Key Components

- [`components/enhanced-tray-configurator.tsx`](components/enhanced-tray-configurator.tsx): Main tray designer logic.
- [`components/ui/drawer.tsx`](components/ui/drawer.tsx): Drawer UI, using Vaul or Radix UI.
- [`components/module-panel.tsx`](components/module-panel.tsx): Module selection and configuration.
- [`components/material-panel.tsx`](components/material-panel.tsx): Material selection.
- [`components/tray-scene.tsx`](components/tray-scene.tsx): 3D tray rendering.
- [`components/save-load-panel.tsx`](components/save-load-panel.tsx): Save/load design UI.
- [`hooks/use-toast.ts`](hooks/use-toast.ts): Toast notification logic.
- [`lib/utils.ts`](lib/utils.ts): Utility functions.
- [`app/api/designs/`](app/api/designs/): RESTful API endpoints for design CRUD.

---

## API Endpoints

- `GET /api/designs` – List all saved designs.
- `POST /api/designs` – Save a new design.
- `GET /api/designs/[code]` – Get a specific design by code.
- `DELETE /api/designs/[code]` – Delete a design.

API routes are implemented in [`app/api/designs/`](app/api/designs/).

---

## Customization

- **Adding Modules:**  
  Add new module types in [`types/tray-types.ts`](types/tray-types.ts) and implement their logic in `components/`.
- **Styling:**  
  Modify [`tailwind.config.ts`](tailwind.config.ts) and [`styles/globals.css`](styles/globals.css).
- **Drawer Implementation:**  
  To switch from Vaul to Radix UI, update [`components/ui/drawer.tsx`](components/ui/drawer.tsx) and replace all `vaul` imports.

---

## Troubleshooting

### Dependency Conflicts

- If you see errors about peer dependencies (especially with `vaul` and React), always use:

  ```bash
  npm install --legacy-peer-deps
  ```

- Do **not** use plain `npm install` unless all dependencies are compatible.

### Common Issues

- **Drawer not working:**  
  Ensure you are using the correct drawer implementation. The project uses Vaul and/or Radix UI for drawers. If you replace Vaul, update all imports in `components/ui/drawer.tsx`.

- **Build errors:**  
  Check your Node.js and npm versions. Use Node.js 18+ for best compatibility.

- **3D rendering issues:**  
  Make sure your browser supports WebGL and hardware acceleration is enabled.

---

## FAQ

**Q: Why do I need to use `--legacy-peer-deps`?**  
A: Some dependencies (like `vaul`) do not yet support React 19, but other packages require React 19. The flag bypasses peer dependency checks.

**Q: How do I add a new tray module?**  
A: Update [`types/tray-types.ts`](types/tray-types.ts) with the new module type, then add its logic and UI in `components/`.

**Q: Can I use this for non-jewelry trays?**  
A: Yes! The architecture is flexible for any modular tray or grid-based layout.

**Q: How do I deploy this project?**  
A: Build with `npm run build` and deploy the `.next` output to Vercel, Netlify, or any Node.js-compatible host.

---

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes
4. Push to your fork and submit a pull request

Please follow the code style and write clear commit messages.

---

## License

This project is licensed under the MIT License.