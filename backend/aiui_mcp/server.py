"""
AIUI MCP Server with wizard field suggestion tools.
This server provides tools for AI to suggest values for onboarding wizard fields.
"""

import os
import sys
import asyncio
import websockets
import json
from typing import Optional, Dict, Any

from mcp.server.fastmcp import FastMCP

# Add parent directory to path to import wizard_events
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from wizard_events import (
    SuggestionRequest, 
    WizardStep,
    FullNameSuggestionEvent,
    EmailSuggestionEvent,
    PasswordSuggestionEvent,
    IndustrySuggestionEvent,
    CompanyNameSuggestionEvent,
    NumberOfEmployeesSuggestionEvent,
    GoalsSuggestionEvent,
    SubscribeToUpdatesSuggestionEvent,
    VibeSuggestionEvent,
    FavoriteColorSuggestionEvent,
    IndustryType,
    EmployeeRangeType,
    VibeType
)

mcp = FastMCP("aiui_wizard")

# WebSocket endpoint for pushing suggestions to UI
WEBSOCKET_URL = "ws://localhost:8765"


async def send_suggestion_to_ui(suggestion_event: dict) -> None:
    """Send suggestion event to UI via WebSocket"""
    try:
        async with websockets.connect(WEBSOCKET_URL) as websocket:
            await websocket.send(json.dumps(suggestion_event))
    except Exception as e:
        raise RuntimeError(f"Failed to send suggestion to UI: {e}") from e


@mcp.tool()
async def suggest_full_name(event: FullNameSuggestionEvent) -> str:
    """Send a full name suggestion to the UI"""
    print(json.dumps(event.model_dump(), indent=2))
    await send_suggestion_to_ui(event.model_dump())
    return f"Sent full name suggestion: {event.suggestion}"


@mcp.tool()
async def suggest_email(event: EmailSuggestionEvent) -> str:
    """Send an email suggestion to the UI"""
    print(json.dumps(event.model_dump(), indent=2))
    await send_suggestion_to_ui(event.model_dump())
    return f"Sent email suggestion: {event.suggestion}"


@mcp.tool()
async def suggest_password(event: PasswordSuggestionEvent) -> str:
    """Send a password suggestion to the UI"""
    print(json.dumps(event.model_dump(), indent=2))
    await send_suggestion_to_ui(event.model_dump())
    return "Sent password suggestion"


@mcp.tool()
async def suggest_industry(event: IndustrySuggestionEvent) -> str:
    """Send an industry suggestion to the UI"""
    print(json.dumps(event.model_dump(), indent=2))
    await send_suggestion_to_ui(event.model_dump())
    return f"Sent industry suggestion: {event.suggestion}"


@mcp.tool()
async def suggest_company_name(event: CompanyNameSuggestionEvent) -> str:
    """Send a company name suggestion to the UI"""
    print(json.dumps(event.model_dump(), indent=2))
    await send_suggestion_to_ui(event.model_dump())
    return f"Sent company name suggestion: {event.suggestion}"


@mcp.tool()
async def suggest_employee_count(event: NumberOfEmployeesSuggestionEvent) -> str:
    """Send an employee count suggestion to the UI"""
    print(json.dumps(event.model_dump(), indent=2))
    await send_suggestion_to_ui(event.model_dump())
    return f"Sent employee count suggestion: {event.suggestion}"


@mcp.tool()
async def suggest_goals(event: GoalsSuggestionEvent) -> str:
    """Send a goals suggestion to the UI"""
    print(json.dumps(event.model_dump(), indent=2))
    await send_suggestion_to_ui(event.model_dump())
    return f"Sent goals suggestion"


@mcp.tool()
async def suggest_subscription_preference(event: SubscribeToUpdatesSuggestionEvent) -> str:
    """Send a subscription preference suggestion to the UI"""
    print(json.dumps(event.model_dump(), indent=2))
    await send_suggestion_to_ui(event.model_dump())
    return f"Sent subscription preference suggestion: {event.suggestion}"


@mcp.tool()
async def suggest_vibe(event: VibeSuggestionEvent) -> str:
    """Send a personality vibe suggestion to the UI"""
    print(json.dumps(event.model_dump(), indent=2))
    await send_suggestion_to_ui(event.model_dump())
    return f"Sent vibe suggestion: {event.suggestion}"


@mcp.tool()
async def suggest_favorite_color(event: FavoriteColorSuggestionEvent) -> str:
    """Send a favorite color suggestion to the UI"""
    print(json.dumps(event.model_dump(), indent=2))
    await send_suggestion_to_ui(event.model_dump())
    return f"Sent color suggestion: {event.suggestion}"


@mcp.tool()
async def greet_user(name: str) -> str:
    """Greet a user by name (legacy tool for testing)"""
    with open("greetings.txt", "a", encoding="utf-8") as f:
        f.write(f"{os.getcwd()}\n")
        f.write(f"{name}\n")
    return f"Hello, {name}!"
