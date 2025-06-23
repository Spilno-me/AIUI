# Log file path
import datetime
from pathlib import Path

from websockets import ServerConnection


LOG_FILE_PATH = Path("mcp.log")

# Touch the log file on module import
LOG_FILE_PATH.touch(exist_ok=True)

_WEBSOCKETS: dict[str, ServerConnection] = {}


def get_current_websocket():
    if not _WEBSOCKETS:
        return None
    return list(_WEBSOCKETS.values())[0]


def add_websocket(websocket: ServerConnection):
    _WEBSOCKETS[websocket.remote_address] = websocket


def remove_websocket(websocket: ServerConnection):
    _WEBSOCKETS.pop(websocket.remote_address)


def log_message_to_file(message: str) -> None:
    with open(LOG_FILE_PATH, "a", encoding="utf-8") as f:
        f.write(f"\n[{datetime.datetime.now().isoformat()}]\n")
        f.write(message + "\n")
