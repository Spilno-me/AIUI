"""
AIUI MCP Server with wizard field suggestion tools.
This server provides tools for AI to suggest values for onboarding wizard fields.
"""

import json
from typing import Any

from mcp.server.fastmcp import FastMCP

from aiui_mcp.common import get_current_websocket, log_message_to_file
from aiui_mcp.wizard_events import (
    FacilityNameSuggestionEvent,
    OperatorNameSuggestionEvent,
    FacilityAddressSuggestionEvent,
    CountySuggestionEvent,
    LatitudeSuggestionEvent,
    LongitudeSuggestionEvent,
    RegulatedEntityNumberSuggestionEvent,
    IndustryTypeSuggestionEvent,
    PrimaryOperationsSuggestionEvent,
    UnitTypeSuggestionEvent,
    UnitDescriptionSuggestionEvent,
    ControlDeviceSuggestionEvent,
    PollutantsSuggestionEvent,
    HasVOCStorageSuggestionEvent,
    HasParticulatesSuggestionEvent,
    HasCombustionSourcesSuggestionEvent,
    EstimatedEmissionsSuggestionEvent,
    ComplianceMethodSuggestionEvent,
    SubjectToNSRSuggestionEvent,
    HasRiskManagementPlanSuggestionEvent,
    MonitoringRequirementsSuggestionEvent,
    StratosphericOzoneComplianceSuggestionEvent,
    EmissionCreditsUsedSuggestionEvent,
    VolatileOrganicCompoundsSuggestionEvent,
    SubscribeToUpdatesSuggestionEvent,
)

mcp = FastMCP(
    "AIUI",
    instructions=(
        "This MCP server (AIUI) should be used WHENEVER the user asks to fill in any kind of form. When users mention "
        "form filling, they always imply using AIUI - that's the whole purpose of this setup (and the users are aware "
        "of this)."
    ),
)


async def run_mcp_server():
    print("Starting MCP server...")
    await mcp.run_stdio_async()


def log_event(event_data: dict) -> None:
    """Log event data to mcp.log file"""
    log_message_to_file(json.dumps(event_data, indent=2))


async def send_suggestion_to_ui(suggestion_event: dict[str, Any]) -> None:
    """Send suggestion event to UI via WebSocket"""
    log_event(suggestion_event)
    websocket = get_current_websocket()
    if not websocket:
        raise RuntimeError("The client is not connected to the WebSocket server")

    await websocket.send(json.dumps(suggestion_event))
    return


@mcp.tool()
async def suggest_facility_name(event: FacilityNameSuggestionEvent) -> str:
    """Send a facility name suggestion to the UI"""
    await send_suggestion_to_ui(event.model_dump())
    return f"Sent facility name suggestion: {event.suggestion}"


@mcp.tool()
async def suggest_operator_name(event: OperatorNameSuggestionEvent) -> str:
    """Send an operator name suggestion to the UI"""
    await send_suggestion_to_ui(event.model_dump())
    return f"Sent operator name suggestion: {event.suggestion}"


@mcp.tool()
async def suggest_facility_address(event: FacilityAddressSuggestionEvent) -> str:
    """Send a facility address suggestion to the UI"""
    await send_suggestion_to_ui(event.model_dump())
    return f"Sent facility address suggestion: {event.suggestion}"


@mcp.tool()
async def suggest_county(event: CountySuggestionEvent) -> str:
    """Send a county suggestion to the UI"""
    await send_suggestion_to_ui(event.model_dump())
    return f"Sent county suggestion: {event.suggestion}"


@mcp.tool()
async def suggest_industry_type(event: IndustryTypeSuggestionEvent) -> str:
    """Send an industry type suggestion to the UI"""
    await send_suggestion_to_ui(event.model_dump())
    return f"Sent industry type suggestion: {event.suggestion}"


@mcp.tool()
async def suggest_primary_operations(event: PrimaryOperationsSuggestionEvent) -> str:
    """Send a primary operations suggestion to the UI"""
    await send_suggestion_to_ui(event.model_dump())
    return f"Sent primary operations suggestion"


@mcp.tool()
async def suggest_estimated_emissions(event: EstimatedEmissionsSuggestionEvent) -> str:
    """Send an estimated emissions suggestion to the UI"""
    await send_suggestion_to_ui(event.model_dump())
    return f"Sent estimated emissions suggestion: {event.suggestion}"


@mcp.tool()
async def suggest_compliance_method(event: ComplianceMethodSuggestionEvent) -> str:
    """Send a compliance method suggestion to the UI"""
    await send_suggestion_to_ui(event.model_dump())
    return f"Sent compliance method suggestion: {event.suggestion}"


# Additional Facility Step Tools
@mcp.tool()
async def suggest_latitude(event: LatitudeSuggestionEvent) -> str:
    """Send a latitude coordinate suggestion to the UI"""
    await send_suggestion_to_ui(event.model_dump())
    return f"Sent latitude suggestion: {event.suggestion}"


