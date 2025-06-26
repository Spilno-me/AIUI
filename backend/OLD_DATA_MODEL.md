# AIUI Onboarding Wizard Data Model

This document describes the frontend data model used by the AIUI Onboarding Wizard React TypeScript components.

## Overview

The onboarding wizard implements a 3-step progressive form system that collects user information, company details, and displays a summary. The data model ensures type safety and validation consistency across the React TypeScript frontend.

## Frontend Data Models (TypeScript)

### State Management (Zustand Store)

```typescript
interface OnboardingData {
  // Step 1: Welcome & User Info
  fullName: string;
  email: string;
  password: string;
  industry: string;
  
  // Step 2: Company Details
  companyName: string;
  numberOfEmployees: string;
  goals: string;
  subscribeToUpdates: boolean;
}
```

### Validation Schemas (Zod)

The frontend uses Zod schemas that mirror backend validation:

#### Welcome Step Schema
```typescript
const welcomeSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters").max(50),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6).max(50),
  industry: z.string().min(1, "Please select an industry")
});
```

#### Company Step Schema
```typescript
const companySchema = z.object({
  companyName: z.string().min(2).max(100),
  numberOfEmployees: z.string().min(1, "Please select company size"),
  goals: z.string().min(10, "Please provide at least 10 characters").max(500),
  subscribeToUpdates: z.boolean()
});
```


## Data Flow Architecture

### Step Progression Logic
1. **Progressive Accessibility**: Steps unlock sequentially as previous steps are completed
2. **State Persistence**: Form data persists across navigation using Zustand store
3. **Validation Gates**: Each step must pass validation before advancing
4. **Bidirectional Navigation**: Users can return to completed steps to modify data

## WebSocket Communication

The system uses WebSocket for real-time communication:

- **Connection Management**: Custom React hook manages WebSocket lifecycle
- **Data Synchronization**: Ready for bidirectional state synchronization
- **Status Monitoring**: UI displays connection status to users

## Validation Strategy

Frontend validation using Zod provides immediate user feedback and type safety:

- Field requirements with proper error messages
- Length constraints for text fields
- Format validation (email, hex color)
- Type-safe enum validation

## Security Considerations

- **Input Sanitization**: All text fields trimmed and validated for length
- **Type Safety**: Strong typing prevents data corruption
- **Client-side Validation**: Immediate feedback prevents invalid submissions