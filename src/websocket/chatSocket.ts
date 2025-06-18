import { AppDispatch } from '../store';
import { addMessage, setConnectionStatus } from '../store/slices/chatSlice';

export class ChatSocket {
  private socket: WebSocket | null = null;

  constructor(private url: string, private dispatch: AppDispatch) {}

  connect() {
    this.dispatch(setConnectionStatus('connecting'));
    this.socket = new WebSocket(this.url);

    this.socket.onopen = () => {
      this.dispatch(setConnectionStatus('connected'));
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.dispatch(addMessage(data));
    };

    this.socket.onclose = () => {
      this.dispatch(setConnectionStatus('disconnected'));
    };

    this.socket.onerror = () => {
      this.dispatch(setConnectionStatus('disconnected'));
    };
  }

  send(data: any) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
    }
  }

  disconnect() {
    this.socket?.close();
  }
}



