# Clean Code Onboarding Wizard

A professional 3-step customer onboarding wizard built with React, TypeScript, Zustand, and shadcn/ui components, following Uncle Bob's Clean Code principles.

## 🚀 Features

### Step 1: Welcome & User Info
- **Full Name** - Text input with validation
- **Email Address** - Email input with validation
- **Password** - Password input with security requirements
- **Industry** - Select dropdown with predefined options

### Step 2: Company Details
- **Company Name** - Text input with validation
- **Number of Employees** - Select dropdown with size ranges
- **Goals** - Textarea for detailed objectives
- **Subscribe to Updates** - Checkbox for newsletter subscription

### Step 3: Personalization
- **Vibe Selection** - Radio buttons for personality types:
  - 🔨 Builder - "I love creating and building things from scratch"
  - 💭 Dreamer - "I think big and imagine possibilities"
  - ⚡ Hacker - "I enjoy solving problems and finding solutions"
  - 🔮 Visionary - "I see the future and help others get there"
- **Favorite Color** - Color picker with preset options and custom color support

### Step 4: Summary & Completion
- **Review Information** - Displays all collected data organized by category
- **Success Dialog** - Celebration modal with completion confirmation
- **Action Options** - Get Started or Start Over buttons

## 🏗️ Architecture

### Clean Code Structure
```
src/
├── components/
│   ├── onboarding/
│   │   ├── WelcomeStep.tsx         # Step 1: User information
│   │   ├── CompanyStep.tsx         # Step 2: Company details
│   │   ├── PersonalizationStep.tsx # Step 3: Personalization
│   │   ├── Summary.tsx             # Step 4: Review & completion
│   │   ├── WizardLayout.tsx        # Main wizard orchestrator
│   │   └── OnboardingWizard.tsx    # Entry point component
│   └── ui/                         # shadcn/ui components
├── store/
│   └── useOnboardingStore.ts       # Zustand state management
├── lib/
│   ├── utils.ts                    # Utility functions
│   └── validationSchemas.ts        # Zod validation schemas
```

### Design Principles Applied

**Single Responsibility Principle (SRP)**
- Each component has one clear purpose
- Separate validation schemas for each step
- Dedicated store for state management

**Open/Closed Principle (OCP)**
- Steps can be extended without modifying existing code
- Validation schemas can be enhanced independently
- Store actions are composable

**Interface Segregation Principle (ISP)**
- Step-specific interfaces for clean contracts
- Focused component props
- Granular state update functions

**Dependency Inversion Principle (DIP)**
- Components depend on abstractions (store interface)
- Form validation depends on schema abstractions
- UI components are framework-agnostic

## 🎨 UI/UX Features

### Professional Design
- **Gradient Background** - Modern blue-to-indigo gradient
- **Progress Indicators** - Visual progress bar and step indicators
- **Smooth Transitions** - Subtle animations between steps
- **Responsive Layout** - Mobile-friendly design
- **Dark Mode Support** - Respects system theme preferences

### Accessibility
- **Keyboard Navigation** - Full keyboard support
- **Screen Reader Support** - Proper ARIA labels
- **Focus Management** - Logical tab order
- **Test IDs** - Comprehensive testing support

### Form Validation
- **Real-time Validation** - Immediate feedback
- **Custom Error Messages** - Clear, helpful error text
- **Schema-based Validation** - Consistent validation rules
- **Required Field Indicators** - Visual cues for mandatory fields

## 🔧 Technical Implementation

### State Management (Zustand)
```typescript
interface OnboardingState {
  currentStep: number;
  data: OnboardingData;
  isCompleted: boolean;
  
  // Step-specific update functions
  updateUserInfo: (info: Partial<UserInfo>) => void;
  updateCompanyDetails: (details: Partial<CompanyDetails>) => void;
  updatePersonalization: (personalization: Partial<Personalization>) => void;
  
  // Navigation functions
  nextStep: () => void;
  previousStep: () => void;
  setCurrentStep: (step: number) => void;
  
  // Completion functions
  completeOnboarding: () => void;
  resetOnboarding: () => void;
}
```

### Form Validation (Zod + React Hook Form)
```typescript
// Step-specific validation schemas
export const welcomeStepSchema = z.object({
  fullName: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(6).max(50),
  industry: z.string().min(1),
});
```

### Component Architecture
- **Controlled Components** - React Hook Form for form state
- **Type Safety** - Full TypeScript coverage
- **Error Boundaries** - Graceful error handling
- **Separation of Concerns** - Clear distinction between UI and logic

## 🚀 Getting Started

1. **Development Server**
   ```bash
   pnpm run dev
   ```

2. **Build for Production**
   ```bash
   pnpm run build
   ```

3. **Run Tests**
   ```bash
   pnpm run test
   ```

## 🧪 Testing

The wizard includes comprehensive test IDs for easy testing:
- `fullName-input`
- `email-input`
- `password-input`
- `industry-select`
- `companyName-input`
- `numberOfEmployees-select`
- `goals-textarea`
- `subscribeToUpdates-checkbox`
- `vibe-radio-group`
- `color-{colorValue}`
- `custom-color-input`
- `next-button`
- `previous-button`
- `complete-button`
- `step-{number}-indicator`

## 🎯 Key Benefits

1. **Maintainable Code** - Clean architecture with clear separation of concerns
2. **Type Safety** - Full TypeScript support prevents runtime errors
3. **Scalable Design** - Easy to add new steps or modify existing ones
4. **User Experience** - Smooth, intuitive flow with visual feedback
5. **Accessibility** - Meets WCAG guidelines for inclusive design
6. **Performance** - Optimized bundle size and efficient state management

## 📚 Technologies Used

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe JavaScript
- **Zustand** - Lightweight state management
- **Zod** - Schema validation
- **React Hook Form** - Performant form handling
- **shadcn/ui** - High-quality component library
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **Vite** - Fast build tool

This implementation demonstrates production-ready code that follows software engineering best practices while delivering an exceptional user experience. 