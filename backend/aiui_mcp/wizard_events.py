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


# Additional Facility Step Events
class LatitudeSuggestionEvent(BaseSuggestionEvent):
    """Event for suggesting latitude coordinate"""

    event_type: Literal["latitude_suggestion"] = "latitude_suggestion"
    step: Literal[WizardStep.FACILITY] = WizardStep.FACILITY
    field_name: Literal["latitude"] = "latitude"
    suggestion: str = Field(..., description="Suggested latitude coordinate")


class LongitudeSuggestionEvent(BaseSuggestionEvent):
    """Event for suggesting longitude coordinate"""

    event_type: Literal["longitude_suggestion"] = "longitude_suggestion"
    step: Literal[WizardStep.FACILITY] = WizardStep.FACILITY
    field_name: Literal["longitude"] = "longitude"
    suggestion: str = Field(..., description="Suggested longitude coordinate")


class RegulatedEntityNumberSuggestionEvent(BaseSuggestionEvent):
    """Event for suggesting regulated entity number"""

    event_type: Literal["regulated_entity_number_suggestion"] = "regulated_entity_number_suggestion"
    step: Literal[WizardStep.FACILITY] = WizardStep.FACILITY
    field_name: Literal["regulatedEntityNumber"] = "regulatedEntityNumber"
    suggestion: str = Field(..., description="Suggested regulated entity number")


# Additional Emission Units Step Events
class UnitTypeSuggestionEvent(BaseSuggestionEvent):
    """Event for suggesting emission unit type"""

    event_type: Literal["unit_type_suggestion"] = "unit_type_suggestion"
    step: Literal[WizardStep.EMISSIONS] = WizardStep.EMISSIONS
    field_name: Literal["unitType"] = "unitType"
    suggestion: EmissionUnitType = Field(..., description="Suggested emission unit type")


class UnitDescriptionSuggestionEvent(BaseSuggestionEvent):
    """Event for suggesting emission unit description"""

    event_type: Literal["unit_description_suggestion"] = "unit_description_suggestion"
    step: Literal[WizardStep.EMISSIONS] = WizardStep.EMISSIONS
    field_name: Literal["description"] = "description"
    suggestion: str = Field(..., min_length=10, max_length=200, description="Suggested unit description")


class ControlDeviceSuggestionEvent(BaseSuggestionEvent):
    """Event for suggesting control device"""

    event_type: Literal["control_device_suggestion"] = "control_device_suggestion"
    step: Literal[WizardStep.EMISSIONS] = WizardStep.EMISSIONS
    field_name: Literal["controlDevice"] = "controlDevice"
    suggestion: str = Field(..., description="Suggested control device")


class PollutantsSuggestionEvent(BaseSuggestionEvent):
    """Event for suggesting pollutants"""

    event_type: Literal["pollutants_suggestion"] = "pollutants_suggestion"
    step: Literal[WizardStep.EMISSIONS] = WizardStep.EMISSIONS
    field_name: Literal["pollutants"] = "pollutants"
    suggestion: str = Field(..., description="Suggested pollutants (comma-separated)")


class HasVOCStorageSuggestionEvent(BaseSuggestionEvent):
    """Event for suggesting VOC storage checkbox"""

    event_type: Literal["has_voc_storage_suggestion"] = "has_voc_storage_suggestion"
    step: Literal[WizardStep.EMISSIONS] = WizardStep.EMISSIONS
    field_name: Literal["hasVOCStorage"] = "hasVOCStorage"
    suggestion: str = Field(..., description="Suggested boolean value as string")


class HasParticulatesSuggestionEvent(BaseSuggestionEvent):
    """Event for suggesting particulates checkbox"""

    event_type: Literal["has_particulates_suggestion"] = "has_particulates_suggestion"
    step: Literal[WizardStep.EMISSIONS] = WizardStep.EMISSIONS
    field_name: Literal["hasParticulates"] = "hasParticulates"
    suggestion: str = Field(..., description="Suggested boolean value as string")


class HasCombustionSourcesSuggestionEvent(BaseSuggestionEvent):
    """Event for suggesting combustion sources checkbox"""

    event_type: Literal["has_combustion_sources_suggestion"] = "has_combustion_sources_suggestion"
    step: Literal[WizardStep.EMISSIONS] = WizardStep.EMISSIONS
    field_name: Literal["hasCombustionSources"] = "hasCombustionSources"
    suggestion: str = Field(..., description="Suggested boolean value as string")


# Compliance Step Events
class ComplianceMethodSuggestionEvent(BaseSuggestionEvent):
    """Event for suggesting compliance method"""

    event_type: Literal["compliance_method_suggestion"] = "compliance_method_suggestion"
    step: Literal[WizardStep.COMPLIANCE] = WizardStep.COMPLIANCE
    field_name: Literal["complianceMethod"] = "complianceMethod"
    suggestion: ComplianceMethodType = Field(..., description="Suggested compliance method")


