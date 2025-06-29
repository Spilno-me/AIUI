"""
Pydantic event models for AI-suggested wizard field values.

These events are designed to be emitted by an external AI via MCP tools
and then pushed to the UI via WebSocket for field-by-field guidance.
"""

from enum import Enum
from typing import Literal, Optional
from pydantic import BaseModel, Field


class WizardStep(str, Enum):
    """Enum for wizard steps"""

    WELCOME = "welcome"
    COMPANY = "company"


class IndustryType(str, Enum):
    """Enum for industry options"""

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


class EmployeeRangeType(str, Enum):
    """Enum for employee count ranges"""

    RANGE_1_10 = "1-10"
    RANGE_11_50 = "11-50"
    RANGE_51_200 = "51-200"
    RANGE_201_500 = "201-500"
    RANGE_501_1000 = "501-1000"
    RANGE_1000_PLUS = "1000+"


# Base event model
class BaseSuggestionEvent(BaseModel):
    """Base model for all suggestion events"""

    event_type: str = Field(..., description="Type of suggestion event")
    step: WizardStep = Field(..., description="Which wizard step this suggestion is for")
    field_name: str = Field(..., description="Name of the field being suggested")
    suggestion: str = Field(..., description="The AI's suggested value")
    reasoning: str = Field(..., description="Reasoning for the suggestion")


# Welcome Step Events
class FullNameSuggestionEvent(BaseSuggestionEvent):
    """Event for suggesting full name"""

    event_type: Literal["full_name_suggestion"] = "full_name_suggestion"
    step: Literal[WizardStep.WELCOME] = WizardStep.WELCOME
    field_name: Literal["fullName"] = "fullName"
    suggestion: str = Field(..., min_length=2, max_length=50, description="Suggested full name")


class EmailSuggestionEvent(BaseSuggestionEvent):
    """Event for suggesting email address"""

    event_type: Literal["email_suggestion"] = "email_suggestion"
    step: Literal[WizardStep.WELCOME] = WizardStep.WELCOME
    field_name: Literal["email"] = "email"
    suggestion: str = Field(..., description="Suggested email address")


class IndustrySuggestionEvent(BaseSuggestionEvent):
    """Event for suggesting industry"""

    event_type: Literal["industry_suggestion"] = "industry_suggestion"
    step: Literal[WizardStep.WELCOME] = WizardStep.WELCOME
    field_name: Literal["industry"] = "industry"
    suggestion: IndustryType = Field(..., description="Suggested industry")


# Company Step Events
class CompanyNameSuggestionEvent(BaseSuggestionEvent):
    """Event for suggesting company name"""

    event_type: Literal["company_name_suggestion"] = "company_name_suggestion"
    step: Literal[WizardStep.COMPANY] = WizardStep.COMPANY
    field_name: Literal["companyName"] = "companyName"
    suggestion: str = Field(..., min_length=2, max_length=100, description="Suggested company name")


class NumberOfEmployeesSuggestionEvent(BaseSuggestionEvent):
    """Event for suggesting number of employees"""

    event_type: Literal["number_of_employees_suggestion"] = "number_of_employees_suggestion"
    step: Literal[WizardStep.COMPANY] = WizardStep.COMPANY
    field_name: Literal["numberOfEmployees"] = "numberOfEmployees"
    suggestion: EmployeeRangeType = Field(..., description="Suggested employee count range")


class GoalsSuggestionEvent(BaseSuggestionEvent):
    """Event for suggesting goals"""

    event_type: Literal["goals_suggestion"] = "goals_suggestion"
    step: Literal[WizardStep.COMPANY] = WizardStep.COMPANY
    field_name: Literal["goals"] = "goals"
    suggestion: str = Field(..., min_length=10, max_length=500, description="Suggested goals description")


# Union type for all suggestion events
SuggestionEvent = (
    FullNameSuggestionEvent
    | EmailSuggestionEvent
    | IndustrySuggestionEvent
    | CompanyNameSuggestionEvent
    | NumberOfEmployeesSuggestionEvent
    | GoalsSuggestionEvent
)


# Request models for MCP tools
class SuggestionRequest(BaseModel):
    """Request model for generating field suggestions"""

    step: WizardStep = Field(..., description="Which wizard step to suggest for")
    field_name: str = Field(..., description="Which field to suggest a value for")
    context: Optional[dict] = Field(default=None, description="Additional context for generating suggestions")


class BatchSuggestionRequest(BaseModel):
    """Request model for generating multiple field suggestions"""

    step: WizardStep = Field(..., description="Which wizard step to suggest for")
    fields: list[str] = Field(..., description="List of field names to suggest values for")
    context: Optional[dict] = Field(default=None, description="Additional context for generating suggestions")
