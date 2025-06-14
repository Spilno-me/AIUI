# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AIUI is a React TypeScript application built with Vite. This is a modern web application focused on AI user interface components and interactions.

## Development Commands

### Package Manager
- Use `pnpm` for all package management operations
- Install dependencies: `pnpm install`
- Add packages: `pnpm add <package>` or `pnpm add -D <package>` for dev dependencies

### Development Server
- Start development server: `pnpm dev`
- Runs on port 5173 by default (Vite default)

### Build and Production
- Build for production: `pnpm build`
- Preview production build: `pnpm preview`
- TypeScript compilation and Vite build are run together

### Code Quality
- Run linting: `pnpm lint`
- ESLint configuration includes TypeScript and React rules
- Configured with React Refresh for hot module replacement

## Architecture

### Technology Stack
- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite 5
- **Package Manager**: pnpm
- **Linting**: ESLint with TypeScript and React plugins
- **Styling**: CSS modules (standard React patterns)

### Project Structure
```
src/
├── assets/          # Static assets (images, icons)
├── App.tsx         # Main application component
├── App.css         # Application styles
├── main.tsx        # Application entry point
└── index.css       # Global styles

public/             # Public static files
├── vite.svg        # Vite logo
```

### Key Configuration Files
- `vite.config.ts` - Vite build configuration with React plugin
- `tsconfig.json` - TypeScript compiler options (strict mode enabled)
- `tsconfig.node.json` - Node-specific TypeScript config for build tools
- `.eslintrc.cjs` - ESLint configuration with React and TypeScript rules

## Development Patterns

### TypeScript Configuration
- Strict mode enabled with comprehensive type checking
- Module resolution set to "bundler" for Vite compatibility
- JSX transform set to "react-jsx" (modern React)
- No unused locals/parameters warnings enabled

### React Patterns
- Function components with hooks
- React 18 StrictMode enabled in development
- Modern JSX transform (no React import needed)
- Hot Module Replacement configured via Vite

### Styling Approach
- CSS modules and standard CSS files
- CSS custom properties for theming
- Responsive design considerations
- Light/dark mode support in base styles