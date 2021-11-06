var server = "ws://chat-sockets.glitch.me:8080" 
var websocketClient = new WebSocket(server);

function init() {

websocketClient.onopen = function(event) {
    console.log("Connected to the socket");
}

websocketClient.onmessage = function(event) {
    let data = JSON.parse(event.data);
    console.log(data);
}

}
