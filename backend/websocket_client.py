import anyio
import json

import websockets


async def main():
    uri = "ws://localhost:8765"

    print(f"Connecting to {uri}...")

    async with websockets.connect(uri) as websocket:
        print("Connected to server!")

        # Listen for messages perpetually
        try:
            while True:
                message = await websocket.recv()
                message = json.loads(message)
                print(json.dumps(message, indent=2))
        except websockets.exceptions.ConnectionClosed:
            print("Connection closed by server")
        except KeyboardInterrupt:
            print("Disconnected by user")


if __name__ == "__main__":
    anyio.run(main)
