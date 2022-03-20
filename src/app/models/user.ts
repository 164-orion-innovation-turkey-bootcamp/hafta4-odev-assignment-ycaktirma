export class User{
    id?:number;
    username:string;
    name:string;
    password:string;
    email:string;
    constructor(username:string, name:string, password:string, email:string, id?:number){
        this.id = id;
        this.username = username;
        this.password = password;
        this.name = name;
        this.email = email;
    }
}