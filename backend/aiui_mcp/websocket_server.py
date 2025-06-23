import asyncio
import websockets


WEBSOCKET_SINGLETON = None


async def handle_client(websocket):
    """Handle a connected WebSocket client."""
    global WEBSOCKET_SINGLETON
    WEBSOCKET_SINGLETON = websocket  # For the purposes of the PoC we are assuming there is only one client
    print(f"Client connected from {websocket.remote_address}")

    try:
        # Listen for messages from the client
        async for message in websocket:
            print(f"Received message: {message}")

    except websockets.exceptions.ConnectionClosed:
        print("Client disconnected")
    finally:
        print(f"Connection with {websocket.remote_address} closed")


async def run_websocket_server():
    print("Starting WebSocket server on ws://localhost:8765")

    # Start server on localhost:8765
    async with websockets.serve(handle_client, "localhost", 8765):
        print("Server is running. Press Ctrl+C to stop.")
        await asyncio.Future()  # Run forever
