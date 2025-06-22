# AIUI Onboarding Wizard Data Model

This document describes the comprehensive data model used by the AIUI Onboarding Wizard, covering both backend Pydantic models and frontend TypeScript interfaces.

## Overview

The onboarding wizard implements a 4-step progressive form system that collects user information, company details, personalization preferences, and displays a summary. The data model ensures type safety and validation consistency between the Python backend and React TypeScript frontend.

## Backend Data Models (Pydantic)

### Core Enums

#### `Industry`
Represents business industry categories:
- `TECHNOLOGY`, `HEALTHCARE`, `FINANCE`, `EDUCATION`
- `MANUFACTURING`, `RETAIL`, `CONSULTING`, `MARKETING`
- `REAL_ESTATE`, `OTHER`

#### `EmployeeRange`
Company size categories:
- `1-10`, `11-50`, `51-200`, `201-500`, `501-1000`, `1000+`

#### `VibeType`
User personality types:
- `builder`: "I love creating and building things from scratch" 🔨
- `dreamer`: "I think big and imagine possibilities" 💭
- `hacker`: "I enjoy solving problems and finding solutions" ⚡
- `visionary`: "I see the future and help others get there" 🔮

### Form Field Models

The system uses a hierarchical form field structure with a base `FormField` class:

```python
class FormField(BaseModel):
    name: str
    label: str
    required: bool = True
    placeholder: Optional[str] = None
```

#### Specialized Field Types:
- **`TextFormField`**: Basic text input with length constraints
- **`EmailFormField`**: Email validation with EmailStr type
- **`PasswordFormField`**: Password with min/max length (6-50 chars)
- **`SelectFormField`**: Dropdown with predefined options
- **`TextAreaFormField`**: Multi-line text with configurable rows
- **`CheckboxFormField`**: Boolean field (typically optional)
- **`RadioGroupFormField`**: Single selection from multiple options with descriptions/emojis
- **`ColorPickerFormField`**: Hex color selection with preset options

### Step-Specific Form Models

#### 1. `WelcomeForm` - User Information
```python
class WelcomeForm(BaseModel):
    form_id: str = "welcome"
    title: str = "Let's get to know you! 👋"
    
    # Required fields
    full_name: str = Field(..., min_length=2, max_length=50)
    email: EmailStr = Field(...)
    password: str = Field(..., min_length=6, max_length=50)
    industry: Industry = Field(...)
```

**Validation Rules:**
- Full name: 2-50 characters, whitespace trimmed
- Email: Valid email format (Pydantic EmailStr)
- Password: 6-50 characters, required
- Industry: Must match Industry enum values

#### 2. `CompanyForm` - Business Details
```python
class CompanyForm(BaseModel):
    form_id: str = "company"
    title: str = "Tell us about your company 🏢"
    
    # Required fields
    company_name: str = Field(..., min_length=2, max_length=100)
    number_of_employees: EmployeeRange = Field(...)
    goals: str = Field(..., min_length=10, max_length=500)
    subscribe_to_updates: bool = Field(default=False)
```

**Validation Rules:**
- Company name: 2-100 characters, whitespace trimmed
- Employee count: Must match EmployeeRange enum
- Goals: 10-500 characters, required descriptive text
- Subscription: Boolean, defaults to false

#### 3. `PersonalizationForm` - User Preferences
```python
class PersonalizationForm(BaseModel):
    form_id: str = "personalization"
    title: str = "Let's personalize your experience ✨"
    
    # Required fields
    vibe: VibeType = Field(...)
    favorite_color: str = Field(..., regex=r"^#[0-9A-Fa-f]{6}$")
```

