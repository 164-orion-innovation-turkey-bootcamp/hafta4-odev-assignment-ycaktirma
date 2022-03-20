import { Product } from "./product";

export class UserSession{
    userId:number;
    createdDate:Date;
 
    constructor(userId:number, createdDate:Date){
        this.userId = userId;
        this.createdDate = createdDate;
    }

    stringifyUserSession(){
        return JSON.stringify({
            userId:this.userId,
            createdDate:this.createdDate
        });
    }
}