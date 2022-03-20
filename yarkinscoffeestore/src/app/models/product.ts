export class Product{
    id:number;
    name:string;
    shortDescription:string;
    description:string;
    price:string;
    image:string;
    category:number;

    constructor(id:number ,name:string, shortDescription:string, description:string, price:string, image:string, category:number){
        this.id = id;
        this.name = name;
        this.shortDescription = shortDescription;
        this.description = description;
        this.price = price;
        this.image = image;
        this.category = category;
    }
}