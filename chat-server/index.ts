import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import type { Message } from "../shared/types.ts";

const app = express();
const server = createServer(app)
const io = new Server(server, {
    cors: {
        origin: "http://localhost:8081"
    }
})

io.on('connection', (socket) => {
    console.log(socket.handshake.auth.username + " se conectou.")
    io.emit('message', {
        autor: "Easy Us",
        texto: `${socket.handshake.auth.username} se conectou.`,
        image: "favicon.png",
        id: "",
        hora: Date.now().toString()
    } satisfies Message)

    socket.on("message", (msg: Message) => {
        console.log(`(${new Date(msg.hora).toLocaleTimeString()}) ${msg.autor}: ${msg.texto}`)
        io.emit("message", msg)
    })
});

server.listen(3000, () => {
    console.log("server initialized at port 3000")
});