import asyncio
import websockets

async def client():
    """Connect to WebSocket server and receive messages."""
    uri = "ws://localhost:8765"
    
    print(f"Connecting to {uri}...")
    
    try:
        async with websockets.connect(uri) as websocket:
            print("Connected to server!")
            
            # Receive message from server
            message = await websocket.recv()
            print(message)
            
    except ConnectionRefusedError:
        print("Error: Could not connect to server. Make sure the server is running.")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(client())