**Validation Rules:**
- Vibe: Must match VibeType enum (builder/dreamer/hacker/visionary)
- Favorite color: Valid hex color format (#RRGGBB)

#### 4. `SummaryForm` - Review Step
```python
class SummaryForm(BaseModel):
    form_id: str = "summary"
    title: str = "Welcome aboard! 🎉"
    read_only: bool = True
```

**Purpose:** Read-only display of collected data for user review.

### Main Wizard Model

#### `OnboardingWizard`
```python
class OnboardingWizard(BaseModel):
    wizard_id: str = "onboarding"
    title: str = "Welcome to AIUI"
    total_steps: int = 4
    allow_skip: bool = False
    allow_navigation: bool = True
    
    # State management
    current_step: int = Field(default=1, ge=1, le=4)
    completed_steps: set[int] = Field(default_factory=set)
    is_completed: bool = False
    data: dict = Field(default_factory=dict)
```

**Key Methods:**
- `get_current_form()`: Returns current step's form model
- `is_step_accessible(step)`: Checks if step can be accessed
- `mark_step_completed(step)`: Marks step as completed
- `can_proceed()`: Validates ability to advance

### Complete Data Model

#### `OnboardingWizardData`
Final aggregated data structure containing all collected information:

```python
class OnboardingWizardData(BaseModel):
    # Welcome step
    full_name: str
    email: EmailStr
    password: str
    industry: Industry
    
    # Company step
    company_name: str
    number_of_employees: EmployeeRange
    goals: str
    subscribe_to_updates: bool
    
    # Personalization step
    vibe: VibeType
    favorite_color: str
    
    # Metadata
    completed_at: Optional[str] = None
    wizard_version: str = "1.0"
```

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
  
  // Step 3: Personalization
  vibe: 'builder' | 'dreamer' | 'hacker' | 'visionary' | undefined;
  favoriteColor: string;
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

#### Personalization Step Schema
```typescript
const personalizationSchema = z.object({
  vibe: z.enum(['builder', 'dreamer', 'hacker', 'visionary']),
  favoriteColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Please select a valid color")
});
```

## Data Flow Architecture

### Step Progression Logic
1. **Progressive Accessibility**: Steps unlock sequentially as previous steps are completed
2. **State Persistence**: Form data persists across navigation using Zustand store
3. **Validation Gates**: Each step must pass validation before advancing
4. **Bidirectional Navigation**: Users can return to completed steps to modify data

### Frontend-Backend Mapping

| Frontend Field | Backend Field | Validation Alignment |
|---|---|---|
| `fullName` | `full_name` | ✅ Identical length constraints (2-50) |
| `email` | `email` | ✅ Both use email validation |
| `password` | `password` | ✅ Same length constraints (6-50) |
| `industry` | `industry` | ✅ String options match Industry enum |
| `companyName` | `company_name` | ✅ Same length constraints (2-100) |
| `numberOfEmployees` | `number_of_employees` | ✅ Options match EmployeeRange enum |
| `goals` | `goals` | ✅ Same length constraints (10-500) |
| `subscribeToUpdates` | `subscribe_to_updates` | ✅ Boolean type match |
| `vibe` | `vibe` | ✅ Union type matches VibeType enum |
| `favoriteColor` | `favorite_color` | ✅ Both validate hex format |

## WebSocket Communication

The system is prepared for real-time communication between frontend and backend:

- **Connection Management**: Custom React hook manages WebSocket lifecycle
- **Data Synchronization**: Ready for bidirectional state synchronization
- **Status Monitoring**: UI displays connection status to users

## Validation Strategy

### Dual-Layer Validation
1. **Frontend (Zod)**: Immediate user feedback and type safety
2. **Backend (Pydantic)**: Server-side validation and data integrity

### Consistency Guarantees
- Field requirements identical on both sides
- Length constraints match exactly
- Format validation (email, hex color) implemented identically
- Enum values synchronized between TypeScript unions and Python enums

## Form Field Configuration

The `FormFieldConfig` class provides UI rendering configuration:

```python
class FormFieldConfig(BaseModel):
    welcome_fields: list[FormField] = [...]    # Step 1 field definitions
    company_fields: list[FormField] = [...]    # Step 2 field definitions  
    personalization_fields: list[FormField] = [...]  # Step 3 field definitions
```

This configuration ensures consistent field rendering with proper labels, placeholders, validation rules, and UI component types across the entire wizard interface.

## Security Considerations

- **Password Handling**: Passwords validated but not stored in plain text
- **Email Validation**: Proper email format validation prevents injection
- **Input Sanitization**: All text fields trimmed and validated for length
- **Type Safety**: Strong typing prevents data corruption and injection attacks