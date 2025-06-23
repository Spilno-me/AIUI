# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AIUI is a full-stack application featuring an AI-assisted onboarding wizard. The frontend is built with React TypeScript and Vite, while the backend uses Python with WebSocket and MCP (Model Context Protocol) for real-time AI integration.

## Development Commands

### Package Manager
- Use `pnpm` for all package management operations
- Install dependencies: `pnpm install`
- Add packages: `pnpm add <package>` or `pnpm add -D <package>` for dev dependencies

### Frontend Development
- Start development server: `pnpm dev` (runs on port 5173)
- Build for production: `pnpm build`
- Preview production build: `pnpm preview`
- Run linting: `pnpm lint`

### Backend Development
- Start backend servers: `python backend/aiui_mcp_server.py`
- This runs both WebSocket server (port 8765) and MCP server concurrently
- Logs are stored in `~/.aiui_mcp/` directory

## Architecture

### Frontend Stack
- **Framework**: React 18 with TypeScript (strict mode)
- **Build Tool**: Vite 5 with Hot Module Replacement
- **Package Manager**: pnpm
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Styling**: Tailwind CSS v4 with CSS custom properties
- **State Management**: Zustand (`src/store/useOnboardingStore.ts`)
- **Form Handling**: React Hook Form + Zod validation
- **WebSocket**: Custom hook in `src/hooks/useWebSocket.ts`
- **Icons**: Lucide React

### Backend Stack
- **Language**: Python
- **WebSocket Server**: `backend/aiui_mcp/websocket_server.py` (port 8765)
- **MCP Server**: `backend/aiui_mcp/mcp_server.py` (AI suggestion tools)
- **Event Models**: Pydantic models in `backend/aiui_mcp/wizard_events.py`
- **Dependencies**: websockets, mcp, pydantic, python-dotenv, anyio

### Project Structure
```
src/
├── components/
│   ├── onboarding/          # Multi-step wizard components
│   └── ui/                  # shadcn/ui components
├── hooks/                   # Custom React hooks
├── store/                   # Zustand state management
├── lib/                     # Utilities and validation schemas
└── App.tsx                  # Main application component

backend/
├── aiui_mcp/               # Core backend modules
│   ├── mcp_server.py       # AI suggestion tools
│   ├── websocket_server.py # WebSocket handler
│   └── wizard_events.py    # Event data models
└── aiui_mcp_server.py      # Main server entry point
```

### Key Features

#### Onboarding Wizard
- 3-step progressive form with validation gates
- Steps: Welcome → Company → Summary
- Sequential unlocking (completed steps enable next step)
- Persistent state across navigation using Zustand
- Form validation with Zod schemas

#### AI Integration
- MCP tools for suggesting form field values:
  - `suggest_full_name`: Generate person names
  - `suggest_email`: Create email addresses
  - `suggest_industry`: Suggest industry types
  - `suggest_company_name`: Generate company names
  - `suggest_employee_count`: Suggest employee ranges
  - `suggest_goals`: Generate company goals
  - `suggest_subscription_preference`: Suggest subscription preferences
- WebSocket enables real-time bidirectional communication
- Event-driven architecture with typed event models

#### WebSocket Communication
- Frontend connects to `ws://localhost:8765`
- Connection status displayed in UI
- Automatic reconnection handling
- Event types: connection, form updates, AI suggestions

### Development Patterns

#### TypeScript Configuration
- Strict mode enabled with comprehensive type checking
- Path aliasing: `@/` maps to `src/`
- Module resolution set to "bundler" for Vite compatibility

#### Component Development
- Function components with hooks
- TypeScript interfaces for all props
- Consistent file naming: PascalCase for components
- Test IDs included for future testing

#### Styling Approach
- Tailwind CSS v4 with simplified configuration
- CSS custom properties for theming
- Glassmorphism design patterns
- Dark mode support via CSS variables
- Utility function `cn()` for className merging

### Important Notes

- **No test framework**: Currently no testing setup configured
- **Single client assumption**: Backend handles one WebSocket connection
- **Environment**: No `.env` file required for basic development
- **Python dependencies**: Install with `pip install -r backend/requirements.txt`