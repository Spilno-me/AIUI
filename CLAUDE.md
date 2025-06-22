# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AIUI is a full-stack application with a React TypeScript frontend and Python backend, designed for AI user interface components with WebSocket communication and MCP (Model Context Protocol) integration.

## Development Commands

### Frontend (React + TypeScript)
- **Package Manager**: `pnpm` (always use pnpm for this project)
- Install dependencies: `pnpm install`
- Start development server: `pnpm dev` (runs on port 5173)
- Build for production: `pnpm build`
- Preview production build: `pnpm preview`
- Run linting: `pnpm lint`

### Backend (Python)
```bash
cd backend
source venv/bin/activate  # Activate virtual environment (macOS/Linux)
# or: venv\Scripts\activate (Windows)

# Update dependencies
./update_dependencies.sh
# or manually:
pip install -r requirements.txt
pip install -r requirements-dev.txt

# Run services
python websocket_server.py  # WebSocket server on ws://localhost:8765
python aiui_mcp_server.py   # MCP server (stdio transport)
```

## Architecture

### Frontend Stack
- **Framework**: React 18 with TypeScript (strict mode)
- **Build Tool**: Vite 5
- **UI Components**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS v4 with CSS custom properties
- **State Management**: Zustand
- **Form Handling**: React Hook Form + Zod validation
- **Path Alias**: `@/` maps to `./src/`

### Backend Stack
- **Language**: Python 3.8+
- **WebSocket Server**: `websockets` library on port 8765
- **Data Models**: Pydantic for validation
- **MCP Integration**: FastMCP framework
- **Code Quality**: Black formatter, pylint

### Project Structure
```
/src/
├── components/
│   ├── onboarding/         # Multi-step wizard components
│   │   ├── OnboardingWizard.tsx
│   │   ├── WizardLayout.tsx
│   │   └── [Step Components]
│   └── ui/                 # shadcn/ui base components
├── hooks/
│   └── useWebSocket.ts     # WebSocket connection hook
├── lib/
│   ├── utils.ts            # cn() utility for classNames
│   └── validationSchemas.ts # Zod schemas
├── store/
│   └── useOnboardingStore.ts # Zustand store
└── App.tsx                 # Main app with WebSocket setup

/backend/
├── websocket_server.py     # WebSocket server
├── wizard_models.py        # Pydantic data models
├── aiui_mcp_server.py      # MCP server entry point
└── aiui_mcp/
    └── server.py           # FastMCP implementation
```

## Key Patterns & Conventions

### Frontend Patterns
- Function components with TypeScript interfaces for props
- Zod schemas for form validation with type inference
- Zustand store with action-based updates
- Custom hooks for reusable logic (e.g., WebSocket)
- shadcn/ui components in `src/components/ui/`
- Always use `cn()` from `@/lib/utils` for className merging

### Data Flow
1. Frontend maintains state in Zustand store
2. WebSocket connection established on app mount
3. Real-time bidirectional communication ready
4. Frontend validation with Zod, backend validation with Pydantic
5. Shared data models between frontend TypeScript and backend Python

### Component Development
- Look at existing components in `src/components/onboarding/` for patterns
- Use shadcn/ui components from `src/components/ui/`
- Follow the established form patterns with React Hook Form
- Maintain consistent styling with Tailwind classes and CSS variables

### WebSocket Communication
- Frontend uses custom `useWebSocket` hook
- Connection status displayed in UI
- Server handles messages at `ws://localhost:8765`
- Ready for real-time data synchronization

## Testing Status
Currently no testing framework is configured. When adding tests:
- Frontend: Consider Vitest (works well with Vite)
- Backend: Uncomment pytest dependencies in `requirements-dev.txt`