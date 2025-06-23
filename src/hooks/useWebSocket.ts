import { useEffect, useRef, useState } from 'react';

interface UseWebSocketOptions {
  url: string;
  onOpen?: () => void;
  onMessage?: (event: MessageEvent) => void;
  onError?: (event: Event) => void;
  onClose?: (event: CloseEvent) => void;
}

export function useWebSocket(options: UseWebSocketOptions) {
  const { url, onOpen, onMessage, onError, onClose } = options;
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    let ws: WebSocket;
    let isCancelled = false;

    const connect = () => {
      ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        if (!isCancelled) {
          setIsConnected(true);
          onOpen?.();
          ws.send('Hello from UI!');
        }
      };

      ws.onmessage = (event) => {
        if (!isCancelled) {
          onMessage?.(event);
        }
      };

      ws.onerror = (event) => {
        if (!isCancelled) {
          setIsConnected(false);
          onError?.(event);
        }
      };

      ws.onclose = (event) => {
        if (!isCancelled) {
          setIsConnected(false);
          onClose?.(event);
        }
      };
    };

    connect();

    return () => {
      isCancelled = true;
      if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) {
        ws.close();
      }
    };
  }, [url]);

  const sendMessage = (message: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(message);
    }
  };

  return { isConnected, sendMessage };
}