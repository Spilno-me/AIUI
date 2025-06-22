import os
import sys
from pathlib import Path

sys.path.insert(0, Path(__file__).parent)

user_mcp_dir = Path.home() / ".aiui_mcp"
user_mcp_dir.mkdir(parents=True, exist_ok=True)
os.chdir(user_mcp_dir)


if __name__ == "__main__":
    from aiui_mcp.mcp_server import mcp

    mcp.run(transport="stdio")
