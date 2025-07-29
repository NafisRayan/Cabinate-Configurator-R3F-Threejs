# Tray Configurator

A powerful, customizable tray configuration tool built with React, Next.js, and Tailwind CSS. This project enables users to design, preview, and manage tray layouts with advanced UI controls and modular architecture.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Development](#development)
- [Project Structure](#project-structure)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- Interactive tray layout designer
- Modular component architecture
- Real-time preview and configuration
- Save/load tray designs
- Advanced UI controls (drawers, dialogs, tooltips, etc.)
- Responsive and accessible design
- TypeScript support

---

## Tech Stack

- **Framework:** Next.js
- **UI:** React, Tailwind CSS, Radix UI, Vaul (Drawer)
- **State Management:** React Context, Hooks
- **Other:** PostCSS, TypeScript

---

## Installation

> **Important:**  
> Due to peer dependency conflicts (e.g., `vaul` requires React 16-18, but this project uses React 19), you **must** use the legacy peer dependency flag when installing dependencies.

```bash
npm install --legacy-peer-deps
```

If you use `npm install` without `--legacy-peer-deps`, installation will fail due to incompatible peer dependencies.

---

## Usage

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app in your browser.

---

## Development

- Edit components in [`components/`](components/)
- API routes are in [`app/api/`](app/api/)
- Styles are in [`styles/`](styles/)
- Utility functions are in [`lib/`](lib/) and [`utils/`](utils/)
- Types are in [`types/`](types/)

### Scripts

- `npm run dev` – Start development server
- `npm run build` – Build for production
- `npm run start` – Start production server
- `npm run lint` – Lint codebase

---

## Project Structure

```
.
├── app/                # Next.js app directory
│   ├── api/            # API routes
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # App layout
│   └── page.tsx        # Main page
├── components/         # UI and logic components
│   └── ui/             # UI primitives (drawers, dialogs, etc.)
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries
├── public/             # Static assets
├── styles/             # Additional styles
├── types/              # TypeScript types
├── utils/              # Utility functions
├── package.json        # Project manifest
├── tailwind.config.ts  # Tailwind CSS config
├── tsconfig.json       # TypeScript config
└── README.md           # Project documentation
```

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

---

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes
4. Push to your fork and submit a pull request

---

## License

This project is licensed under the MIT License.