import { User } from "../user/User"
import { UserManager } from "../user/UserManager"

export class Message {
    private id: number
    private sender: User
    private content: string
    private sentTime: number

    constructor(id: number, sender: User, content: string, sentTime: number) {
        this.id = id;
        this.sender = sender
        this.content = content
        this.sentTime = sentTime
    }

    
    public toJson(): object {
        return {
            "id": this.id,
            "sender": this.sender,
            "content": this.content,
            "sentTime": this.sentTime
        }
    }

    public static fromJson(raw: string, userManager: UserManager): Message {
        let messageRaw = JSON.parse(raw);

        let user = userManager.getUserByID(messageRaw["sender"])

        if (user == undefined) {
            throw new TypeError("User is not defined");
        }

        return new Message(messageRaw["id"], user , messageRaw["content"], messageRaw["sentTime"])
    }

    
    public getSender(): User {
        return this.sender;
    }
    
}