export class Log{
    message:string;
    createdDate:Date;
    
    constructor(message:string, createdDate:Date){
        this.message = message;
        this.createdDate = createdDate;
    }

    getLogMessage(){
        return this.message + ' ' + this.createdDate.toString();
    }
}