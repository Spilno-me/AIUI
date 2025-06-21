from enum import Enum
from typing import Literal, Optional
from pydantic import BaseModel, Field, field_validator, EmailStr


# Enums for constrained choices
class Industry(str, Enum):
    TECHNOLOGY = "Technology"
    HEALTHCARE = "Healthcare"
    FINANCE = "Finance"
    EDUCATION = "Education"
    MANUFACTURING = "Manufacturing"
    RETAIL = "Retail"
    CONSULTING = "Consulting"
    MARKETING = "Marketing"
    REAL_ESTATE = "Real Estate"
    OTHER = "Other"


class EmployeeRange(str, Enum):
    RANGE_1_10 = "1-10"
    RANGE_11_50 = "11-50"
    RANGE_51_200 = "51-200"
    RANGE_201_500 = "201-500"
    RANGE_501_1000 = "501-1000"
    RANGE_1000_PLUS = "1000+"


class VibeType(str, Enum):
    BUILDER = "builder"
    DREAMER = "dreamer"
    HACKER = "hacker"
    VISIONARY = "visionary"


# Form Field Models
class FormField(BaseModel):
    """Base model for form fields"""
    name: str
    label: str
    required: bool = True
    placeholder: Optional[str] = None


class TextFormField(FormField):
    """Text input field"""
    field_type: Literal["text"] = "text"
    min_length: Optional[int] = None
    max_length: Optional[int] = None
    default_value: str = ""


class EmailFormField(FormField):
    """Email input field"""
    field_type: Literal["email"] = "email"
    default_value: str = ""


class PasswordFormField(FormField):
    """Password input field"""
    field_type: Literal["password"] = "password"
    min_length: int = 6
    max_length: int = 50
    default_value: str = ""


class SelectFormField(FormField):
    """Select/dropdown field"""
    field_type: Literal["select"] = "select"
    options: list[str]
    default_value: Optional[str] = None


class TextAreaFormField(FormField):
    """Textarea field"""
    field_type: Literal["textarea"] = "textarea"
    min_length: Optional[int] = None
    max_length: Optional[int] = None
    rows: int = 4
    default_value: str = ""


class CheckboxFormField(FormField):
    """Checkbox field"""
    field_type: Literal["checkbox"] = "checkbox"
    default_value: bool = False
    required: bool = False  # Checkboxes are typically optional


class RadioGroupFormField(FormField):
    """Radio group field"""
    field_type: Literal["radio"] = "radio"
    options: list[dict[str, str]]  # Each option has value, label, description, emoji
    default_value: Optional[str] = None


class ColorPickerFormField(FormField):
    """Color picker field"""
    field_type: Literal["color"] = "color"
    preset_colors: list[str]
    default_value: str = "#3b82f6"


