import websocket, { Server, WebSocketServer } from 'ws';
import {IncomingMessage} from 'http'
import { UserManager } from './user/UserManager';
import { User } from './user/User';

import { v4 as createUUID, stringify as stringifyUUID } from 'uuid';
import { Message } from './message/Message';

const userManager = new UserManager();

 function getTypeCode(type: "hello" | "message" | "error" | "sending-success"): number {
    switch(type) {
        case "hello":
            return 1;
        case "message":
            return 2;
        case "error":
            return 3;
        case "sending-success":
            return 4;
    }
 }

function handle() {
    console.log("idk what this does");
}

function getServerOptions(backlog: number, clientTracking: boolean, handleProtocols: Function,): any {
    let obj = {"backlog": backlog, "clientTracking": clientTracking, "handleProtocols": handleProtocols, "port": 8080}  
    return obj;
}

function sendToAllSockets(socketServ: WebSocketServer, currentSocket: websocket, message: string) {
    socketServ.clients.forEach((client: websocket) => {
        if (client != currentSocket) {
            client.send(message)
        }
    })
}


const wss:WebSocketServer = new WebSocketServer(getServerOptions(5, true, handle))

wss.on('connection', (socket: websocket, req: IncomingMessage) => {
    console.log("new connection");
    socket.on('message', function incoming(message: string) {
        console.log('received: %s', message);
        var data = JSON.parse(message);

        if (data["type"] == 1) { // Register a new User
            let details = data["d"];
            let uuid = createUUID()

            userManager.addUser(new User(uuid, socket, details["name"]))

            console.log("created new user")

            socket.send('{"uuid":' + uuid + '}')
        }

        if (data["type"] == 2) { // Message Received
            let messageData = data["d"];
            
            var msg: Message = Message.fromJson(messageData, userManager);
            
            if (userManager.exists(msg.getSender().getIDAsString())) {
                let sending = {
                    "type": getTypeCode('message'),
                    "d": msg.toJson()
                }
                
                sendToAllSockets(wss, socket, JSON.stringify(sending))
                
                let confirm = {
                    "type": getTypeCode('sending-success')
                }

                socket.send(JSON.stringify(confirm))

            } else {
                let errora = {
                    "type": getTypeCode('error'),
                    "d": "Given id for user is invalid"
                }

                socket.send(JSON.stringify(errora))
            }
            

        }

    });
})