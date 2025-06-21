import asyncio
import websockets

async def handle_client(websocket, path):
    """Handle a connected WebSocket client."""
    print(f"Client connected from {websocket.remote_address}")
    
    try:
        # Send "hello world" to the client
        await websocket.send("hello world")
        print("Sent 'hello world' to client")
        
        # Keep connection alive to demonstrate it works
        await asyncio.sleep(1)
        
    except websockets.exceptions.ConnectionClosed:
        print("Client disconnected")
    finally:
        print(f"Connection with {websocket.remote_address} closed")

async def main():
    """Start the WebSocket server."""
    print("Starting WebSocket server on ws://localhost:8765")
    
    # Start server on localhost:8765
    async with websockets.serve(handle_client, "localhost", 8765):
        print("Server is running. Press Ctrl+C to stop.")
        await asyncio.Future()  # Run forever

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\nServer stopped.")