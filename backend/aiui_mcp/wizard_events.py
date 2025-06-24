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

    FACILITY = "facility"
    EMISSIONS = "emissions"
    COMPLIANCE = "compliance"
    ADDITIONAL = "additional"


class IndustryType(str, Enum):
    """Enum for industry types"""

    PETROCHEMICAL = "petrochemical"
    MANUFACTURING = "manufacturing"
    POWER_GENERATION = "power_generation"
    REFINING = "refining"
    CHEMICAL = "chemical"
    OTHER = "other"


class EmissionUnitType(str, Enum):
    """Enum for emission unit types"""

    STORAGE_TANK = "storage_tank"
    COMBUSTION_SOURCE = "combustion_source"
    PROCESS_VENT = "process_vent"
    FUGITIVE = "fugitive"
    OTHER = "other"


class ComplianceMethodType(str, Enum):
    """Enum for compliance monitoring methods"""

    CONTINUOUS = "continuous"
    PERIODIC = "periodic"
    PREDICTIVE = "predictive"
    PARAMETRIC = "parametric"


# Base event model
class BaseSuggestionEvent(BaseModel):
    """Base model for all suggestion events"""

    event_type: str = Field(..., description="Type of suggestion event")
    step: WizardStep = Field(..., description="Which wizard step this suggestion is for")
    field_name: str = Field(..., description="Name of the field being suggested")
    suggestion: str = Field(..., description="The AI's suggested value")
    reasoning: str = Field(..., description="Reasoning for the suggestion")


# Facility Information Step Events
class FacilityNameSuggestionEvent(BaseSuggestionEvent):
    """Event for suggesting facility name"""

    event_type: Literal["facility_name_suggestion"] = "facility_name_suggestion"
    step: Literal[WizardStep.FACILITY] = WizardStep.FACILITY
    field_name: Literal["facilityName"] = "facilityName"
    suggestion: str = Field(..., min_length=3, max_length=100, description="Suggested facility name")


class OperatorNameSuggestionEvent(BaseSuggestionEvent):
    """Event for suggesting operator name"""

    event_type: Literal["operator_name_suggestion"] = "operator_name_suggestion"
    step: Literal[WizardStep.FACILITY] = WizardStep.FACILITY
    field_name: Literal["operatorName"] = "operatorName"
    suggestion: str = Field(..., min_length=2, max_length=100, description="Suggested operator name")


class FacilityAddressSuggestionEvent(BaseSuggestionEvent):
    """Event for suggesting facility address"""

    event_type: Literal["facility_address_suggestion"] = "facility_address_suggestion"
    step: Literal[WizardStep.FACILITY] = WizardStep.FACILITY
    field_name: Literal["facilityAddress"] = "facilityAddress"
    suggestion: str = Field(..., min_length=10, max_length=200, description="Suggested facility address")


class CountySuggestionEvent(BaseSuggestionEvent):
    """Event for suggesting county"""

    event_type: Literal["county_suggestion"] = "county_suggestion"
    step: Literal[WizardStep.FACILITY] = WizardStep.FACILITY
    field_name: Literal["county"] = "county"
    suggestion: str = Field(..., description="Suggested county")


class IndustryTypeSuggestionEvent(BaseSuggestionEvent):
    """Event for suggesting industry type"""

    event_type: Literal["industry_type_suggestion"] = "industry_type_suggestion"
    step: Literal[WizardStep.FACILITY] = WizardStep.FACILITY
    field_name: Literal["industryType"] = "industryType"
    suggestion: IndustryType = Field(..., description="Suggested industry type")


# Emission Units Step Events
class PrimaryOperationsSuggestionEvent(BaseSuggestionEvent):
    """Event for suggesting primary operations"""

    event_type: Literal["primary_operations_suggestion"] = "primary_operations_suggestion"
    step: Literal[WizardStep.EMISSIONS] = WizardStep.EMISSIONS
    field_name: Literal["primaryOperations"] = "primaryOperations"
    suggestion: str = Field(..., min_length=20, max_length=500, description="Suggested primary operations description")


class EstimatedEmissionsSuggestionEvent(BaseSuggestionEvent):
    """Event for suggesting estimated annual emissions"""

    event_type: Literal["estimated_emissions_suggestion"] = "estimated_emissions_suggestion"
    step: Literal[WizardStep.EMISSIONS] = WizardStep.EMISSIONS
    field_name: Literal["estimatedAnnualEmissions"] = "estimatedAnnualEmissions"
    suggestion: str = Field(..., description="Suggested annual emissions estimate")


# Compliance Step Events
class ComplianceMethodSuggestionEvent(BaseSuggestionEvent):
    """Event for suggesting compliance method"""

    event_type: Literal["compliance_method_suggestion"] = "compliance_method_suggestion"
    step: Literal[WizardStep.COMPLIANCE] = WizardStep.COMPLIANCE
    field_name: Literal["complianceMethod"] = "complianceMethod"
    suggestion: ComplianceMethodType = Field(..., description="Suggested compliance method")


# Union type for all suggestion events
SuggestionEvent = (
    FacilityNameSuggestionEvent
    | OperatorNameSuggestionEvent
    | FacilityAddressSuggestionEvent
    | CountySuggestionEvent
    | IndustryTypeSuggestionEvent
    | PrimaryOperationsSuggestionEvent
    | EstimatedEmissionsSuggestionEvent
    | ComplianceMethodSuggestionEvent
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
