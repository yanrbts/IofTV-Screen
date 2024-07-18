class WebSocketService {
    constructor() {
      this.socket = null;
      this.data = {};
      this.listeners = [];
      this.initWebSocket(); // Ensure WebSocket is initialized on service instantiation
    }
  
    initWebSocket() {
      if (!this.socket || this.socket.readyState === WebSocket.CLOSED) {
        console.log('Initializing WebSocket...');
        this.socket = new WebSocket('ws://localhost:8765');
        this.socket.onopen = this.onOpen.bind(this);
        this.socket.onmessage = this.onMessage.bind(this);
        this.socket.onclose = this.onClose.bind(this);
        this.socket.onerror = this.onError.bind(this);
      }
    }
  
    onOpen() {
      console.log('WebSocket connection opened.');
    }
  
    onMessage(event) {
      try {
        console.log('Raw data received:', event.data); // Log raw data
        this.data = JSON.parse(event.data);
        console.log('Received data:', this.data);
        this.listeners.forEach(callback => callback(this.data));
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    }
  
    onClose() {
      console.log('WebSocket connection closed. Reconnecting...');
      setTimeout(() => {
        this.initWebSocket();
      }, 3000); // Reconnect after 3 seconds
    }
  
    onError(error) {
      console.error('WebSocket error:', error);
    }
  
    closeWebSocket() {
      if (this.socket) {
        this.socket.close();
      }
    }
  
    addListener(callback) {
      if (!this.listeners.includes(callback)) {
        this.listeners.push(callback);
      }
    }
  
    removeListener(callback) {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    }
}
  
const instance = new WebSocketService();
export default instance;
  