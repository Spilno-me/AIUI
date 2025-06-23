import os
import sys
from pathlib import Path

import anyio

sys.path.insert(0, Path(__file__).parent)

user_mcp_dir = Path.home() / ".aiui_mcp"
user_mcp_dir.mkdir(parents=True, exist_ok=True)
os.chdir(user_mcp_dir)

from aiui_mcp.mcp_server import mcp, run_mcp_server
from aiui_mcp.websocket_server import run_websocket_server


async def main():
    async with anyio.create_task_group() as tg:
        tg.start_soon(run_mcp_server)
        tg.start_soon(run_websocket_server)


if __name__ == "__main__":
    anyio.run(main)
