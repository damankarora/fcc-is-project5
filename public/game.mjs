import Player from './Player.mjs';
import Collectible from './Collectible.mjs';

let socket = null;
const canvas = document.getElementById('game-window');
const context = canvas.getContext('2d');

let myPlayer = null;

let otherPlayers = [];

let ourCollectible = new Collectible(0, 0, 0, 0);


async function getMyPlayerObject() {

    
    let response = await fetch('/getNewUserId');

    response = await response.text();
    console.log("my id", response);

    myPlayer = new Player({
        x: 0,
        y: 0,
        score: 0,
        id: response
    });

}

getMyPlayerObject().then(()=>{
    // User object is now set-up successfully.
    
    socket = io(`ws://localhost:3000`, {
        query: {
            id: myPlayer.id
        }
    });

    configSocket();

    
    
})
.catch((err)=>{
    console.log(err);
});


function configSocket(){
    socket.on("connect", () => {
        console.log("Connection done");

        // When a text message is received from server.
        socket.on("message", data => {
            console.log("Message from server");
            console.log(data);
        })
      
        // Add a player when he connects
        socket.on('addPlayer', (playerToAdd) => {
            if(playerToAdd.id !== myPlayer.id){
                otherPlayers.push(playerToAdd);
                console.log("added Player ", otherPlayers);
            }            
        })

        // socket.on('updateCollectible', (collectibleCordinates)=>{

        // })

        

        // Change Player position
        socket.on('changePlayerPos', (playerToUpdate)=>{
            console.log("Seomeone moved!");
            if(playerToUpdate.id === myPlayer.id){
                console.log('I moved');
                return;
            }
            console.log("Changing a player's position")
            otherPlayers = otherPlayers.map((player)=>{
                if(player.id === playerToUpdate.id){
                    player.x = playerToUpdate.x;
                    player.y = playerToUpdate.y;
                }
                console.log(player);
                return player;
            })
            
        })

        // Remove a player when disconnected
        socket.on('removePlayer', (playerIdToRemove)=>{
            otherPlayers = otherPlayers.filter((player)=>{
                return player.id !== playerIdToRemove
            });
            console.log("Removed Player", playerIdToRemove)
        })

        socket.emit('newPlayer', myPlayer);
    })
}

// Move player wrapper to emit updatePos.
function moveMyPlayer(dir, speed){
    myPlayer.movePlayer(dir, speed);
    console.log("Emitting movement event");
    socket.emit('updatePos', myPlayer);
}

// Event listener to handle player movements using WASD or Arrow keys.
document.addEventListener('keydown', (ev)=>{    
    let pressedButton = ev.key;
    
    if(pressedButton === 'w' || pressedButton === 'ArrowUp'){
        moveMyPlayer('up', 10);
    } else if (pressedButton === 's' || pressedButton === 'ArrowDown') {
        moveMyPlayer('down', 10);
    } else if (pressedButton === 'a' || pressedButton === 'ArrowLeft') {
        moveMyPlayer('left', 10);
    } else if (pressedButton === 'd' || pressedButton === 'ArrowRight') {
        moveMyPlayer('right', 10);
    }    

    console.log(myPlayer);

})

