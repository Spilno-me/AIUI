import asyncio
import websockets

from aiui_mcp.common import get_current_websocket, log_message_to_file, add_websocket, remove_websocket


async def handle_client(websocket: websockets.ServerConnection):
    """Handle a connected WebSocket client."""
    add_websocket(websocket)  # For the purposes of the PoC we are assuming there is only one client
    log_message_to_file(f"WEBSOCKET_SINGLETON: {get_current_websocket()}")

    print(f"Client connected from {websocket.remote_address}")
    print(f"WEBSOCKET_SINGLETON: {get_current_websocket()}")

    try:
        # Listen for messages from the client
        async for message in websocket:
            print(f"Received message: {message}")

    except websockets.exceptions.ConnectionClosed:
        print("Client disconnected")
    finally:
        print(f"Connection with {websocket.remote_address} closed")
        log_message_to_file(f"Connection with {websocket.remote_address} closed")
        remove_websocket(websocket)


async def run_websocket_server():
    print("Starting WebSocket server on ws://localhost:8765")

    # Start server on localhost:8765
    async with websockets.serve(handle_client, "localhost", 8765):
        print("Server is running. Press Ctrl+C to stop.")
        await asyncio.Future()  # Run forever
