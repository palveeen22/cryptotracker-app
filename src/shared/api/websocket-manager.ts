import { WS_CONFIG } from '@/src/shared/config/constants';

type MessageHandler = (data: unknown) => void;
type StatusHandler = (status: 'connecting' | 'connected' | 'disconnected' | 'error') => void;

interface WebSocketManagerOptions {
  url: string;
  onMessage: MessageHandler;
  onStatusChange?: StatusHandler;
  reconnect?: boolean;
}

export class WebSocketManager {
  private ws: WebSocket | null = null;
  private url: string;
  private onMessage: MessageHandler;
  private onStatusChange?: StatusHandler;
  private reconnect: boolean;
  private reconnectAttempts = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private pingTimer: ReturnType<typeof setInterval> | null = null;
  private isManualClose = false;

  constructor(options: WebSocketManagerOptions) {
    this.url = options.url;
    this.onMessage = options.onMessage;
    this.onStatusChange = options.onStatusChange;
    this.reconnect = options.reconnect ?? true;
  }

  connect(): void {
    if (this.ws?.readyState === WebSocket.OPEN) return;

    this.isManualClose = false;
    this.onStatusChange?.('connecting');

    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        this.reconnectAttempts = 0;
        this.onStatusChange?.('connected');
        this.startPing();
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data as string);
          this.onMessage(data);
        } catch {
          // ignore non-JSON messages
        }
      };

      this.ws.onerror = () => {
        this.onStatusChange?.('error');
      };

      this.ws.onclose = () => {
        this.stopPing();
        this.onStatusChange?.('disconnected');

        if (!this.isManualClose && this.reconnect) {
          this.attemptReconnect();
        }
      };
    } catch {
      this.onStatusChange?.('error');
      if (this.reconnect) this.attemptReconnect();
    }
  }

  disconnect(): void {
    this.isManualClose = true;
    this.stopPing();
    this.clearReconnectTimer();
    this.ws?.close();
    this.ws = null;
  }

  send(data: unknown): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts >= WS_CONFIG.MAX_RECONNECT_ATTEMPTS) {
      console.warn('[WS] Max reconnect attempts reached');
      return;
    }

    const delay = WS_CONFIG.RECONNECT_INTERVAL * Math.pow(2, this.reconnectAttempts);
    this.reconnectAttempts++;

    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, delay);
  }

  private startPing(): void {
    this.pingTimer = setInterval(() => {
      this.send({ type: 'ping' });
    }, WS_CONFIG.PING_INTERVAL);
  }

  private stopPing(): void {
    if (this.pingTimer) {
      clearInterval(this.pingTimer);
      this.pingTimer = null;
    }
  }

  private clearReconnectTimer(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }
}
