import { io } from "socket.io-client";

// const user = JSON.parse(localStorage.getItem("user"));
// const username = user ? user.username : "";

export const socket = io("http://localhost:3000", { auth: { username: "Teste" } })
socket.on("disconnect", (reason) => {
    console.log("socket disconnected: ", reason)
})
