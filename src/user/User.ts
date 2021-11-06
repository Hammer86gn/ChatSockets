import {parse as uuidParse, stringify as uuidStringify} from 'uuid';
import websocket from 'ws'

type UUID = ArrayLike<number>;

export class User {
    private id: UUID
    private socket: websocket

    private name: string
    private icon: string
    private created: number

    constructor(id: string, socket: websocket, name: string) {
        this.id = uuidParse(id);
        this.socket = socket;

        this.name = this.validateName(name);
        this.icon = "https://avatars.dicebear.com/api/initials/" + this.name + ".svg"
        this.created = Date.now();
    }

    public getID(): UUID {
        return this.id;
    }

    public getName(): string {
        return this.name;
    }

    public getIcon(): string {
        return this.icon;
    }

    public getCreatedDate(): number {
        return this.created;
    }

    public getIDAsString(): string {
        return uuidStringify(this.id);
    }

    public getIconURL(): URL {
        return new URL(this.icon);
    }

    public getUserConnection(): websocket {
        return this.socket;
    }

    
    

    private validateName(name: string): string {
        let validName: string;
        
        if (name.length > 20) {
            validName = name.slice(0, 20)
        } else {
            validName = name;
        }

        validName.replace(" ", "%20") // Epic url encoding

        return validName
    }

}