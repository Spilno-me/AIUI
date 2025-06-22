"""
AIUI MCP Server with wizard field suggestion tools.
This server provides tools for AI to suggest values for onboarding wizard fields.
"""

import json
from pathlib import Path

from mcp.server.fastmcp import FastMCP

from wizard_events import (
    FullNameSuggestionEvent,
    EmailSuggestionEvent,
    IndustrySuggestionEvent,
    CompanyNameSuggestionEvent,
    NumberOfEmployeesSuggestionEvent,
    GoalsSuggestionEvent,
    SubscribeToUpdatesSuggestionEvent,
    VibeSuggestionEvent,
    FavoriteColorSuggestionEvent,
)

mcp = FastMCP("aiui_wizard")

# # WebSocket endpoint for pushing suggestions to UI
# WEBSOCKET_URL = "ws://localhost:8765"

# Log file path
LOG_FILE_PATH = Path("mcp.log")

# Touch the log file on module import
LOG_FILE_PATH.touch(exist_ok=True)


def log_event(event_data: dict) -> None:
    """Log event data to mcp.log file"""
    with open(LOG_FILE_PATH, "a", encoding="utf-8") as f:
        f.write(json.dumps(event_data, indent=2) + "\n")


async def send_suggestion_to_ui(suggestion_event: dict) -> None:
    """Send suggestion event to UI via WebSocket"""
    log_event(suggestion_event)
    return
    # TODO use already existing websocket connection
    # try:
    #     async with websockets.connect(WEBSOCKET_URL) as websocket:
    #         await websocket.send(json.dumps(suggestion_event))
    # except Exception as e:
    #     raise RuntimeError(f"Failed to send suggestion to UI: {e}") from e


@mcp.tool()
async def suggest_full_name(event: FullNameSuggestionEvent) -> str:
    """Send a full name suggestion to the UI"""
    await send_suggestion_to_ui(event.model_dump())
    return f"Sent full name suggestion: {event.suggestion}"


@mcp.tool()
async def suggest_email(event: EmailSuggestionEvent) -> str:
    """Send an email suggestion to the UI"""
    await send_suggestion_to_ui(event.model_dump())
    return f"Sent email suggestion: {event.suggestion}"


@mcp.tool()
async def suggest_industry(event: IndustrySuggestionEvent) -> str:
    """Send an industry suggestion to the UI"""
    await send_suggestion_to_ui(event.model_dump())
    return f"Sent industry suggestion: {event.suggestion}"


@mcp.tool()
async def suggest_company_name(event: CompanyNameSuggestionEvent) -> str:
    """Send a company name suggestion to the UI"""
    await send_suggestion_to_ui(event.model_dump())
    return f"Sent company name suggestion: {event.suggestion}"


@mcp.tool()
async def suggest_employee_count(event: NumberOfEmployeesSuggestionEvent) -> str:
    """Send an employee count suggestion to the UI"""
    await send_suggestion_to_ui(event.model_dump())
    return f"Sent employee count suggestion: {event.suggestion}"


@mcp.tool()
async def suggest_goals(event: GoalsSuggestionEvent) -> str:
    """Send a goals suggestion to the UI"""
    await send_suggestion_to_ui(event.model_dump())
    return "Sent goals suggestion"


@mcp.tool()
async def suggest_subscription_preference(event: SubscribeToUpdatesSuggestionEvent) -> str:
    """Send a subscription preference suggestion to the UI"""
    await send_suggestion_to_ui(event.model_dump())
    return f"Sent subscription preference suggestion: {event.suggestion}"


@mcp.tool()
async def suggest_vibe(event: VibeSuggestionEvent) -> str:
    """Send a personality vibe suggestion to the UI"""
    await send_suggestion_to_ui(event.model_dump())
    return f"Sent vibe suggestion: {event.suggestion}"


@mcp.tool()
async def suggest_favorite_color(event: FavoriteColorSuggestionEvent) -> str:
    """Send a favorite color suggestion to the UI"""
    await send_suggestion_to_ui(event.model_dump())
    return f"Sent color suggestion: {event.suggestion}"