class SubjectToNSRSuggestionEvent(BaseSuggestionEvent):
    """Event for suggesting New Source Review checkbox"""

    event_type: Literal["subject_to_nsr_suggestion"] = "subject_to_nsr_suggestion"
    step: Literal[WizardStep.COMPLIANCE] = WizardStep.COMPLIANCE
    field_name: Literal["subjectToNSR"] = "subjectToNSR"
    suggestion: str = Field(..., description="Suggested boolean value as string")


class HasRiskManagementPlanSuggestionEvent(BaseSuggestionEvent):
    """Event for suggesting Risk Management Plan checkbox"""

    event_type: Literal["has_risk_management_plan_suggestion"] = "has_risk_management_plan_suggestion"
    step: Literal[WizardStep.COMPLIANCE] = WizardStep.COMPLIANCE
    field_name: Literal["hasRiskManagementPlan"] = "hasRiskManagementPlan"
    suggestion: str = Field(..., description="Suggested boolean value as string")


class MonitoringRequirementsSuggestionEvent(BaseSuggestionEvent):
    """Event for suggesting monitoring requirements"""

    event_type: Literal["monitoring_requirements_suggestion"] = "monitoring_requirements_suggestion"
    step: Literal[WizardStep.COMPLIANCE] = WizardStep.COMPLIANCE
    field_name: Literal["monitoringRequirements"] = "monitoringRequirements"
    suggestion: str = Field(..., description="Suggested monitoring requirements (comma-separated)")


class StratosphericOzoneComplianceSuggestionEvent(BaseSuggestionEvent):
    """Event for suggesting stratospheric ozone compliance checkbox"""

    event_type: Literal["stratospheric_ozone_compliance_suggestion"] = "stratospheric_ozone_compliance_suggestion"
    step: Literal[WizardStep.COMPLIANCE] = WizardStep.COMPLIANCE
    field_name: Literal["stratosphericOzoneCompliance"] = "stratosphericOzoneCompliance"
    suggestion: str = Field(..., description="Suggested boolean value as string")


# Additional Requirements Step Events
class EmissionCreditsUsedSuggestionEvent(BaseSuggestionEvent):
    """Event for suggesting emission credits used checkbox"""

    event_type: Literal["emission_credits_used_suggestion"] = "emission_credits_used_suggestion"
    step: Literal[WizardStep.ADDITIONAL] = WizardStep.ADDITIONAL
    field_name: Literal["emissionCreditsUsed"] = "emissionCreditsUsed"
    suggestion: str = Field(..., description="Suggested boolean value as string")


class VolatileOrganicCompoundsSuggestionEvent(BaseSuggestionEvent):
    """Event for suggesting volatile organic compounds checkbox"""

    event_type: Literal["volatile_organic_compounds_suggestion"] = "volatile_organic_compounds_suggestion"
    step: Literal[WizardStep.ADDITIONAL] = WizardStep.ADDITIONAL
    field_name: Literal["volatileOrganicCompounds"] = "volatileOrganicCompounds"
    suggestion: str = Field(..., description="Suggested boolean value as string")


class SubscribeToUpdatesSuggestionEvent(BaseSuggestionEvent):
    """Event for suggesting subscribe to updates checkbox"""

    event_type: Literal["subscribe_to_updates_suggestion"] = "subscribe_to_updates_suggestion"
    step: Literal[WizardStep.ADDITIONAL] = WizardStep.ADDITIONAL
    field_name: Literal["subscribeToUpdates"] = "subscribeToUpdates"
    suggestion: str = Field(..., description="Suggested boolean value as string")


# Union type for all suggestion events
SuggestionEvent = (
    FacilityNameSuggestionEvent
    | OperatorNameSuggestionEvent
    | CountySuggestionEvent
    | LatitudeSuggestionEvent
    | LongitudeSuggestionEvent
    | RegulatedEntityNumberSuggestionEvent
    | IndustryTypeSuggestionEvent
    | PrimaryOperationsSuggestionEvent
    | UnitTypeSuggestionEvent
    | UnitDescriptionSuggestionEvent
    | ControlDeviceSuggestionEvent
    | PollutantsSuggestionEvent
    | HasVOCStorageSuggestionEvent
    | HasParticulatesSuggestionEvent
    | HasCombustionSourcesSuggestionEvent
    | EstimatedEmissionsSuggestionEvent
    | ComplianceMethodSuggestionEvent
    | SubjectToNSRSuggestionEvent
    | HasRiskManagementPlanSuggestionEvent
    | MonitoringRequirementsSuggestionEvent
    | StratosphericOzoneComplianceSuggestionEvent
    | EmissionCreditsUsedSuggestionEvent
    | VolatileOrganicCompoundsSuggestionEvent
    | SubscribeToUpdatesSuggestionEvent
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
