# Log file path
import datetime
from pathlib import Path


LOG_FILE_PATH = Path("mcp.log")

# Touch the log file on module import
LOG_FILE_PATH.touch(exist_ok=True)

_WEBSOCKET_SINGLETON = None


def get_websocket_singleton():
    return _WEBSOCKET_SINGLETON


def set_websocket_singleton(websocket):
    global _WEBSOCKET_SINGLETON
    _WEBSOCKET_SINGLETON = websocket


def log_message_to_file(message: str) -> None:
    with open(LOG_FILE_PATH, "a", encoding="utf-8") as f:
        f.write(f"\n[{datetime.datetime.now().isoformat()}]\n")
        f.write(message + "\n")
