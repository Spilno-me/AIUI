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
    IndustryTypeSuggestionEvent,
    PrimaryOperationsSuggestionEvent,
    EstimatedEmissionsSuggestionEvent,
    ComplianceMethodSuggestionEvent,
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
