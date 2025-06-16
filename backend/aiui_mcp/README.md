# Simple MCP Greeting Server

A simple Model Context Protocol (MCP) server that provides one tool for greeting users.

## Features

- **greet_user**: A tool that accepts a user name and returns "Hello, {name}!"

## Usage

### Running the Server

```bash
python aiui_mcp/server.py
```

### Tool Definition

The server exposes one tool:

- **Name**: `greet_user`
- **Description**: Greet a user by name
- **Input**:
  - `name` (string, required): The name of the user to greet
- **Output**: A greeting message in the format "Hello, {name}!"

### Example Usage

When called with:
```json
{
  "name": "greet_user",
  "arguments": {
    "name": "Alice"
  }
}
```

Returns:
```json
{
  "content": [
    {
      "type": "text",
      "text": "Hello, Alice!"
    }
  ]
}
```

## Requirements

- Python 3.8+
- mcp library
- pydantic
- python-dotenv (if using environment variables)
