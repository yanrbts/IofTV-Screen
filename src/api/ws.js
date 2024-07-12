// WebSocketService.js

const WebSocketService = {
    socket: null,
    data: {},
    initWebSocket() {
      this.socket = new WebSocket('ws://localhost:8765');
      this.socket.onopen = this.onOpen.bind(this);
      this.socket.onmessage = this.onMessage.bind(this);
      this.socket.onclose = this.onClose.bind(this);
      this.socket.onerror = this.onError.bind(this);
    },
    onOpen() {
      console.log('WebSocket connection opened.');
    },
    onMessage(event) {
      try {
        this.data = JSON.parse(event.data);
        console.log('Received data:', this.data); // 确保收到数据
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    },
    onClose() {
      setTimeout(() => {
        this.initWebSocket();
      }, 3000); // 3秒后重新连接
    },
    onError(error) {
      console.error('WebSocket error:', error);
    },
    closeWebSocket() {
      if (this.socket) {
        this.socket.close();
      }
    }
};
  
export default WebSocketService;
  