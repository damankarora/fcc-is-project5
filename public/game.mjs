import Player from './Player.mjs';
import Collectible from './Collectible.mjs';
import { io } from "socket.io-client";

const socket = io(`ws://localhost:3002`);
const canvas = document.getElementById('game-window');
const context = canvas.getContext('2d');

socket.on("connect", ()=>{
    console.log("Connecting client");

    socket.on("message", data => {
        console.log("Message from server");
        console.log(data);
    })
})