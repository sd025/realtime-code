import { io } from "socket.io-client";

export const initSocket = async () => {
  const options = {
    "force new connection": true,
    reconnectionAttempt: "Infinity",
    timeout: 10000,
    transports: ["websocket"],
  };
  const socket = io("https://realtime-code-9d9k.onrender.com/", options);

  socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
  });

  socket.on("connect_error", (err) => {
    console.error("Socket connection error:", err);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected");
  });

  return socket;
};
