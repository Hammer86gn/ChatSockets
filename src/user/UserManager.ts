import { User } from "./User";
import {parse as uuidParse} from 'uuid';

type UUID = ArrayLike<number>;

export class UserManager {

    private users: Map<UUID ,User> = new Map();

    constructor() {

    }

    
    public addUser(user: User) {
        this.users.set(user.getID(), user)
    }

    public getUserByID(id: string): User | undefined {
        return this.users.get(uuidParse(id))
    }

    public exists(id: string): boolean {
        return this.getUserByID(id) != undefined
    }

    public removeUser(id: string) {
        this.users.delete(uuidParse(id))
    }

}