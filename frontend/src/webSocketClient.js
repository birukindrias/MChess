const websocketClient = (options = {}, onConnect = null) => {
  let url = "ws://127.0.0.1:8000";
  let client = new WebSocket(url);

  client.addEventListener("open", () => {
    console.log(`[websockets] Connected to ${url}`);
  });

  client.addEventListener("close", () => {
    console.log(`[websockets] Disconnected from ${url}`);
    client = null;
  });

  if (options?.onDisconnect) {
    options.onDisconnect();
  }
};

export default websocketClient;
