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


async def send_suggestion_to_ui(suggestion_event: dict) -> bool:
    """Send suggestion event to UI via WebSocket"""
    try:
        async with websockets.connect(WEBSOCKET_URL) as websocket:
            await websocket.send(json.dumps(suggestion_event))
            return True
    except Exception as e:
        print(f"Failed to send suggestion to UI: {e}")
        return False


@mcp.tool()
async def suggest_full_name(suggestion: str, reasoning: Optional[str] = None) -> str:
    """Send a full name suggestion to the UI"""
    event = FullNameSuggestionEvent(
        suggestion=suggestion,
        reasoning=reasoning
    )
    
    print(json.dumps(event.model_dump(), indent=2))
    success = await send_suggestion_to_ui(event.model_dump())
    return f"Sent full name suggestion: {suggestion}" if success else "Failed to send suggestion"


@mcp.tool()
async def suggest_email(suggestion: str, reasoning: Optional[str] = None) -> str:
    """Send an email suggestion to the UI"""
    event = EmailSuggestionEvent(
        suggestion=suggestion,
        reasoning=reasoning
    )
    
    print(json.dumps(event.model_dump(), indent=2))
    success = await send_suggestion_to_ui(event.model_dump())
    return f"Sent email suggestion: {suggestion}" if success else "Failed to send suggestion"


@mcp.tool()
async def suggest_password(suggestion: str, reasoning: Optional[str] = None) -> str:
    """Send a password suggestion to the UI"""
    event = PasswordSuggestionEvent(
        suggestion=suggestion,
        reasoning=reasoning
    )
    
    print(json.dumps(event.model_dump(), indent=2))
    success = await send_suggestion_to_ui(event.model_dump())
    return "Sent password suggestion" if success else "Failed to send suggestion"


@mcp.tool()
async def suggest_industry(suggestion: str, reasoning: Optional[str] = None) -> str:
    """Send an industry suggestion to the UI"""
    try:
        industry_enum = IndustryType(suggestion)
    except ValueError:
        return f"Invalid industry: {suggestion}. Must be one of: {', '.join([e.value for e in IndustryType])}"
    
    event = IndustrySuggestionEvent(
        suggestion=industry_enum,
        reasoning=reasoning
    )
    
    print(json.dumps(event.model_dump(), indent=2))
    success = await send_suggestion_to_ui(event.model_dump())
    return f"Sent industry suggestion: {suggestion}" if success else "Failed to send suggestion"


@mcp.tool()
async def suggest_company_name(suggestion: str, reasoning: Optional[str] = None) -> str:
    """Send a company name suggestion to the UI"""
    event = CompanyNameSuggestionEvent(
        suggestion=suggestion,
        reasoning=reasoning
    )
    
    print(json.dumps(event.model_dump(), indent=2))
    success = await send_suggestion_to_ui(event.model_dump())
    return f"Sent company name suggestion: {suggestion}" if success else "Failed to send suggestion"


@mcp.tool()
async def suggest_employee_count(suggestion: str, reasoning: Optional[str] = None) -> str:
    """Send an employee count suggestion to the UI"""
    try:
        employee_range = EmployeeRangeType(suggestion)
    except ValueError:
        return f"Invalid employee range: {suggestion}. Must be one of: {', '.join([e.value for e in EmployeeRangeType])}"
    
    event = NumberOfEmployeesSuggestionEvent(
        suggestion=employee_range,
        reasoning=reasoning
    )
    
    print(json.dumps(event.model_dump(), indent=2))
    success = await send_suggestion_to_ui(event.model_dump())
    return f"Sent employee count suggestion: {suggestion}" if success else "Failed to send suggestion"


@mcp.tool()
async def suggest_goals(suggestion: str, reasoning: Optional[str] = None) -> str:
    """Send a goals suggestion to the UI"""
    event = GoalsSuggestionEvent(
        suggestion=suggestion,
        reasoning=reasoning
    )
    
    print(json.dumps(event.model_dump(), indent=2))
    success = await send_suggestion_to_ui(event.model_dump())
    return f"Sent goals suggestion" if success else "Failed to send suggestion"


@mcp.tool()
async def suggest_subscription_preference(suggestion: bool, reasoning: Optional[str] = None) -> str:
    """Send a subscription preference suggestion to the UI"""
    event = SubscribeToUpdatesSuggestionEvent(
        suggestion=suggestion,
        reasoning=reasoning
    )
    
    print(json.dumps(event.model_dump(), indent=2))
    success = await send_suggestion_to_ui(event.model_dump())
    return f"Sent subscription preference suggestion: {suggestion}" if success else "Failed to send suggestion"


@mcp.tool()
async def suggest_vibe(suggestion: str, reasoning: Optional[str] = None) -> str:
    """Send a personality vibe suggestion to the UI"""
    try:
        vibe_enum = VibeType(suggestion)
    except ValueError:
        return f"Invalid vibe: {suggestion}. Must be one of: {', '.join([e.value for e in VibeType])}"
    
    event = VibeSuggestionEvent(
        suggestion=vibe_enum,
        reasoning=reasoning
    )
    
    print(json.dumps(event.model_dump(), indent=2))
    success = await send_suggestion_to_ui(event.model_dump())
    return f"Sent vibe suggestion: {suggestion}" if success else "Failed to send suggestion"


@mcp.tool()
async def suggest_favorite_color(suggestion: str, reasoning: Optional[str] = None) -> str:
    """Send a favorite color suggestion to the UI"""
    event = FavoriteColorSuggestionEvent(
        suggestion=suggestion,
        reasoning=reasoning
    )
    
    print(json.dumps(event.model_dump(), indent=2))
    success = await send_suggestion_to_ui(event.model_dump())
    return f"Sent color suggestion: {suggestion}" if success else "Failed to send suggestion"


@mcp.tool()
async def greet_user(name: str) -> str:
    """Greet a user by name (legacy tool for testing)"""
    with open("greetings.txt", "a", encoding="utf-8") as f:
        f.write(f"{os.getcwd()}\n")
        f.write(f"{name}\n")
    return f"Hello, {name}!"