# Form Models (representing each step)
class WelcomeForm(BaseModel):
    """Step 1: Welcome & User Information"""
    form_id: str = "welcome"
    title: str = "Let's get to know you! 👋"
    description: str = "Welcome to our platform! We'd love to learn more about you to personalize your experience."
    
    # Form fields
    full_name: str = Field(
        ...,
        min_length=2,
        max_length=50,
        description="User's full name"
    )
    email: EmailStr = Field(
        ...,
        description="User's email address"
    )
    password: str = Field(
        ...,
        min_length=6,
        max_length=50,
        description="User's password"
    )
    industry: Industry = Field(
        ...,
        description="User's industry"
    )
    
    @field_validator('full_name')
    @classmethod
    def validate_full_name(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("Full name is required")
        return v
    
    @field_validator('password')
    @classmethod
    def validate_password(cls, v: str) -> str:
        if not v:
            raise ValueError("Password is required")
        return v


class CompanyForm(BaseModel):
    """Step 2: Company Details"""
    form_id: str = "company"
    title: str = "Tell us about your company 🏢"
    description: str = "Help us understand your business needs so we can tailor our platform for you."
    
    # Form fields
    company_name: str = Field(
        ...,
        min_length=2,
        max_length=100,
        description="Company name"
    )
    number_of_employees: EmployeeRange = Field(
        ...,
        description="Number of employees range"
    )
    goals: str = Field(
        ...,
        min_length=10,
        max_length=500,
        description="Company goals and objectives"
    )
    subscribe_to_updates: bool = Field(
        default=False,
        description="Subscribe to product updates and tips"
    )
    
    @field_validator('company_name', 'goals')
    @classmethod
    def validate_text_fields(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("This field is required")
        return v


class PersonalizationForm(BaseModel):
    """Step 3: Personalization"""
    form_id: str = "personalization"
    title: str = "Let's personalize your experience ✨"
    description: str = "Help us customize the platform to match your personality and preferences."
    
    # Form fields
    vibe: VibeType = Field(
        ...,
        description="User's personality type"
    )
    favorite_color: str = Field(
        ...,
        regex=r'^#[0-9A-Fa-f]{6}$',
        description="Favorite color in hex format"
    )
    
    @field_validator('favorite_color')
    @classmethod
    def validate_color(cls, v: str) -> str:
        if not v:
            raise ValueError("Please select a favorite color")
        # Ensure it's a valid hex color
        if not v.startswith('#') or len(v) != 7:
            raise ValueError("Color must be in hex format (#RRGGBB)")
        return v


class SummaryForm(BaseModel):
    """Step 4: Summary (read-only display of collected data)"""
    form_id: str = "summary"
    title: str = "Welcome aboard! 🎉"
    description: str = "Here's a summary of your profile. You can always update these details later in settings."
    
    # This form doesn't have input fields, it displays the collected data
    read_only: bool = True


# Main Wizard Model
class OnboardingWizard(BaseModel):
    """Main wizard model containing all forms and configuration"""
    wizard_id: str = "onboarding"
    title: str = "Welcome to AIUI"
    total_steps: int = 4
    allow_skip: bool = False
    allow_navigation: bool = True  # Can go back to previous steps
    
    # Forms in order
    forms: list[BaseModel] = [
        WelcomeForm,
        CompanyForm,
        PersonalizationForm,
        SummaryForm
    ]
    
    # Current state
    current_step: int = Field(default=1, ge=1, le=4)
    completed_steps: set[int] = Field(default_factory=set)
    is_completed: bool = False
    
    # Collected data
    data: dict = Field(default_factory=dict)
    
    def get_current_form(self) -> BaseModel:
        """Get the current form based on current_step"""
        return self.forms[self.current_step - 1]
    
    def is_step_accessible(self, step: int) -> bool:
        """Check if a step is accessible based on completed steps"""
        if step == 1:
            return True
        return (step - 1) in self.completed_steps
    
    def mark_step_completed(self, step: int) -> None:
        """Mark a step as completed"""
        self.completed_steps.add(step)
    
    def can_proceed(self) -> bool:
        """Check if can proceed to next step"""
        return self.current_step in self.completed_steps


# Form Field Configuration for UI rendering
class FormFieldConfig(BaseModel):
    """Configuration for rendering form fields in the UI"""
    welcome_fields: list[FormField] = [
        TextFormField(
            name="full_name",
            label="Full Name *",
            placeholder="Enter your full name",
            min_length=2,
            max_length=50
        ),
        EmailFormField(
            name="email",
            label="Email Address *",
            placeholder="Enter your email address"
        ),
        PasswordFormField(
            name="password",
            label="Password *",
            placeholder="Create a secure password"
        ),
        SelectFormField(
            name="industry",
            label="Industry *",
            placeholder="Select your industry",
            options=[e.value for e in Industry]
        )
    ]
    
    company_fields: list[FormField] = [
        TextFormField(
            name="company_name",
            label="Company Name *",
            placeholder="Enter your company name",
            min_length=2,
            max_length=100
        ),
        SelectFormField(
            name="number_of_employees",
            label="Number of Employees *",
            placeholder="Select company size",
            options=[e.value for e in EmployeeRange]
        ),
        TextAreaFormField(
            name="goals",
            label="What are your main goals? *",
            placeholder="Tell us about your objectives and what you hope to achieve...",
            min_length=10,
            max_length=500,
            rows=5
        ),
        CheckboxFormField(
            name="subscribe_to_updates",
            label="Subscribe to product updates and tips",
            required=False
        )
    ]
    
    personalization_fields: list[FormField] = [
        RadioGroupFormField(
            name="vibe",
            label="What's your vibe? *",
            options=[
                {
                    "value": "builder",
                    "label": "Builder",
                    "description": "I love creating and building things from scratch",
                    "emoji": "🔨"
                },
                {
                    "value": "dreamer",
                    "label": "Dreamer",
                    "description": "I think big and imagine possibilities",
                    "emoji": "💭"
                },
                {
                    "value": "hacker",
                    "label": "Hacker",
                    "description": "I enjoy solving problems and finding solutions",
                    "emoji": "⚡"
                },
                {
                    "value": "visionary",
                    "label": "Visionary",
                    "description": "I see the future and help others get there",
                    "emoji": "🔮"
                }
            ]
        ),
        ColorPickerFormField(
            name="favorite_color",
            label="Favorite Color *",
            preset_colors=[
                "#3b82f6",  # Blue
                "#10b981",  # Green
                "#f59e0b",  # Yellow
                "#ef4444",  # Red
                "#8b5cf6",  # Purple
                "#f97316",  # Orange
                "#06b6d4",  # Cyan
                "#84cc16"   # Lime
            ]
        )
    ]


# Complete Wizard Data Model (for API responses)
class OnboardingWizardData(BaseModel):
    """Complete data collected from the onboarding wizard"""
    # Welcome step data
    full_name: str
    email: EmailStr
    password: str
    industry: Industry
    
    # Company step data
    company_name: str
    number_of_employees: EmployeeRange
    goals: str
    subscribe_to_updates: bool
    
    # Personalization step data
    vibe: VibeType
    favorite_color: str
    
    # Metadata
    completed_at: Optional[str] = None
    wizard_version: str = "1.0"