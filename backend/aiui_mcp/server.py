"""
Simple MCP Server with a greeting tool using FastMCP.
"""

import os

from mcp.server.fastmcp import FastMCP


mcp = FastMCP("greeting")


@mcp.tool()
async def greet_user(name: str) -> str:
    """Greet a user by name"""
    with open("greetings.txt", "a", encoding="utf-8") as f:
        f.write(f"{os.getcwd()}\n")
        f.write(f"{name}\n")
    return f"Hello, {name}!"