@mcp.tool()
async def suggest_longitude(event: LongitudeSuggestionEvent) -> str:
    """Send a longitude coordinate suggestion to the UI"""
    await send_suggestion_to_ui(event.model_dump())
    return f"Sent longitude suggestion: {event.suggestion}"


@mcp.tool()
async def suggest_regulated_entity_number(event: RegulatedEntityNumberSuggestionEvent) -> str:
    """Send a regulated entity number suggestion to the UI"""
    await send_suggestion_to_ui(event.model_dump())
    return f"Sent regulated entity number suggestion: {event.suggestion}"


# Additional Emission Units Step Tools
@mcp.tool()
async def suggest_unit_type(event: UnitTypeSuggestionEvent) -> str:
    """Send an emission unit type suggestion to the UI"""
    await send_suggestion_to_ui(event.model_dump())
    return f"Sent unit type suggestion: {event.suggestion}"


@mcp.tool()
async def suggest_unit_description(event: UnitDescriptionSuggestionEvent) -> str:
    """Send an emission unit description suggestion to the UI"""
    await send_suggestion_to_ui(event.model_dump())
    return f"Sent unit description suggestion"


@mcp.tool()
async def suggest_control_device(event: ControlDeviceSuggestionEvent) -> str:
    """Send a control device suggestion to the UI"""
    await send_suggestion_to_ui(event.model_dump())
    return f"Sent control device suggestion: {event.suggestion}"


@mcp.tool()
async def suggest_pollutants(event: PollutantsSuggestionEvent) -> str:
    """Send a pollutants suggestion to the UI"""
    await send_suggestion_to_ui(event.model_dump())
    return f"Sent pollutants suggestion: {event.suggestion}"


@mcp.tool()
async def suggest_has_voc_storage(event: HasVOCStorageSuggestionEvent) -> str:
    """Send a VOC storage checkbox suggestion to the UI"""
    await send_suggestion_to_ui(event.model_dump())
    return f"Sent VOC storage suggestion: {event.suggestion}"


@mcp.tool()
async def suggest_has_particulates(event: HasParticulatesSuggestionEvent) -> str:
    """Send a particulates checkbox suggestion to the UI"""
    await send_suggestion_to_ui(event.model_dump())
    return f"Sent particulates suggestion: {event.suggestion}"


@mcp.tool()
async def suggest_has_combustion_sources(event: HasCombustionSourcesSuggestionEvent) -> str:
    """Send a combustion sources checkbox suggestion to the UI"""
    await send_suggestion_to_ui(event.model_dump())
    return f"Sent combustion sources suggestion: {event.suggestion}"


# Additional Compliance Step Tools
@mcp.tool()
async def suggest_subject_to_nsr(event: SubjectToNSRSuggestionEvent) -> str:
    """Send a New Source Review checkbox suggestion to the UI"""
    await send_suggestion_to_ui(event.model_dump())
    return f"Sent NSR subject suggestion: {event.suggestion}"


@mcp.tool()
async def suggest_has_risk_management_plan(event: HasRiskManagementPlanSuggestionEvent) -> str:
    """Send a Risk Management Plan checkbox suggestion to the UI"""
    await send_suggestion_to_ui(event.model_dump())
    return f"Sent RMP suggestion: {event.suggestion}"


@mcp.tool()
async def suggest_monitoring_requirements(event: MonitoringRequirementsSuggestionEvent) -> str:
    """Send a monitoring requirements suggestion to the UI"""
    await send_suggestion_to_ui(event.model_dump())
    return f"Sent monitoring requirements suggestion: {event.suggestion}"


@mcp.tool()
async def suggest_stratospheric_ozone_compliance(event: StratosphericOzoneComplianceSuggestionEvent) -> str:
    """Send a stratospheric ozone compliance checkbox suggestion to the UI"""
    await send_suggestion_to_ui(event.model_dump())
    return f"Sent stratospheric ozone compliance suggestion: {event.suggestion}"


# Additional Requirements Step Tools
@mcp.tool()
async def suggest_emission_credits_used(event: EmissionCreditsUsedSuggestionEvent) -> str:
    """Send an emission credits used checkbox suggestion to the UI"""
    await send_suggestion_to_ui(event.model_dump())
    return f"Sent emission credits used suggestion: {event.suggestion}"


@mcp.tool()
async def suggest_volatile_organic_compounds(event: VolatileOrganicCompoundsSuggestionEvent) -> str:
    """Send a volatile organic compounds checkbox suggestion to the UI"""
    await send_suggestion_to_ui(event.model_dump())
    return f"Sent VOC suggestion: {event.suggestion}"


@mcp.tool()
async def suggest_subscribe_to_updates(event: SubscribeToUpdatesSuggestionEvent) -> str:
    """Send a subscribe to updates checkbox suggestion to the UI"""
    await send_suggestion_to_ui(event.model_dump())
    return f"Sent subscribe to updates suggestion: {event.suggestion}"
