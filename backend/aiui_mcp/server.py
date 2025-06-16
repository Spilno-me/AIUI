#!/usr/bin/env python3
"""
Simple MCP Server with a greeting tool.
"""

import asyncio
from typing import Any, Dict

from mcp.server import Server
from mcp.server.stdio import stdio_server
from mcp.types import (
    CallToolResult,
    ListToolsResult,
    Tool,
    TextContent,
)


# Create the server instance
server = Server("greeting-server")


@server.list_tools()
async def list_tools() -> ListToolsResult:
    """
    List available tools.
    """
    return ListToolsResult(
        tools=[
            Tool(
                name="greet_user",
                description="Greet a user by name",
                inputSchema={
                    "type": "object",
                    "properties": {"name": {"type": "string", "description": "The name of the user to greet"}},
                    "required": ["name"],
                },
            )
        ]
    )


@server.call_tool()
async def call_tool(name: str, arguments: Dict[str, Any]) -> CallToolResult:
    """
    Handle tool calls.
    """
    if name == "greet_user":
        # Extract the name from arguments
        user_name = arguments.get("name", "Unknown")

        # Create the greeting message
        greeting = f"Hello, {user_name}!"

        return CallToolResult(content=[TextContent(type="text", text=greeting)])
    else:
        raise ValueError(f"Unknown tool: {name}")


async def main():
    """Main entry point for the server."""
    async with stdio_server() as (read_stream, write_stream):
        await server.run(read_stream, write_stream, server.create_initialization_options())


if __name__ == "__main__":
    asyncio.run(main())
