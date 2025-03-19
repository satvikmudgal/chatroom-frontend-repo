import { io } from "socket.io-client";

// const SOCKET_URL = process.env.REACT_APP_SOCKET_URL;

// console.log("Connecting to socket at:", SOCKET_URL);

const socket = io("https://quality-visually-stinkbug.ngrok-free.app", {
    withCredentials: true,
    extraHeaders: {
        "ngrok-skip-browser-warning": "true",
    },
});

export default socket;