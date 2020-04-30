"use strict";

// Dependencies
// const express = import('express');
// const http = import('http');
// const path = import('path');
// const socketIO = import('socket.io');
import express from "express";
import http from "http";
import path from "path";
import socketIO from "socket.io";

// since this now uses es6 modules for easy importing, __dirname has to be manually set here
// also for some reason there's an extra / at the start so it gets chopped off
const __dirname = path.dirname(new URL(import.meta.url).pathname).substring(1);

import Room from "./lib/server/room.js";
import { platform } from "os";

//initialization
var app = express();
var server = http.Server(app);
var io = socketIO(server);

app.set("port", 5000);
app.use("/static", express.static("./lib/client"));
app.use("/shared", express.static("./lib/shared"));

function sendClientHTML(p, resp) {
    let opts = process.platform === "win32" ? undefined : { root: "/" };
    resp.sendFile(path.join(__dirname, "lib/client/html", p), opts);
}

//Routing
app.get("/", function (request, response) {
    sendClientHTML("index.html", response);
});

app.get("/singleplayer", function (request, response) {
    sendClientHTML("singleplayer.html", response);
});

app.get("/tutorial", function (request, response) {
    sendClientHTML("tutorial.html", response);
});

app.get("/contact", function (request, response) {
    sendClientHTML("contact.html", response);
});

app.get("/about", function (request, response) {
    sendClientHTML("about.html", response);
});

server.listen(5000, function () {
    console.log("Starting server on port 5000");
});

//setInterval(function() {io.sockets.emit('matrix', m); }, 1000);

let room = new Room();

io.on("connection", (socket) => {
    // console.log('client connected');
    //create new singleplayer game
    // let game = new Game();
    // console.log(socket.id);
    //
    // socket.on('inputState', (data) => {
    //     game.update(data);
    //
    //     socket.emit('gameView', game.getViewObject());
    // });
    // socket.emit('message', 'hello from the server');
    // socket.on('hello', () => console.log('hello'));

    console.log("new client connected");
    room.addPlayer(socket);

    socket.on("username", (data) => {
        // TODO: refactor this constant
        const MAX_USERNAME_LENGTH = 12;
        room.setPlayerUsername(
            socket.id,
            data.substring(0, MAX_USERNAME_LENGTH)
        );
    });

    socket.on("inputState", (data) => {
        room.updatePlayerInputState(socket.id, data);
    });

    socket.on("disconnect", () => {
        room.removePlayer(socket.id);
    });
});

setInterval(() => {
    room.update();
    room.sendState();
}, 1000 / 60);
