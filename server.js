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
// also for some reason there's an extra / at the start so it has to get chopped off if it's being hosted locally
let dir = path.dirname(new URL(import.meta.url).pathname);
if (dir.substring(1, 3) == "C:") {
    dir = dir.substring(1);
}
const __dirname = dir;
const PORT = process.env.PORT || 5000;

import Room from "./lib/server/room.js";
import censor from "./lib/shared/js/censor.js";
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
app.set('port', PORT);
app.use('/static', express.static(__dirname + '/lib/client'));
app.use('/shared', express.static(__dirname + '/lib/shared'));


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

server.listen(PORT, function() {
    console.log('Starting server on port 5000');
});

//setInterval(function() {io.sockets.emit('matrix', m); }, 1000);

let room = new Room();

io.on('connection', (socket) => {

    console.log("new client connected");
    room.addPlayer(socket);

    socket.on("username", (data) => {
        // TODO: refactor this constant
        const MAX_USERNAME_LENGTH = 32;
        let validatedUsername = censor(data.substring(0, MAX_USERNAME_LENGTH));
        room.setPlayerUsername(
            socket.id,
            validatedUsername
        );
        socket.emit("recieveUsername", validatedUsername);
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
