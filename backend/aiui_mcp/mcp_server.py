"""
AIUI MCP Server with wizard field suggestion tools.
This server provides tools for AI to suggest values for onboarding wizard fields.
"""

import datetime
import json
from pathlib import Path
from typing import Any

from mcp.server.fastmcp import FastMCP

from aiui_mcp.common import get_websocket_singleton, log_message_to_file
from aiui_mcp.wizard_events import (
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

mcp = FastMCP("AIUI")


async def run_mcp_server():
    print("Starting MCP server...")
    await mcp.run_stdio_async()


def log_event(event_data: dict) -> None:
    """Log event data to mcp.log file"""
    log_message_to_file(json.dumps(event_data, indent=2))


async def send_suggestion_to_ui(suggestion_event: dict[str, Any]) -> None:
    """Send suggestion event to UI via WebSocket"""
    log_event(suggestion_event)
    if not get_websocket_singleton():
        raise RuntimeError("The client is not connected to the WebSocket server")

    await get_websocket_singleton().send(json.dumps(suggestion_event))
    return


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
