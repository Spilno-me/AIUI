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
async def suggest_full_name(context: Optional[str] = None) -> str:
    """Suggest a full name for the welcome step"""
    # In a real implementation, this would use AI to generate suggestions
    # For now, using a simple example
    suggestion = "John Smith"
    
    event = FullNameSuggestionEvent(
        suggestion=suggestion,
        confidence=0.7,
        reasoning=context or "Generated a common professional name"
    )
    
    await send_suggestion_to_ui(event.model_dump())
    return f"Suggested full name: {suggestion}"


@mcp.tool()
async def suggest_email(full_name: Optional[str] = None, company: Optional[str] = None) -> str:
    """Suggest an email address based on name and company"""
    if full_name:
        base_name = full_name.lower().replace(" ", ".")
        domain = f"{company.lower()}.com" if company else "example.com"
        suggestion = f"{base_name}@{domain}"
    else:
        suggestion = "user@example.com"
    
    event = EmailSuggestionEvent(
        suggestion=suggestion,
        confidence=0.8,
        reasoning=f"Generated email based on name: {full_name} and company: {company}"
    )
    
    await send_suggestion_to_ui(event.model_dump())
    return f"Suggested email: {suggestion}"


@mcp.tool()
async def suggest_password() -> str:
    """Suggest a secure password"""
    suggestion = "SecurePass123!"
    
    event = PasswordSuggestionEvent(
        suggestion=suggestion,
        confidence=0.9,
        reasoning="Generated a secure password with mixed case, numbers, and symbols"
    )
    
    await send_suggestion_to_ui(event.model_dump())
    return f"Suggested secure password format"


@mcp.tool()
async def suggest_industry(context: Optional[str] = None) -> str:
    """Suggest an industry based on context"""
    # Simple logic - in real implementation would use AI
    suggestion = IndustryType.TECHNOLOGY.value
    
    event = IndustrySuggestionEvent(
        suggestion=IndustryType.TECHNOLOGY,
        confidence=0.7,
        reasoning=context or "Technology is a common industry for this platform"
    )
    
    await send_suggestion_to_ui(event.model_dump())
    return f"Suggested industry: {suggestion}"


@mcp.tool()
async def suggest_company_name(industry: Optional[str] = None, context: Optional[str] = None) -> str:
    """Suggest a company name based on industry and context"""
    base_names = {
        "Technology": "TechCorp",
        "Healthcare": "HealthPlus",
        "Finance": "FinanceFirst",
        "Education": "EduTech"
    }
    
    suggestion = base_names.get(industry, "MyCompany") + " Inc."
    
    event = CompanyNameSuggestionEvent(
        suggestion=suggestion,
        confidence=0.6,
        reasoning=f"Generated company name based on industry: {industry}"
    )
    
    await send_suggestion_to_ui(event.model_dump())
    return f"Suggested company name: {suggestion}"


@mcp.tool()
async def suggest_employee_count(company_name: Optional[str] = None, industry: Optional[str] = None) -> str:
    """Suggest employee count range"""
    # Simple logic based on industry
    if industry == "Technology":
        suggestion = EmployeeRangeType.RANGE_11_50
    else:
        suggestion = EmployeeRangeType.RANGE_1_10
    
    event = NumberOfEmployeesSuggestionEvent(
        suggestion=suggestion,
        confidence=0.7,
        reasoning=f"Estimated employee count based on industry: {industry}"
    )
    
    await send_suggestion_to_ui(event.model_dump())
    return f"Suggested employee count: {suggestion.value}"


@mcp.tool()
async def suggest_goals(industry: Optional[str] = None, company_size: Optional[str] = None) -> str:
    """Suggest company goals based on context"""
    goal_templates = {
        "Technology": "Develop innovative software solutions that streamline business processes and enhance user experience.",
        "Healthcare": "Improve patient outcomes through technology-driven healthcare solutions and better care coordination.",
        "Finance": "Provide secure and efficient financial services that help clients achieve their financial goals."
    }
    
    suggestion = goal_templates.get(industry, "Build a successful business that serves our customers effectively and grows sustainably.")
    
    event = GoalsSuggestionEvent(
        suggestion=suggestion,
        confidence=0.8,
        reasoning=f"Generated goals template for {industry} industry"
    )
    
    await send_suggestion_to_ui(event.model_dump())
    return f"Suggested goals for {industry} industry"


@mcp.tool()
async def suggest_subscription_preference(context: Optional[str] = None) -> str:
    """Suggest whether to subscribe to updates"""
    suggestion = True  # Most users prefer to stay updated
    
    event = SubscribeToUpdatesSuggestionEvent(
        suggestion=suggestion,
        confidence=0.9,
        reasoning="Most users benefit from product updates and tips"
    )
    
    await send_suggestion_to_ui(event.model_dump())
    return f"Suggested subscription preference: {suggestion}"


@mcp.tool()
async def suggest_vibe(context: Optional[str] = None) -> str:
    """Suggest personality vibe"""
    suggestion = VibeType.BUILDER  # Default to builder as it's common for platform users
    
    event = VibeSuggestionEvent(
        suggestion=suggestion,
        confidence=0.7,
        reasoning="Builder vibe is common for users of this platform"
    )
    
    await send_suggestion_to_ui(event.model_dump())
    return f"Suggested vibe: {suggestion.value}"


@mcp.tool()
async def suggest_favorite_color(vibe: Optional[str] = None) -> str:
    """Suggest favorite color based on vibe"""
    color_map = {
        "builder": "#3b82f6",  # Blue
        "dreamer": "#8b5cf6",  # Purple  
        "hacker": "#10b981",   # Green
        "visionary": "#f59e0b" # Yellow
    }
    
    suggestion = color_map.get(vibe, "#3b82f6")
    
    event = FavoriteColorSuggestionEvent(
        suggestion=suggestion,
        confidence=0.8,
        reasoning=f"Color chosen to match the {vibe} personality vibe"
    )
    
    await send_suggestion_to_ui(event.model_dump())
    return f"Suggested color: {suggestion} for {vibe} vibe"


@mcp.tool()
async def greet_user(name: str) -> str:
    """Greet a user by name (legacy tool for testing)"""
    with open("greetings.txt", "a", encoding="utf-8") as f:
        f.write(f"{os.getcwd()}\n")
        f.write(f"{name}\n")
    return f"Hello, {name}!"
